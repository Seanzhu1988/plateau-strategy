#!/usr/bin/env python3
"""Record the spoken attraction guides in the site voice, and only what changed.

    python3 voice_guides.py               # record what is missing or out of date
    python3 voice_guides.py --dry         # say what it would record, spend nothing
    python3 voice_guides.py --lang ja     # record the Japanese narrations
    python3 voice_guides.py --voice NAME  # use a different reader

Languages. English scripts live in guide_scripts.json; every other language
lives in guide_scripts.<lang>.json with the same slugs, and records to
media/audio/guide-<slug>.<lang>.mp3. The player asks for the reader's own
language and falls back to English, so a half-translated guide is never a
silent one. ElevenLabs speaks all of these in the same voice, so a visitor
switching to another language hears the same guide, not a different stranger.

The guides are files, not an API call at read time: a traveller standing in
Pike Place should not wait on anyone's servers, and a voice that costs money
per play would quietly become a bill that scales with success. Recorded once,
served from /media/audio, cached by the browser.

THE SITE VOICE IS JASON. It is set here, in DEFAULT_VOICE, not in an environment
variable somebody has to remember to set, so the site sounds like itself out of
the box. ELEVENLABS_VOICE_ID overrides it, and a per-language reader can be set
with ELEVENLABS_VOICE_ID_JA, _ZH, _ES, _KO, _VI, worth doing when a native
reader beats the house voice speaking through an accent.

Facts this script is careful about:

  IT RE-RECORDS WHEN THE VOICE OR THE WORDS CHANGE. Every recording is stamped in
  media/audio/_recorded.json with the voice it used and a fingerprint of the
  script. Change the voice, or rewrite a script, and the next run redoes exactly
  those and leaves the rest alone. This is how switching the whole site to a new
  voice is one edit and one run, not a hunt through a folder.

  EVERY ENGLISH GUIDE RUNS AT LEAST THREE MINUTES. A guide is something you
  settle into, not a station announcement, so an English script shorter than
  MIN_WORDS (about three minutes of speech) is refused rather than recorded, and
  named as a to-do instead. Other languages are not word-counted, because a
  language without spaces cannot be, so a translated guide records whenever it is
  missing or changed.

  QUOTA IS REAL. The free tier is 10,000 characters a month, which at three
  minutes a guide is barely three of them; the full English set is around
  seventy thousand characters and needs a paid plan. When it runs out the API
  answers 401 with the word quota_exceeded, which reads like a broken key and is
  not one. This script says so in plain words and stops.

  NOTHING IS LOST ON A STOP. It writes the stamp after each file, so a run that
  stops on quota picks up exactly where it left off next time.

Needs ELEVENLABS_API_KEY in the environment. The key is a secret and lives in the
host's environment (on Render, under Environment), never in git.
"""

import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(BASE, "media", "audio")
MANIFEST = os.path.join(OUTDIR, "_recorded.json")
MODEL = "eleven_multilingual_v2"

# Jason, Natural Narrator: warm, steady North American voice. The one the whole
# site speaks with. Overridable by ELEVENLABS_VOICE_ID, but it should not need
# to be.
DEFAULT_VOICE = "6nukEV6JAgCcOkdtH5FM"

# About 450 words is three minutes of narration at an unhurried pace. English
# scripts shorter than this are held back as unfinished; see the docstring for
# why other languages are not word-counted.
MIN_WORDS = 450

PAUSE_S = 4                 # spacing: the API rate-limits a fast loop


def scripts_path(lang):
    return os.path.join(BASE, "guide_scripts.json" if lang == "en"
                        else "guide_scripts.%s.json" % lang)


def out_path(slug, lang):
    """English keeps the plain name, so every guide recorded before this file
    learned about languages still plays."""
    return os.path.join(OUTDIR, "guide-%s.mp3" % slug if lang == "en"
                        else "guide-%s.%s.mp3" % (slug, lang))


def voice_for(lang):
    """A per-language reader if one is set, then the house override, then Jason."""
    return (os.environ.get("ELEVENLABS_VOICE_ID_%s" % lang.upper(), "").strip()
            or os.environ.get("ELEVENLABS_VOICE_ID", "").strip()
            or DEFAULT_VOICE)


