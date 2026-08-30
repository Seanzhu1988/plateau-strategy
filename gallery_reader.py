# -*- coding: utf-8 -*-
"""A real reading of any artwork, written the moment a traveller points at it.

The curated gallery is a handful of works somebody sat down and wrote a guide
for. That is the demo. The MOAT is this: a traveller standing in a foreign
museum reads the number off a label, the search finds the object, and this
writes them a guide to it on the spot, in their own language, for a work nobody
here has ever written about. Metadata anyone can get. A voice telling you what
to notice in the two minutes you are standing there is the thing you cannot get
anywhere else, and now it does not have to be written in advance.

How it runs. It is the same engine the article translator uses: one call to the
Anthropic API with ANTHROPIC_API_KEY from the environment, the Render-safe road,
not the owner's laptop CLI. Without a key the whole feature is a quiet no-op and
the search still shows every fact it always did; the reading button simply is
not offered. Nothing here can block or break a search.

The contract. A reading is stored against the identity of the exact object it
reads (the museum, the label number, the title and maker), and against the
language it is written in, so the second traveller to point at The Night Watch
in Korean pays nothing. A hit on the store is free; a miss makes one model call
and caches it for everyone after.

Cost, honestly: a few hundred words from a Sonnet-class model is a fraction of a
cent, and it is written once per work per language and then free forever. The
monthly cap below exists so a script hammering the endpoint with junk titles
cannot turn a fraction of a cent into a bill.

The house rules travel too. No em dashes or en dashes, ever, the owner's
standing rule; they are stripped from the output as a guarantee and not only
asked for. No invented specifics: the prompt tells the model to guide the
looking rather than state a fact it is unsure of, because a confidently wrong
detail in front of the real object is worse than a general one.
"""

import hashlib
import json
import os
import threading
import time

try:
    import requests
except Exception:                      # pragma: no cover
    requests = None

API_URL = "https://api.anthropic.com/v1/messages"
# A reading is heard once by a person standing in a gallery, so how it reads is
# the whole product and a Sonnet-class model earns its fraction of a cent.
# Overridable: GALLERY_MODEL=claude-opus-5 for the smoothest, or a Haiku id to
# go cheap and fast.
MODEL = os.environ.get("GALLERY_MODEL", "claude-sonnet-5")

# The languages the site already speaks. A reading is written directly in the
# reader's language, never English then translated, because the point is the
# person who cannot read the label in front of them.
LANG_NAMES = {"en": "English", "zh": "Simplified Chinese", "es": "Spanish",
              "ko": "Korean", "vi": "Vietnamese", "ja": "Japanese"}

# A runaway loop, or somebody poking the endpoint with a script, must not become
# a bill. Cache makes real use nearly free; this caps the misses. Generous
# enough that a genuinely busy month of new works never touches it.
MONTHLY_CAP = int(os.environ.get("GALLERY_MONTHLY_CAP", "1500"))

BASE = os.path.dirname(os.path.abspath(__file__))
# The reading written on the spot must sound like the ones written by hand, or
# the gallery has two voices and the seam shows. Rather than describe that voice
# in the abstract, the generator is handed an actual hand-written reading to
# match, so the two builds are aligned to the same real example and stay aligned
# when the house style is edited. Two anchors so the one work a reader happens to
# be searching is never used as the sample for itself. Public domain both, so
# nothing under copyright rides along in a prompt.
_ANCHOR_FILES = ["gallery_scripts/the-great-wave.txt",
                 "gallery_scripts/la-grande-jatte.txt"]

_LOCK = threading.Lock()


def _style_anchor(title):
    """One hand-written reading, to show the model the house voice by example.
    Skips the anchor whose own subject is the work being read, so a search for
    The Great Wave is not handed The Great Wave as its sample."""
    t = (title or "").strip().lower()
    for rel in _ANCHOR_FILES:
        stem = os.path.splitext(os.path.basename(rel))[0].replace("-", " ")
        if stem and stem in t:
            continue
        try:
            with open(os.path.join(BASE, rel), encoding="utf-8") as f:
                text = f.read().strip()
            if text:
                return text
        except Exception:
            pass
    return ""


