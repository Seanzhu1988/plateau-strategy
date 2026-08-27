#!/usr/bin/env python3
"""Four takes of one Chinese paragraph, so the accent can be judged by ear.

    python3 accent_bakeoff.py

WHY THIS EXISTS. Sean said Yiki's Chinese sounds Americanized. The scripts are
not the cause: they are written in Chinese rather than translated into it, with
transliterated names, Chinese numerals and full-width punctuation. The cause is
upstream of the words.

Yiki is Mingyao Ye, whose library entry is "Sad and Broken Hearted", an
English-market emotional voice. eleven_multilingual_v2 has no language
parameter; it reads the characters in whatever accent the voice was trained in.
So Chinese text in an English-sourced voice comes out with an English mouth.

There are three things we can change, and arguing about them is worthless next
to hearing them. This records the SAME paragraph four ways:

    1  yiki-now      exactly what is on the site today, the reference point
    2  yiki-pinned   Yiki on a model that accepts language_code, phonetics
                     pinned to Chinese, similarity lowered so the model is
                     free to drift away from her English recordings
    3  pangge        "pangge, chinese radio voice", already in the roster
    4  adrian        "Adrian | Chinese Mandarin Narration", already in the roster

Three and four are native Mandarin voices we are already paying for. If either
is right, the fix is one line in guide_voices.py and no new voice to license.

Roughly 500 characters times four takes. Small.

Sean picks by ear. That is how Jason and Yiki were both chosen, and a
description of a voice has never once predicted how it sounds.
"""
import os
import sys

import voice_guides as vg
import guide_voices as gv

OUT = "media/audio/bakeoff"

# The opening of stop 2, the golden dome. Real copy from the real walk, because
# a test sentence tells you nothing about how a voice handles a long narration.
PASSAGE = (
    "现在你到了坡顶，金色的圆顶就在你头顶。这是马萨诸塞州议会大厦，"
    "从一七九八年起就是州政府的所在地。站到街对面，抬头直直往上看，"
    "因为这个圆顶是所有人专程来看的东西，而它的故事比它的光亮要长得多。"
    "先从它脚下的土地说起。这里曾经是约翰·汉考克的牛牧场。"
    "汉考克，就是在《独立宣言》上签下那个巨大名字的人。"
)

# A model that accepts language_code. multilingual_v2 does not, which is the
# whole reason take 2 needs a different one.
PINNED_MODEL = "eleven_turbo_v2_5"

TAKES = [
    ("1-yiki-now", "yiki", None, None, None,
     "what is on the site today"),
    ("2-yiki-pinned", "yiki", PINNED_MODEL, "zh",
     {"stability": 0.5, "similarity_boost": 0.3, "style": 0.0},
     "Yiki, Chinese phonetics pinned, pulled off her English recordings"),
    ("3-pangge", "pangge", None, None, None,
     "pangge, chinese radio voice, already in the roster"),
    ("4-adrian", "adrian", None, None, None,
     "Adrian, Chinese Mandarin Narration, already in the roster"),
]


def main():
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not key:
        print("No ELEVENLABS_API_KEY in the environment.")
        print("This runs in CI, where the key is a repository secret.")
        return 1

    os.makedirs(OUT, exist_ok=True)
    print("%d characters, four takes.\n" % len(PASSAGE))

    made, failed = [], []
    for name, guide, model, lang, settings, why in TAKES:
        voice = gv.voice_id(guide)
        if not voice:
            print("  %-14s skipped, no voice id for %s" % (name, guide))
            continue
        path = os.path.join(OUT, "%s.mp3" % name)
        audio, reason = vg.record(key, voice, PASSAGE, model=model,
                                  language=lang, settings=settings)
        if not audio:
            print("  %-14s FAILED  %s" % (name, reason))
            failed.append((name, reason))
            continue
        with open(path, "wb") as f:
            f.write(audio)
        print("  %-14s %6.1f KB  %s" % (name, len(audio) / 1024.0, why))
        made.append(path)

    if not made:
        print("\nNothing recorded.")
        return 1

    print("\nListen in this order and pick one:")
    for p in made:
        print("   /%s" % p)
    print("\nTake 1 is the reference. If 3 or 4 sounds native where 1 does not,")
    print("the fix is one line in guide_voices.py, BY_LANGUAGE trail zh.")
    print("If 2 is the one, the fix is that model and those settings for her.")
    if failed:
        print("\nFailed: %s" % ", ".join(n for n, _ in failed))
    return 0


if __name__ == "__main__":
    sys.exit(main())
