#!/usr/bin/env python3
"""Record the spoken attraction guides in the site voice, and only what changed.

    python3 voice_guides.py            # record what is missing or out of date
    python3 voice_guides.py --dry      # say what it would record, spend nothing

The guides are files, not an API call at read time: a traveller standing in
Pike Place should not wait on anyone's servers, and a voice that costs money
per play would quietly become a bill that scales with success. Recorded once,
served from /media/audio, cached by the browser.

THE SITE VOICE IS JASON. It is set here, in DEFAULT_VOICE, not in an environment
variable somebody has to remember to set, so the site sounds like itself out of
the box. ELEVENLABS_VOICE_ID still overrides it if you ever want to try another.

Four facts this script is careful about:

  IT RE-RECORDS WHEN THE VOICE OR THE WORDS CHANGE. Every recording is stamped in
  media/audio/_recorded.json with the voice it used and a fingerprint of the
  script. Change the voice, or rewrite a script, and the next run redoes exactly
  those and leaves the rest alone. This is how switching the whole site to a new
  voice is one edit and one run, not a hunt through a folder.

  EVERY GUIDE RUNS AT LEAST THREE MINUTES. A guide is something you settle into,
  not a station announcement, so a script shorter than MIN_WORDS (about three
  minutes of speech) is refused rather than recorded. A too-short script is a
  to-do, and the script says so by name instead of quietly voicing a stub.

  QUOTA IS REAL. The free tier is 10,000 characters a month, which at three
  minutes a guide is barely three of them; the full set of twenty five is around
  seventy thousand characters and needs a paid plan. When it runs out the API
  answers 401 with the word quota_exceeded, which reads like a broken key and is
  not one. This script says so in plain words and stops, rather than retrying
  into the same wall.

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
SCRIPTS = os.path.join(BASE, "guide_scripts.json")
OUTDIR = os.path.join(BASE, "media", "audio")
MANIFEST = os.path.join(OUTDIR, "_recorded.json")
MODEL = "eleven_multilingual_v2"

# Jason, Natural Narrator: warm, steady North American voice. The one the whole
# site speaks with. Overridable by ELEVENLABS_VOICE_ID, but it should not need to
# be.
DEFAULT_VOICE = "6nukEV6JAgCcOkdtH5FM"

# A guide is a three minute thing, not a thirty second one. About 450 words is
# three minutes of narration at an unhurried pace, so anything shorter is treated
# as an unfinished script and held back rather than voiced.
MIN_WORDS = 450

PAUSE_S = 4                 # spacing: the API rate-limits a fast loop


def load_scripts():
    with open(SCRIPTS, encoding="utf-8") as f:
        data = json.load(f)
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


def path_for(slug):
    return os.path.join(OUTDIR, "guide-%s.mp3" % slug)


def status(slug, text, voice, manifest):
    """Why this guide does or does not need recording right now.

    Returns one of: 'short' (script too brief to voice), 'have' (already
    recorded in this voice from this exact script), or 'record' (missing, or the
    voice changed, or the words changed)."""
    if len(text.split()) < MIN_WORDS:
        return "short"
    if not os.path.exists(path_for(slug)):
        return "record"
    m = manifest.get(slug) or {}
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
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    voice = os.environ.get("ELEVENLABS_VOICE_ID", "").strip() or DEFAULT_VOICE
    scripts = load_scripts()
    manifest = load_manifest()
    os.makedirs(OUTDIR, exist_ok=True)

    have, short, todo = [], [], []
    for slug, text in scripts.items():
        st = status(slug, text, voice, manifest)
        if st == "have":
            have.append(slug)
        elif st == "short":
            short.append((slug, len(text.split())))
        else:
            todo.append((slug, text))

    chars = sum(len(t) for _, t in todo)
    print("voice %s  |  %d guides: %d current, %d to record, %d too short"
          % (voice, len(scripts), len(have), len(todo), len(short)))

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
        print("  %-32s %4d words  %5d chars" % (slug, len(text.split()), len(text)))

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
        with open(path_for(slug), "wb") as f:
            f.write(audio)
        manifest[slug] = {"voice": voice, "sig": sig(text),
                          "words": len(text.split()), "chars": len(text)}
        save_manifest(manifest)
        made.append(slug)
        print("  voiced  %-32s %6d bytes" % (slug, len(audio)))
        time.sleep(PAUSE_S)

    print("\nrecorded %d, failed %d" % (len(made), len(failed)))
    if made:
        print("New slugs need an \"audio\": \"/media/audio/guide-<slug>.mp3\" line in "
              "destinations.json so the book and the planner play them.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
