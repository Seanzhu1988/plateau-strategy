#!/usr/bin/env python3
"""Record Jason's five minute narration for each MoMA room.

    python3 moma_voices.py                # record the rooms that are missing or changed
    python3 moma_voices.py --dry          # say what it would record, spend nothing
    python3 moma_voices.py --force        # redo everything, even unchanged rooms

The trail's recorder, reshaped for a building. One plain text file per room in
museum_scripts/moma/<room-key>.txt, one mp3 per room at
media/audio/moma-<room-key>.mp3, and the reader comes from guide_voices.py:
the moma job belongs to Jason, the house voice, indoors where he lives.
[SEAN "by jason"] A language with no reader chosen is refused, never guessed.

Everything that matters is shared with voice_guides.py, the ElevenLabs call,
the manifest, the re-record-on-change fingerprint, so MoMA and the trail can
never drift apart in how they treat a recording.

Same quota reality as the trail: twelve rooms of five minutes is roughly fifty
thousand characters. When ElevenLabs runs out the run stops cleanly and the
next run picks up exactly where it left off. Needs ELEVENLABS_API_KEY.
"""

import os
import sys
import time

import voice_guides as vg
import guide_voices as gv

BASE = os.path.dirname(os.path.abspath(__file__))
SCRIPTS = os.path.join(BASE, "museum_scripts", "moma")
OUTDIR = os.path.join(BASE, "media", "audio")

# Five minutes of unhurried narration is about 600 words and up; a room script
# shorter than that is a card, not a guide, and is held back until it grows.
MIN_WORDS = 550


def main():
    dry = "--dry" in sys.argv
    force = "--force" in sys.argv
    lang = "en"

    who = gv.reader_for("moma", lang)
    if not who:
        print("No MoMA reader chosen for %s yet. Set one in guide_voices.py." % lang)
        return 1
    voice = gv.voice_id(who)
    reader = gv.GUIDES[who]["name"]
    tuning = gv.settings_for(who)

    try:
        rooms = sorted(f[:-4] for f in os.listdir(SCRIPTS) if f.endswith(".txt"))
    except FileNotFoundError:
        rooms = []
    if not rooms:
        print("No scripts in %s yet. Write them first." % SCRIPTS)
        return 1

    manifest = vg.load_manifest()
    have, todo, thin = [], [], []
    for key in rooms:
        text = open(os.path.join(SCRIPTS, key + ".txt"), encoding="utf-8").read().strip()
        if len(text.split()) < MIN_WORDS:
            thin.append((key, len(text.split())))
            continue
        op = os.path.join(OUTDIR, "moma-%s.mp3" % key)
        row = manifest.get(os.path.basename(op)) or {}
        stale = (row.get("voice") != voice or row.get("sig") != vg.sig(text)
                 or row.get("settings") != tuning)
        if force or not os.path.exists(op) or stale:
            todo.append((key, text, op))
        else:
            have.append(key)

    chars = sum(len(t) for _, t, _ in todo)
    print("%s | moma | reader %s (%s) | %d rooms: %d current, %d to record, %d under five minutes"
          % (lang, reader, voice, len(rooms), len(have), len(todo), len(thin)))
    for key, w in thin:
        print("  under five minutes, write more first: %s (%d words)" % (key, w))
    if not todo:
        print("Nothing to record.")
        return 0

    print("Ready to record %d room(s), %d characters." % (len(todo), chars))
    for key, t, _ in todo:
        print("  %-18s %5d chars" % (key, len(t)))
    if dry:
        return 0

    key_env = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not key_env:
        print("\nNo ELEVENLABS_API_KEY in the environment. Nothing recorded.")
        return 1

    made, failed = [], []
    for key, text, op in todo:
        audio, why = vg.record(key_env, voice, text, settings=tuning)
        if why == "QUOTA":
            print("\nOut of characters at ElevenLabs. %d recorded this run, %d still "
                  "waiting. Run again to pick up where this stopped."
                  % (len(made), len(todo) - len(made)))
            break
        if why:
            failed.append((key, why))
            print("  failed  %-18s %s" % (key, why))
            continue
        with open(op, "wb") as f:
            f.write(audio)
        manifest[os.path.basename(op)] = {"voice": voice, "sig": vg.sig(text),
                                          "settings": tuning,
                                          "words": len(text.split()), "chars": len(text)}
        vg.save_manifest(manifest)
        made.append(key)
        print("  voiced  %-18s %6d bytes" % (key, len(audio)))
        time.sleep(vg.PAUSE_S)

    print("\nrecorded %d, failed %d." % (len(made), len(failed)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
