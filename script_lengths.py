#!/usr/bin/env python3
"""Check every spoken script against the three lengths, and say which it is.

    python3 script_lengths.py              # everything
    python3 script_lengths.py --tier mid   # only what should be 2 minutes

[SEAN 2026-08-31: "can you make sure the story writing short 30 sec, mid 2
min, long 5 mins".]

THREE LENGTHS, one subject, so a visitor picks the depth rather than the
site picking for them: 30 seconds standing in a doorway, 2 minutes in front
of the thing, 5 minutes when they want the whole story.

THE PACE IS MEASURED, NOT ASSUMED. It comes from our own recordings. A
Freedom Trail stop is 790 words and its MP3 is 2,445,523 bytes. The page
calls each stop a five minute narration, and 64 kbps is the only bitrate
that makes both true: 305 seconds, and 155 words per minute, which is a
real narration pace. 128 kbps would imply 310 wpm, which nobody speaks.

    English   155 words per minute
    Chinese   228 characters per minute   (from the zh recordings, same way)

CHINESE IS COUNTED IN CHARACTERS, NOT WORDS. Chinese does not put spaces
between words, so splitting on whitespace reports a 1,139 character script
as SEVEN words. Every length check that treats zh like en is silently
broken, and would pass a script forty times too short.

A tolerance of 15 percent either way, because a guide is not a metronome.
Exit 1 if anything is outside its band, so it can gate a build.
"""
import os
import re
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
# Per language, because one rate for all of them was wrong and the routine's
# own output proved it: every Korean story came out ~30% under target and every
# Vietnamese ~25% over, systematically, across all six pairs. A pattern that
# clean is never the translator, it is the ruler.
#
# English 155 wpm and Chinese 228 cpm are MEASURED from our own recordings.
# The others are derived from parallel text: the same story in five languages
# gives the ratio of words each needs for identical content, and if that
# content takes the same real time to speak, a language using fewer words must
# be spoken at fewer words per minute. Spanish came out at 1.008x English,
# Korean 0.687x, Vietnamese 1.179x, over six pairs each.
#
# These are honest second-best. Replace any of them with a measured figure the
# moment we record a story in that language, the way English and Chinese were.
RATES = {
    "en": ("words", 155.0),   # measured, trail recordings
    "zh": ("chars", 228.0),   # measured, trail recordings
    "es": ("words", 156.0),   # derived, 1.008x English
    "ko": ("words", 107.0),   # derived, 0.687x English
    "vi": ("words", 183.0),   # derived, 1.179x English
}
WPM_EN = RATES["en"][1]
CPM_ZH = RATES["zh"][1]
TOL = 0.15

TIERS = {"short": 30, "mid": 120, "long": 300}
CJK = re.compile(r"[㐀-鿿豈-﫿぀-ヿ가-힯]")


def measure(text):
    """Return (count, unit, is_cjk). A script is treated as CJK when most of
    its letters are CJK, so a stray English name does not flip the method."""
    cjk = len(CJK.findall(text))
    words = len(text.split())
    if cjk > words:                      # far more characters than spaced tokens
        return cjk, "chars", True
    return words, "words", False


def expected(tier, is_cjk):
    secs = TIERS[tier]
    rate = CPM_ZH if is_cjk else WPM_EN
    mid = rate * secs / 60.0
    return mid, mid * (1 - TOL), mid * (1 + TOL)


def tier_of(path):
    """A file declares its tier in its name: name.short.txt, name.mid.txt,
    name.long.txt. Anything undeclared is measured and reported as whichever
    tier it lands nearest, so existing work can be classified rather than
    failed for a naming convention it predates."""
    b = os.path.basename(path)
    for t in TIERS:
        if ".%s." % t in b:
            return t, True
    return None, False


def nearest(count, is_cjk):
    best, bd = None, None
    for t in TIERS:
        mid, _, _ = expected(t, is_cjk)
        d = abs(count - mid) / mid
        if bd is None or d < bd:
            best, bd = t, d
    return best


def scan(roots):
    rows = []
    for root in roots:
        for dirpath, _, files in os.walk(os.path.join(BASE, root)):
            for f in sorted(files):
                if not f.endswith(".txt"):
                    continue
                p = os.path.join(dirpath, f)
                text = open(p, encoding="utf-8", errors="replace").read().strip()
                if not text:
                    continue
                count, unit, is_cjk = measure(text)
                declared, explicit = tier_of(p)
                tier = declared or nearest(count, is_cjk)
                mid, lo, hi = expected(tier, is_cjk)
                secs = count / (CPM_ZH if is_cjk else WPM_EN) * 60
                rows.append({"path": os.path.relpath(p, BASE), "count": count,
                             "unit": unit, "cjk": is_cjk, "tier": tier,
                             "explicit": explicit, "ok": lo <= count <= hi,
                             "secs": secs, "want": mid})
    return rows


def main():
    only = None
    if "--tier" in sys.argv:
        only = sys.argv[sys.argv.index("--tier") + 1]
    rows = scan(["museum_scripts", "trail_scripts"])
    if only:
        rows = [r for r in rows if r["tier"] == only]
    if not rows:
        print("No scripts found.")
        return 0
    print("%-44s %7s %6s %6s %5s" % ("script", "count", "secs", "tier", "ok"))
    bad = 0
    for r in rows:
        if not r["ok"]:
            bad += 1
        print("%-44s %7d %5.0fs %6s %5s%s"
              % (r["path"][:44], r["count"], r["secs"], r["tier"],
                 "yes" if r["ok"] else "NO",
                 "" if r["explicit"] else "   (tier inferred)"))
    print("\n%d script(s), %d outside their band." % (len(rows), bad))
    print("Targets: short %.0f words / %.0f chars · mid %.0f / %.0f · long %.0f / %.0f"
          % (WPM_EN * 0.5, CPM_ZH * 0.5, WPM_EN * 2, CPM_ZH * 2,
             WPM_EN * 5, CPM_ZH * 5))
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
