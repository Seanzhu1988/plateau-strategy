#!/usr/bin/env python3
"""Record the deep, five minute narration for each Freedom Trail stop.

    python3 trail_voices.py               # record the stops that are missing or changed
    python3 trail_voices.py --dry         # say what it would record, spend nothing
    python3 trail_voices.py --lang zh     # record Yiki's Chinese stops
    python3 trail_voices.py --force       # redo everything, even unchanged stops

Where the words live. One plain text file per stop, in trail_scripts/freedom-trail/,
named stop-01.txt through stop-16.txt for English, and stop-01.zh.txt and so on
for another language. One file, one stop, so a rewrite is a small readable diff
and not a needle in a JSON haystack.

Who reads it. The trail has two voices and they are not interchangeable: Jason
walks it in English, Yiki walks it in Chinese. This script does not choose; it
asks guide_voices.py, the one place that record is kept, so the trail sounds the
same here as everywhere else on the site. A language with no reader chosen yet is
refused, never quietly handed to Jason.

How long a stop has to be. A stop on this trail is a deep guide, something you
settle into standing in front of the place, not a thirty second card. So an
English script under MIN_WORDS, about five minutes of unhurried speech, is held
back as unfinished rather than recorded. Other languages are not word counted,
because a language without spaces between words cannot be.

The short placeholders. The first pass of trail audio was voiced from the
one line intros and came out about thirty seconds each. Those files are on disk
with no ledger row. This recorder treats a file with no row as one to record,
not one to adopt, because these long scripts are exactly what is meant to replace
them. The new recording overwrites the old short one under the same name, so the
page upgrades itself with nothing to re-wire.

The recording itself, the ElevenLabs call, the manifest that remembers what was
recorded from which script, and the re-record on change, are all shared with
voice_guides.py rather than copied, so the trail and the guides never drift apart.

QUOTA IS REAL. Sixteen stops at five minutes is around seventy thousand
characters, well past the ten thousand a month of the free tier, so this needs a
paid plan. When it runs out the API answers with quota_exceeded, which reads like
a broken key and is not one; the run stops and picks up where it left off next
time. Needs ELEVENLABS_API_KEY in the environment, the same secret the guides use.
"""

import os
import sys
import time

import voice_guides as vg          # the ElevenLabs call, the manifest, the fingerprint
import guide_voices as gv          # who reads the trail in which language

BASE = os.path.dirname(os.path.abspath(__file__))
TRAIL = "freedom-trail"
SCRIPTS = os.path.join(BASE, "trail_scripts", TRAIL)
OUTDIR = os.path.join(BASE, "media", "audio")
STOPS = 16

# About 700 words is five minutes at an unhurried narrating pace. An English stop
# shorter than this is a card, not a deep guide, and is held back until it grows.
MIN_WORDS = 700


def script_path(n, lang):
    name = "stop-%02d.txt" % n if lang == "en" else "stop-%02d.%s.txt" % (n, lang)
    return os.path.join(SCRIPTS, name)


def out_path(n, lang):
    name = "trail-stop-%d.mp3" % n if lang == "en" else "trail-stop-%d.%s.mp3" % (n, lang)
    return os.path.join(OUTDIR, name)


# The whole-walk overview rides the same run. It used to be recorded by hand,
# which is how trail-freedom.mp3 ended up on disk with no manifest row, the
# same unledgered disease the stop placeholders had. In here it gets a row
# like everything else, so a change of words OR of voice makes it stale and
# the next run remakes it without anyone having to remember.
def overview_paths(lang):
    script = os.path.join(BASE, "trail_scripts", "freedom-trail-%s.txt" % lang)
    out = os.path.join(OUTDIR, "trail-freedom.mp3" if lang == "en"
                       else "trail-freedom.%s.mp3" % lang)
    return script, out


