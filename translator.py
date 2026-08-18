# -*- coding: utf-8 -*-
"""Automatic, anchored translation for posted articles.

The contract, in one line: a translation is stored against the content hash
of the exact text it translates, paragraph-aligned, or it is not stored.

Why so strict. The site showed an article in English next to a Chinese text
that translated a DIFFERENT version of it, and the owner caught it before
anyone here did. The fix is structural, not procedural: the store is keyed
by a fingerprint of the source text, and the server refuses any entry whose
paragraph count disagrees with the source. Under that contract the worst
possible failure is a missing translation, never a wrong one.

How it runs. When an article is posted, a background thread asks a model to
translate it paragraph by paragraph and writes the result to the runtime
store. It needs ANTHROPIC_API_KEY in the environment; without one it does
nothing, quietly, and the article simply has no language row until a
translation exists. Nothing here can block or break a post: the thread is
fail-silent by design, because a failed translation must cost the reader
nothing.

Cost, honestly: a Haiku-class model translates a 700-word article for well
under a cent. The cap below is generous and exists so a runaway loop cannot
become a bill.
"""

import hashlib
import json
import os
import threading

try:
    import requests
except Exception:                      # pragma: no cover
    requests = None

API_URL = "https://api.anthropic.com/v1/messages"
<<<<<<< HEAD
# A translation is read once by a person, not scanned by a machine, so fluency
# is worth more than the speed and the few cents Haiku saves. Sonnet reads far
# more naturally for prose. Overridable: TRANSLATE_MODEL=claude-opus-5 for the
# smoothest, or claude-haiku-4-5-20251001 to go back to cheap and fast.
MODEL = os.environ.get("TRANSLATE_MODEL", "claude-sonnet-5")
LANGS = [l.strip() for l in os.environ.get("TRANSLATE_LANGS", "zh,es,ko,vi").split(",") if l.strip()]
=======
MODEL = os.environ.get("TRANSLATE_MODEL", "claude-haiku-4-5-20251001")
LANGS = [l.strip() for l in os.environ.get("TRANSLATE_LANGS", "zh,es,ko,vi,ja").split(",") if l.strip()]
>>>>>>> 9702f9e (Japanese joins the site, and the pack route stops naming languages)
MAX_PARAS = 80                          # a post, not a book
_LOCK = threading.Lock()

LANG_NAMES = {"zh": "Simplified Chinese", "es": "Spanish",
              "ko": "Korean", "vi": "Vietnamese", "ja": "Japanese"}


def content_hash(title, body):
    """Must stay byte-identical to app._content_hash: same input, same key."""
    norm = (title or "").strip() + "\n" + "\n".join(
        p.strip() for p in (body or "").split("\n") if p.strip())
    return hashlib.sha256(norm.encode("utf-8")).hexdigest()[:16]


def _store_path():
    base = os.environ.get("DATA_DIR", "").strip() or os.path.dirname(os.path.abspath(__file__))
    return os.path.join(base, "article_translations_runtime.json")


def _translate_one(key, title, paras, lang):
    """One language, one article. Returns (title, paras) or None.

    The prompt hands the model numbered paragraphs and demands the same
    numbering back, because paragraph alignment is the anchor the reader
    sees: paragraph 7 in Chinese must be paragraph 7 in English. A response
    with the wrong count is discarded, not repaired.
    """
    numbered = "\n".join("[%d] %s" % (i + 1, p) for i, p in enumerate(paras))
    prompt = (
        "Translate this article into natural, fluent %s, the way a native "
        "speaker would actually write it. Translate the meaning, not the words: "
        "reorder and rephrase as the target language needs so it reads smoothly "
        "and idiomatically, never word for word and never stiff. Keep the "
        "author's tone and their plain, human voice. Do not summarise, do not "
        "add anything, do not explain, do not use em dashes or en dashes.\n\n"
        "Return ONLY JSON: {\"title\": \"...\", \"paras\": [\"...\"]} with exactly "
        "%d entries in paras, one per numbered paragraph, same order. A heading "
        "stays a heading. Numbers like '1.' at the start of a paragraph stay.\n\n"
        "TITLE: %s\n\nPARAGRAPHS:\n%s" % (LANG_NAMES.get(lang, lang), len(paras), title, numbered)
    )
    r = requests.post(API_URL, timeout=120, headers={
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }, json={
        "model": MODEL,
        "max_tokens": 8000,
        "messages": [{"role": "user", "content": prompt}],
    })
    r.raise_for_status()
    text = "".join(b.get("text", "") for b in r.json().get("content", []))
    start, end = text.find("{"), text.rfind("}")
    data = json.loads(text[start:end + 1])
    out_paras = [str(p).strip() for p in data.get("paras", [])]
    if len(out_paras) != len(paras) or not all(out_paras):
        return None                     # misaligned: refuse, do not repair
    return str(data.get("title", "")).strip() or title, out_paras