def available():
    """True when there is actually an engine behind the feature.

    Without a key this whole module is a quiet no-op, and a search that offered
    a reading button which then said 'not available' would be worse than one
    that never offered it. This is the fact the search asks before showing the
    button at all.
    """
    return requests is not None and bool(os.environ.get("ANTHROPIC_API_KEY", "").strip())


def _store_path():
    base = os.environ.get("DATA_DIR", "").strip() or os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base, "gallery_readings_runtime.json")


def _load_store():
    try:
        with open(_store_path(), encoding="utf-8") as f:
            s = json.load(f)
    except Exception:
        s = {}
    s.setdefault("by_key", {})
    s.setdefault("spend", {})
    return s


def _save_store(s):
    tmp = _store_path() + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(s, f, ensure_ascii=False)
    os.replace(tmp, _store_path())


def work_key(facts):
    """A stable fingerprint of one object, so the same work maps to the same
    reading however the search phrased the row. The museum and the label number
    identify a thing in the world; the title and maker pin it when a number is
    missing. Lowercased and stripped so trivial differences do not split a work
    into two cache entries."""
    parts = [str(facts.get(k) or "").strip().lower() for k in
             ("museum", "item_number", "title", "artist")]
    return hashlib.sha256("|".join(parts).encode("utf-8")).hexdigest()[:16]


def _no_dashes(text):
    """The owner's standing rule, enforced not just asked for. Mirrors
    app._no_em_dash: the long dash makes prose read as machine written, so no
    reading on this site carries one. Words are never touched, only the
    punctuation."""
    if not text:
        return text
    for double in (" —— ", "—— ", " ——", "——"):
        text = text.replace(double, "，")
    for dash in ("—", "–", "⸺", "⸻"):
        text = text.replace(" " + dash + " ", ", ")
        text = text.replace(dash + " ", ", ")
        text = text.replace(" " + dash, ", ")
        text = text.replace(dash, ", ")
    return text


def _minutes(text):
    """About 150 words a minute read aloud. A language with spaces is counted by
    words; one without (Chinese, Japanese) by characters, roughly 300 to the
    minute, because a word count of a spaceless language is meaningless."""
    words = len(text.split())
    if words >= 40:
        return max(2, round(words / 150.0))
    return max(2, round(len(text) / 300.0))


def _facts_block(facts):
    """The identity of the object, handed to the model as plain lines. Only what
    we actually know; a missing room or date simply is not named."""
    lines = []
    if facts.get("title"):
        lines.append("Title: %s" % facts["title"])
    if facts.get("artist"):
        lines.append("Maker: %s" % facts["artist"])
    if facts.get("date"):
        lines.append("Date: %s" % facts["date"])
    if facts.get("museum"):
        lines.append("Museum: %s" % facts["museum"])
    if facts.get("city"):
        lines.append("City: %s" % facts["city"])
    where = facts.get("where")
    if where and where != facts.get("museum"):
        lines.append("Room or gallery: %s" % where)
    if facts.get("item_number"):
        lines.append("Number on the label: %s" % facts["item_number"])
    return "\n".join(lines)


def _prompt(facts, lang):
    lang_name = LANG_NAMES.get(lang, "English")
    copyright_note = (
        "This work is still under copyright, so the site shows no picture of it. "
        "Do not describe it as if a picture were on the screen; write so the "
        "reading helps the traveller find and look at the real object in front "
        "of them.\n\n"
        if facts.get("copyright") else "")
    anchor = _style_anchor(facts.get("title"))
    anchor_block = (
        "HERE IS ONE OF OUR READINGS, for a different work, so you match its "
        "voice and its shape. Do not reuse its facts or its sentences, only its "
        "manner.\n\n" + anchor + "\n\n" if anchor else "")
    return (
        "You are the voice of a museum guide speaking to one traveller who is "
        "standing in front of this artwork right now, phone in hand, in a museum "
        "that may not be in their language. Write them a reading of it that "
        "sounds like the example below.\n\n"
        + anchor_block +
        "Follow the same shape, in this order:\n"
        "1. Name the work and its maker, say where it hangs and the number on "
        "its label, so they can confirm they are in front of the right object.\n"
        "2. One line to help them find it or ready them for it: how big it is, "
        "whether it may not be on the wall, that there is usually a crowd, "
        "whatever is true and useful.\n"
        "3. What it shows, plainly.\n"
        "4. Guide the looking with their body: step close and see one thing, "
        "then stand back and see another. Point at something specific to find.\n"
        "5. The idea underneath it, or the thing most people get wrong about it.\n"
        "6. One fact that opens the world a little, if you know a real one.\n"
        "7. Close by sending them back to the object with a concrete thing or "
        "two to do while they stand there.\n\n"
        "Voice: warm, plain, human, present tense, speaking to 'you'. Short "
        "sentences. Spell numbers and years as words, because this is read "
        "aloud, so 'eighteen thirty one', not '1831'. About 450 to 550 words, "
        "roughly three minutes.\n\n"
        "Do not invent specific facts. If you are not certain of a particular "
        "detail about this exact work, guide what to notice instead of stating "
        "something you are unsure of. Never claim a number, a date or an event "
        "you do not know.\n\n"
        + copyright_note +
        "Write entirely in %s. Do not use em dashes or en dashes; use commas and "
        "periods. Return only the reading itself, no title line, no headings, no "
        "markdown, no preamble.\n\n"
        "THE OBJECT TO READ:\n%s" % (lang_name, _facts_block(facts)))


