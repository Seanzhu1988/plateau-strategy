#!/usr/bin/env python3
"""Record the spoken attraction guides, and only the ones still missing.

    python3 voice_guides.py            # record what is missing, then report
    python3 voice_guides.py --dry      # say what it would record, spend nothing

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
SCRIPTS = os.path.join(BASE, "guide_scripts.json")
OUTDIR = os.path.join(BASE, "media", "audio")
MODEL = "eleven_multilingual_v2"
PAUSE_S = 4                 # spacing: the API rate-limits a fast loop


def load_scripts():
    with open(SCRIPTS, encoding="utf-8") as f:
        data = json.load(f)
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
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    voice = os.environ.get("ELEVENLABS_VOICE_ID", "").strip()
    scripts = load_scripts()
    os.makedirs(OUTDIR, exist_ok=True)

    missing = [(k, v) for k, v in scripts.items()
               if not os.path.exists(os.path.join(OUTDIR, "guide-%s.mp3" % k))]
    have = len(scripts) - len(missing)
    chars = sum(len(v) for _, v in missing)

    print("%d scripts, %d already recorded, %d to go (%d characters)"
          % (len(scripts), have, len(missing), chars))
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
        with open(os.path.join(OUTDIR, "guide-%s.mp3" % k), "wb") as f:
            f.write(audio)
        made.append(k)
        print("  voiced  %-32s %6d bytes" % (k, len(audio)))
        time.sleep(PAUSE_S)

    print("\nrecorded %d, failed %d" % (len(made), len(failed)))
    if made:
        print("Add each new slug to destinations.json as \"audio\": "
              "\"/media/audio/guide-<slug>.mp3\" so the book and the planner play it.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