def load_scripts(lang):
    try:
        with open(scripts_path(lang), encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        return {}
    return {k: v for k, v in data.items() if not k.startswith("_")}


def load_manifest():
    try:
        with open(MANIFEST, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_manifest(m):
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(m, f, ensure_ascii=False, indent=1, sort_keys=True)


def sig(text):
    """A short fingerprint of a script, so a rewrite is noticed."""
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:12]


def too_short(text, lang):
    """An English guide under three minutes is unfinished. A language without
    spaces cannot be word-counted, so it is never held back on length."""
    return lang == "en" and len(text.split()) < MIN_WORDS


def status(slug, text, voice, lang, manifest):
    """'short' (English, under three minutes), 'have' (already recorded in this
    voice from this exact script), or 'record' (missing, or the voice or words
    changed). The manifest is keyed by the output filename, so English and each
    language are tracked separately."""
    if too_short(text, lang):
        return "short"
    p = out_path(slug, lang)
    if not os.path.exists(p):
        return "record"
    m = manifest.get(os.path.basename(p)) or {}
    if m.get("voice") != voice or m.get("sig") != sig(text):
        return "record"
    return "have"


def record(key, voice, text):
    """One guide. Returns (bytes, None) or (None, reason)."""
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/text-to-speech/%s?output_format=mp3_44100_64" % voice,
        data=json.dumps({"text": text, "model_id": MODEL}).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            audio = r.read()
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode("utf-8", "replace")[:400]
        except Exception:
            pass
        if "quota_exceeded" in body:
            return None, "QUOTA"
        return None, "HTTP %s %s" % (e.code, body[:160])
    except Exception as e:
        return None, str(e)[:160]
    if audio[:3] not in (b"ID3", b"\xff\xfb", b"\xff\xf3"):
        return None, "the reply was not an mp3"
    return audio, None


def main():
    dry = "--dry" in sys.argv
    lang = "en"
    if "--lang" in sys.argv:
        try:
            lang = sys.argv[sys.argv.index("--lang") + 1].strip().lower()
        except Exception:
            pass
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    voice = voice_for(lang)
    if "--voice" in sys.argv:
        try:
            voice = sys.argv[sys.argv.index("--voice") + 1].strip()
        except Exception:
            pass
    scripts = load_scripts(lang)
    manifest = load_manifest()
    os.makedirs(OUTDIR, exist_ok=True)
    if not scripts:
        print("No scripts for %s. Write %s first."
              % (lang, os.path.basename(scripts_path(lang))))
        return 1

    have, short, todo = [], [], []
    for slug, text in scripts.items():
        st = status(slug, text, voice, lang, manifest)
        if st == "have":
            have.append(slug)
        elif st == "short":
            short.append((slug, len(text.split())))
        else:
            todo.append((slug, text))

    chars = sum(len(t) for _, t in todo)
    print("%s | voice %s | %d guides: %d current, %d to record, %d too short"
          % (lang, voice, len(scripts), len(have), len(todo), len(short)))

    if short:
        print("\nToo short to be a three minute guide, expand these first:")
        for slug, w in sorted(short):
            print("  %-32s %4d words  (~%.1f min, needs ~%d)"
                  % (slug, w, w / 150.0, MIN_WORDS))

    if not todo:
        print("\nEverything long enough already has this voice." if not short
              else "\nNothing ready to record until the short ones are expanded.")
        return 0

    print("\nReady to record (%d characters):" % chars)
    for slug, text in todo:
        print("  %-32s %5d chars" % (slug, len(text)))

    if dry:
        return 0
    if not key:
        print("\nNo ELEVENLABS_API_KEY in the environment. Nothing recorded.")
        print("Set it where the site runs (on Render, under Environment) and run again.")
        return 1

    made, failed = [], []
    for slug, text in todo:
        audio, why = record(key, voice, text)
        if why == "QUOTA":
            print("\nOut of characters at ElevenLabs. %d recorded this run, %d still waiting."
                  % (len(made), len(todo) - len(made)))
            print("A three minute guide is a few thousand characters, so the free")
            print("tier runs out fast; a paid plan lifts it. Nothing is lost: run")
            print("this again and it picks up exactly where it stopped.")
            break
        if why:
            failed.append((slug, why))
            print("  failed  %-32s %s" % (slug, why))
            continue
        p = out_path(slug, lang)
        with open(p, "wb") as f:
            f.write(audio)
        manifest[os.path.basename(p)] = {"voice": voice, "sig": sig(text),
                                         "words": len(text.split()), "chars": len(text)}
        save_manifest(manifest)
        made.append(slug)
        print("  voiced  %-32s %6d bytes" % (slug, len(audio)))
        time.sleep(PAUSE_S)

    print("\nrecorded %d, failed %d" % (len(made), len(failed)))
    if made and lang == "en":
        print("New slugs need an \"audio\": \"/media/audio/guide-<slug>.mp3\" line in "
              "destinations.json so the book and the planner play them.")
    elif made:
        print("Nothing else to wire: the player asks for the reader's language "
              "and finds these by name.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