def _spend_ok(store):
    """Under the monthly cap? Counted per calendar month so the ceiling resets
    on its own and a busy month never has to be cleared by hand."""
    month = time.strftime("%Y-%m")
    return int(store.get("spend", {}).get(month, 0)) < MONTHLY_CAP


def _spend_add(store):
    month = time.strftime("%Y-%m")
    store.setdefault("spend", {})[month] = int(store.get("spend", {}).get(month, 0)) + 1


def cached_reading(facts, lang="en"):
    """The stored reading for this work and language, or None, WITHOUT ever
    calling the model. Lets a guide page server render a reading it already has,
    so a crawler sees real text on every work that has been read once, and fall
    back to generating client side only when it does not exist yet."""
    if lang not in LANG_NAMES:
        lang = "en"
    if len((facts.get("title") or "").strip()) < 2:
        return None
    key = work_key(facts)
    try:
        with _LOCK:
            store = _load_store()
            have = (store.get("by_key", {}).get(key) or {}).get(lang)
        if have and have.get("text"):
            return {"text": have["text"],
                    "minutes": have.get("minutes") or _minutes(have["text"])}
    except Exception:
        pass
    return None


def read_for(facts, lang):
    """One reading, one work, one language. Returns {"text","minutes","cached"}
    on success or None on any failure, so the caller can fall back to showing
    only the facts without a reading ever being wrong or half written.

    Same contract as the translator's on-demand path: a hit on the store is
    free and makes no call, a miss makes one call and caches it, and the house
    rule against long dashes is enforced on the way out.
    """
    if not available():
        return None
    if lang not in LANG_NAMES:
        lang = "en"
    title = (facts.get("title") or "").strip()
    if len(title) < 2:
        return None
    key = work_key(facts)

    with _LOCK:
        store = _load_store()
        have = (store.get("by_key", {}).get(key) or {}).get(lang)
        if have and have.get("text"):
            return {"text": have["text"], "minutes": have.get("minutes")
                    or _minutes(have["text"]), "cached": True}
        if not _spend_ok(store):
            return None

    key_env = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    try:
        r = requests.post(API_URL, timeout=120, headers={
            "x-api-key": key_env,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }, json={
            "model": MODEL,
            "max_tokens": 2000,
            "messages": [{"role": "user", "content": _prompt(facts, lang)}],
        })
        r.raise_for_status()
        text = "".join(b.get("text", "") for b in r.json().get("content", [])).strip()
    except Exception:
        return None
    text = _no_dashes(text)
    if len(text) < 200:                  # too short to be a real reading: refuse
        return None
    mins = _minutes(text)

    with _LOCK:
        store = _load_store()
        store.setdefault("by_key", {}).setdefault(key, {})[lang] = {
            "text": text, "minutes": mins,
            "title": title, "museum": facts.get("museum") or "",
            "item_number": facts.get("item_number") or "",
            "at": time.strftime("%Y-%m-%dT%H:%M:%S")}
        _spend_add(store)
        _save_store(store)
    return {"text": text, "minutes": mins, "cached": False}
