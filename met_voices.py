"""Jason reads the Met: one recording per gallery, from the cards themselves.

The guide panel (met-guide.js) narrates each gallery from MET_CARDS, and
falls back to the phone's speech engine when no recording exists. This
script records those same words in Jason's voice (the site's narrator,
ElevenLabs "Natural Narrator"), reading the text STRAIGHT OUT OF
met-cards.js so the audio and the panel can never tell different stories.
Change a card, re-run this, and the voice catches up.

Quota-aware like voice_guides.py: the free tier is 10,000 characters a
month and the whole museum costs ~6,900, so it fits, once. Files that
already exist are never re-recorded (delete one to re-take it). Needs
ELEVENLABS_API_KEY in the environment; GUIDE_VOICE_ID overrides the voice.

Run:  python3 met_voices.py          (or --dry to see the bill first)
"""

import json
import os
import re
import sys
import time
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(BASE, "media", "audio")
JASON = "6nukEV6JAgCcOkdtH5FM"          # Natural Narrator: the site's voice
MODEL = "eleven_multilingual_v2"
PAUSE_S = 4


def cards():
    s = open(os.path.join(BASE, "met-cards.js")).read()
    m = re.search(r"window\.MET_CARDS\s*=\s*(\{.*\})\s*;?\s*$", s, re.S)
    return json.loads(m.group(1))


def narration(key, c):
    """Exactly what the panel says, joined for one continuous read."""
    parts = [c.get("one_line", "")]
    for h in c.get("highlights", []):
        w, n = (h.get("work") or "").strip(), (h.get("note") or "").strip()
        if not (w or n):
            continue
        w = w.rstrip(".")
        if n and not n.endswith((".", "!", "?")):
            n += "."
        parts.append((w + ". " + n).strip() if w else n)
    return " ".join(p for p in parts if p).strip()


SCRIPTS = {"met-opening": ("The Metropolitan Museum of Art. Five thousand years "
                           "of human making, in a building that covers eleven and "
                           "a half acres. Here is the walk you picked.")}


def record(key, voice, text, path):
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/text-to-speech/%s?output_format=mp3_44100_128" % voice,
        data=json.dumps({"text": text, "model_id": MODEL,
                         "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}}).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        audio = r.read()
    tmp = path + ".tmp"
    with open(tmp, "wb") as f:
        f.write(audio)
    os.replace(tmp, path)
    return len(audio)


def main():
    dry = "--dry" in sys.argv
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    voice = os.environ.get("GUIDE_VOICE_ID", "").strip() or JASON
    todo = dict(SCRIPTS)
    for k, c in cards().items():
        t = narration(k, c)
        if t:
            todo["met-" + k] = t
    os.makedirs(OUTDIR, exist_ok=True)
    total = sum(len(t) for t in todo.values())
    print("%d recordings, %d characters" % (len(todo), total))
    made, skipped, failed = [], [], []
    for name, text in sorted(todo.items()):
        path = os.path.join(OUTDIR, name + ".mp3")
        if os.path.exists(path):
            skipped.append(name)
            continue
        if dry:
            print("  would record %-24s %4d chars" % (name, len(text)))
            continue
        if not key:
            print("No ELEVENLABS_API_KEY in the environment. Nothing recorded.")
            return 1
        try:
            size = record(key, voice, text, path)
            made.append(name)
            print("  ✓ %-24s %5.1f KB" % (name, size / 1024))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "ignore")[:160]
            failed.append(name)
            print("  ✗ %-24s HTTP %s %s" % (name, e.code, body))
            if "quota" in body:
                print("Quota spent — stopping so the rest records next month.")
                break
        time.sleep(PAUSE_S)
    print("made %d · kept %d · failed %d" % (len(made), len(skipped), len(failed)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
