#!/usr/bin/env python3
"""Record the spoken attraction guides, and only the ones still missing.

    python3 voice_guides.py               # record what is missing, then report
    python3 voice_guides.py --dry         # say what it would record, spend nothing
    python3 voice_guides.py --lang ja     # record the Japanese narrations
    python3 voice_guides.py --voice NAME  # use a different reader

Languages. English scripts live in guide_scripts.json; every other language
lives in guide_scripts.<lang>.json with the same slugs, and records to
media/audio/guide-<slug>.<lang>.mp3. The player asks for the reader's own
language and falls back to English, so a half-translated guide is never a
silent one. ElevenLabs speaks all of these in the same voice, so a visitor
switching to 日本語 hears the same guide, not a different stranger.

Voices. ELEVENLABS_VOICE_ID is the house reader. Any language can have its
own with ELEVENLABS_VOICE_ID_JA, _ZH, _ES, _KO, _VI, which is worth doing
when a native reader sounds better than the house voice speaking through
an accent.

The guides are files, not an API call at read time: a traveller standing in
Pike Place should not wait on anyone's servers, and a voice that costs money
per play would quietly become a bill that scales with success. Recorded once,
served from /media/audio, cached by the browser.

Two facts this script is careful about:

  QUOTA IS REAL. The free tier is 10,000 characters a month, which is roughly
  a dozen of these. When it runs out the API answers 401 with the word
  quota_exceeded, which reads like a broken key and is not one. This script
  says so in plain words and stops, rather than retrying into the same wall.

  IT NEVER RE-RECORDS. Existing files are left alone, so running it twice
  costs nothing. To redo one guide, delete its file first.

Needs ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID in the environment. The
voice is George, the same one Jarvis speaks with, so the site has one voice
rather than a different stranger on every page.
"""

import json
import os
import sys
import time
import urllib.error
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(BASE, "media", "audio")
MODEL = "eleven_multilingual_v2"
PAUSE_S = 4                 # spacing: the API rate-limits a fast loop


def scripts_path(lang):
    return os.path.join(BASE, "guide_scripts.json" if lang == "en"
                        else "guide_scripts.%s.json" % lang)


def out_path(slug, lang):
    """English keeps the plain name, so every guide recorded before this
    file learned about languages still plays."""
    return os.path.join(OUTDIR, "guide-%s.mp3" % slug if lang == "en"
                        else "guide-%s.%s.mp3" % (slug, lang))


def voice_for(lang):
    """A per-language reader if one is set, otherwise the house voice."""
    return (os.environ.get("ELEVENLABS_VOICE_ID_%s" % lang.upper(), "").strip()
            or os.environ.get("ELEVENLABS_VOICE_ID", "").strip())


def load_scripts(lang):
    try:
        with open(scripts_path(lang), encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        return {}
    return {k: v for k, v in data.items() if not k.startswith("_")}


def record(key, voice, text):
    """One guide. Returns (bytes, None) or (None, reason)."""
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/text-to-speech/%s?output_format=mp3_44100_64" % voice,
        data=json.dumps({"text": text, "model_id": MODEL}).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
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
    os.makedirs(OUTDIR, exist_ok=True)
    if not scripts:
        print("No scripts for %s. Write %s first." % (lang, os.path.basename(scripts_path(lang))))
        return 1

    missing = [(k, v) for k, v in scripts.items() if not os.path.exists(out_path(k, lang))]
    have = len(scripts) - len(missing)
    chars = sum(len(v) for _, v in missing)

    print("%s: %d scripts, %d already recorded, %d to go (%d characters)"
          % (lang, len(scripts), have, len(missing), chars))
    if not missing:
        print("Everything in the queue has a voice.")
        return 0
    if dry:
        for k, v in missing:
            print("  would record %-32s %4d chars" % (k, len(v)))
        return 0
    if not key or not voice:
        print("No ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in the environment.")
        return 1

    made, failed = [], []
    for k, text in missing:
        audio, why = record(key, voice, text)
        if why == "QUOTA":
            print("\nOut of characters at ElevenLabs. %d recorded this run, %d still waiting."
                  % (len(made), len(missing) - len(made)))
            print("The free tier resets monthly; a paid plan lifts it immediately.")
            print("Nothing is broken and nothing was lost: run this again and it")
            print("picks up exactly where it stopped.")
            break
        if why:
            failed.append((k, why))
            print("  failed  %-32s %s" % (k, why))
            continue
        with open(out_path(k, lang), "wb") as f:
            f.write(audio)
        made.append(k)
        print("  voiced  %-32s %6d bytes" % (k, len(audio)))
        time.sleep(PAUSE_S)

    print("\nrecorded %d, failed %d" % (len(made), len(failed)))
    if made and lang == "en":
        print("Add each new slug to destinations.json as \"audio\": "
              "\"/media/audio/guide-<slug>.mp3\" so the book and the planner play it.")
    elif made:
        print("Nothing else to wire: the player asks for the reader's language "
              "and finds these by name.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
