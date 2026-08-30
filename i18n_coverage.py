#!/usr/bin/env python3
"""Does every public page actually translate? Answer with numbers.

    python3 i18n_coverage.py            # report, exit 1 if a page fails
    python3 i18n_coverage.py --list zh  # print the missing strings for one language

WHY THIS EXISTS. Twice now the globe has looked broken to Sean, and both
times the cause was the same shape: the switcher works fine, but the words on
the newest page were never added to the packs, so tapping a language changed
nothing visible. It fails SILENTLY, which is why it kept coming back, and a
page shipped in English is a page that does not reach the readers the whole
multilingual edge was built for.

Two failures are possible and this checks for both:

  1. The page never loads i18n.js at all, so there is no switcher and nothing
     can translate. The landmarks page shipped this way.
  2. The page loads it, but its strings are absent from the pack, so the globe
     turns and the text does not.

Threshold is deliberately not 100%. Proper nouns, numbers and short labels
often want to stay as they are, and demanding perfection would train everyone
to ignore a permanently red check. A public page below MIN_COVERAGE is a
genuine regression.
"""
import os
import re
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
LANGS = ["zh", "es", "ko", "vi", "ja"]
MIN_COVERAGE = 80          # percent of visible strings a public page must have

# The pages a visitor can reach and read. Owner surfaces and private rooms are
# not here on purpose: the dispatch board and the partner room are for people
# who already speak the language they were written in.
PUBLIC = ["landing-page.html", "freedom-trail.html", "met.html", "moma.html",
          "universal-gallery.html", "destination-book.html", "trip-planner.html",
          "booking.html", "tours.html", "landmarks.html", "walks.html",
          "road-trip.html", "trips.html", "articles.html"]


def visible_strings(path):
    """The text a reader sees, by the same rule i18n.js uses: text nodes."""
    s = open(path, encoding="utf-8").read()
    s = re.sub(r"<script[\s\S]*?</script>|<style[\s\S]*?</style>|<!--[\s\S]*?-->", " ", s)
    body = s.split("<body", 1)[-1]
    out = set()
    for t in re.findall(r">([^<>]+)<", body):
        t = re.sub(r"\s+", " ", t).strip()
        if len(t) > 3 and re.search(r"[A-Za-z]{3}", t) and not t.startswith("{"):
            out.add(t)
    return out


def pack_keys(lang):
    p = os.path.join(BASE, "i18n.%s.js" % lang)
    if not os.path.exists(p):
        return set()
    return set(re.findall(r'"((?:[^"\\]|\\.)*)"\s*:', open(p, encoding="utf-8").read()))


def main():
    if "--list" in sys.argv:
        lang = sys.argv[sys.argv.index("--list") + 1]
        have = pack_keys(lang)
        for f in PUBLIC:
            p = os.path.join(BASE, f)
            if not os.path.exists(p):
                continue
            miss = sorted(x for x in visible_strings(p) if x not in have)
            if miss:
                print("\n## %s (%d missing)" % (f, len(miss)))
                for m in miss:
                    print("  " + m)
        return 0

    packs = {l: pack_keys(l) for l in LANGS}
    print("Pack sizes: " + ", ".join("%s %d" % (l, len(packs[l])) for l in LANGS))
    no_script, failures = [], []
    print("\n%-26s %7s  %s" % ("page", "strings", "  ".join(l.rjust(4) for l in LANGS)))
    for f in PUBLIC:
        p = os.path.join(BASE, f)
        if not os.path.exists(p):
            continue
        src = open(p, encoding="utf-8").read()
        if "i18n.js" not in src:
            no_script.append(f)
        st = visible_strings(p)
        cells = []
        for l in LANGS:
            cov = 100 * len([x for x in st if x in packs[l]]) / max(1, len(st))
            cells.append(("%d%%" % round(cov)).rjust(4))
            if cov < MIN_COVERAGE:
                failures.append((f, l, round(cov)))
        print("%-26s %7d  %s" % (f, len(st), "  ".join(cells)))

    print()
    if no_script:
        print("NO SWITCHER AT ALL, these pages never load i18n.js:")
        for f in no_script:
            print("   " + f)
    if failures:
        print("BELOW %d%% coverage:" % MIN_COVERAGE)
        for f, l, c in failures:
            print("   %-26s %s  %d%%" % (f, l, c))
        print("\nList what is missing with:  python3 i18n_coverage.py --list zh")
    if not failures and not no_script:
        print("Every public page carries the switcher and clears %d%% in every language." % MIN_COVERAGE)
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