def _run(title, body):
    key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not key or requests is None:
        return
    paras = [p.strip() for p in (body or "").split("\n") if p.strip()]
    if not paras or len(paras) > MAX_PARAS:
        return
    h = content_hash(title, body)
    path = _store_path()
    for lang in LANGS:
        try:
            with _LOCK:
                try:
                    with open(path, encoding="utf-8") as f:
                        store = json.load(f)
                except Exception:
                    store = {"by_hash": {}}
                if lang in (store.get("by_hash", {}).get(h) or {}):
                    continue            # already translated this exact text
            got = _translate_one(key, title, paras, lang)
            if not got:
                continue
            t_title, t_paras = got
            with _LOCK:
                try:
                    with open(path, encoding="utf-8") as f:
                        store = json.load(f)
                except Exception:
                    store = {"by_hash": {}}
                store.setdefault("by_hash", {}).setdefault(h, {})[lang] = {
                    "src_title": title, "title": t_title, "paras": t_paras}
                tmp = path + ".tmp"
                with open(tmp, "w", encoding="utf-8") as f:
                    json.dump(store, f, ensure_ascii=False)
                os.replace(tmp, path)
        except Exception:
            pass                        # a failed translation costs the reader nothing


def translate_async(title, body):
    """Fire and forget. Never blocks a post, never raises."""
    try:
        threading.Thread(target=_run, args=(title, body), daemon=True).start()
    except Exception:
        pass


def available():
    """True when there is actually an engine behind the feature.

    Without a key this whole module is a quiet no-op, and a reader who
    switched language deserves to be told 'not available' rather than left
    staring at English wondering if the button is broken. This is the one
    fact that separates 'no translation yet' from 'no translator at all'.
    """
    return requests is not None and bool(os.environ.get("ANTHROPIC_API_KEY", "").strip())


def translate_now(title, body, lang):
    """Translate ONE language, synchronously, for a reader waiting on it.

    Same contract as the background path: a hit on the store is free, a miss
    makes one model call and caches it, and a result whose paragraph count
    does not match the source is refused rather than shown. Returns
    {"title", "paras", "body"} on success, or None on any failure, so the
    caller can fall back to the original without a translation ever being
    wrong.
    """
    key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not key or requests is None:
        return None
    if lang not in LANG_NAMES and lang not in LANGS:
        return None
    paras = [p.strip() for p in (body or "").split("\n") if p.strip()]
    if not paras or len(paras) > MAX_PARAS:
        return None
    h = content_hash(title, body)
    path = _store_path()
    # Already in the store? Serve it and skip the model call entirely.
    with _LOCK:
        try:
            with open(path, encoding="utf-8") as f:
                store = json.load(f)
        except Exception:
            store = {"by_hash": {}}
        have = (store.get("by_hash", {}).get(h) or {}).get(lang)
    if have and have.get("paras") and len(have["paras"]) == len(paras):
        return {"title": have.get("title") or title, "paras": have["paras"],
                "body": "\n\n".join(have["paras"])}
    try:
        got = _translate_one(key, title, paras, lang)
    except Exception:
        return None
    if not got:
        return None
    t_title, t_paras = got
    with _LOCK:
        try:
            with open(path, encoding="utf-8") as f:
                store = json.load(f)
        except Exception:
            store = {"by_hash": {}}
        store.setdefault("by_hash", {}).setdefault(h, {})[lang] = {
            "src_title": title, "title": t_title, "paras": t_paras}
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(store, f, ensure_ascii=False)
        os.replace(tmp, path)
    return {"title": t_title, "paras": t_paras, "body": "\n\n".join(t_paras)}