def main():
    dry = "--dry" in sys.argv
    force = "--force" in sys.argv
    lang = "en"
    if "--lang" in sys.argv:
        try:
            lang = sys.argv[sys.argv.index("--lang") + 1].strip().lower()
        except Exception:
            pass

    who = gv.reader_for("trail", lang)
    if not who:
        print("No trail reader chosen for %s yet. Set one in guide_voices.py, "
              "then run again." % lang)
        return 1
    voice = gv.voice_id(who)
    reader = gv.GUIDES[who]["name"]

    manifest = vg.load_manifest()
    have, todo, thin, missing = [], [], [], []
    # item 0 is the overview; 1..16 are the stops. Labels print as "over" or
    # the stop number, and the overview skips the five-minute floor because it
    # is an introduction, not a stop guide.
    for n in range(0, STOPS + 1):
        sp = script_path(n, lang) if n else overview_paths(lang)[0]
        try:
            text = open(sp, encoding="utf-8").read().strip()
        except FileNotFoundError:
            missing.append(n)
            continue
        if n and lang == "en" and len(text.split()) < MIN_WORDS:
            thin.append((n, len(text.split())))
            continue
        op = out_path(n, lang) if n else overview_paths(lang)[1]
        row = manifest.get(os.path.basename(op)) or {}
        # Record when missing, when the words or voice changed, or when a file is
        # on disk with no ledger row, that last one being the short placeholders
        # these deep scripts are here to replace. Never adopt a placeholder.
        stale = row.get("voice") != voice or row.get("sig") != vg.sig(text)
        if force or not os.path.exists(op) or stale:
            todo.append((n, text, op))
        else:
            have.append(n)

    chars = sum(len(t) for _, t, _ in todo)
    print("%s | %s | reader %s (%s) | %d stops: %d current, %d to record, "
          "%d under five minutes, %d without a script"
          % (lang, TRAIL, reader, voice, STOPS, len(have), len(todo),
             len(thin), len(missing)))
    if missing:
        print("  no script yet: stop %s" % ", ".join(map(str, missing)))
    if thin:
        print("  under five minutes, write more before recording:")
        for n, w in thin:
            print("    stop %2d  %4d words  (~%.0f s)" % (n, w, w / 150.0 * 60))

    if not todo:
        print("Nothing to record.")
        return 0

    print("Ready to record %d stop(s), %d characters. A paid ElevenLabs plan; "
          "the free tier is 10,000 characters a month." % (len(todo), chars))
    for n, t, _ in todo:
        print("  %s  %5d chars" % ("overview" if n == 0 else "stop %2d" % n, len(t)))

    if dry:
        return 0

    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not key:
        print("\nNo ELEVENLABS_API_KEY in the environment. Nothing recorded.")
        print("Set it where the site runs (on Render, under Environment) and run again.")
        return 1

    made, failed = [], []
    for n, text, op in todo:
        audio, why = vg.record(key, voice, text)
        if why == "QUOTA":
            print("\nOut of characters at ElevenLabs. %d recorded this run, %d still "
                  "waiting. Run again to pick up where this stopped."
                  % (len(made), len(todo) - len(made)))
            break
        if why:
            failed.append((n, why))
            print("  failed  %s  %s" % ("overview" if n == 0 else "stop %2d" % n, why))
            continue
        with open(op, "wb") as f:
            f.write(audio)
        manifest[os.path.basename(op)] = {"voice": voice, "sig": vg.sig(text),
                                          "words": len(text.split()), "chars": len(text)}
        vg.save_manifest(manifest)
        made.append(n)
        print("  voiced  %s  %6d bytes"
              % ("overview" if n == 0 else "stop %2d" % n, len(audio)))
        time.sleep(vg.PAUSE_S)

    print("\nrecorded %d, failed %d." % (len(made), len(failed)))
    if made and lang == "en":
        print("Nothing to wire: the page already plays trail-stop-<n>.mp3, so each "
              "recorded stop replaces its short clip on the next load.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
