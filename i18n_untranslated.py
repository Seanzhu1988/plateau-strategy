#!/usr/bin/env python3
"""Find text the page BUILDS at runtime and never sends through the translator.

    python3 i18n_untranslated.py            # every visitor page
    python3 i18n_untranslated.py freedom-trail.html

The site-wide translator walks text nodes and looks each one up by its exact
English. That works for text written in the HTML. It CANNOT work for a string
the page assembles from numbers at runtime, because the dictionary would need
an entry for every possible value:

    el.textContent = count + " stops · " + fmt(walk) + " walking";

There is a mechanism for this, psxFmt, which translates the PATTERN and drops
the values in afterwards. The bug is silent: the page translates, the composed
line does not, and it reads as "the translation is broken" while every test
passes. On the Freedom Trail it left the summary under the title in English on
a fully Chinese page, and it was the single most prominent sentence there.

So this looks for the shape rather than the symptom: an assignment to
textContent or innerHTML, or a push into a list that becomes innerHTML, whose
value concatenates a quoted run of English words. Lines already going through
psxFmt or the local T() wrapper are fine and are not reported.

Exit 1 if anything is found, so it can gate a build.
"""
import os
import re
import sys

BASE = os.path.dirname(os.path.abspath(__file__))

# Pages a visitor sees. Owner and lab pages are not translated by policy.
SKIP = {"dispatch.html", "board.html", "room.html", "room-locked.html",
        "searches.html", "name-protection.html", "site-map.html",
        # Owner and diagnostic tools. Nobody reads these but Sean, and a
        # translated fault report is harder to act on, not easier.
        "layout-audit.html", "setup.html", "archive.html", "partners.html"}

TARGET = re.compile(
    r"""(?:\.textContent\s*=|\.innerHTML\s*=|\.push\s*\()""")
# A quoted literal holding real words: three letters, a space, then more.
#
# QUOTE-AWARE ON PURPOSE. The first version used one character class excluding
# BOTH quote characters, so a single-quoted string containing an HTML attribute
# in double quotes could never match, and nearly every innerHTML line in this
# codebase looks exactly like that. It reported a page clean while that page
# built its whole interface out of untranslatable concatenation. The two
# patterns below each exclude only their OWN delimiter, which is how a string
# literal actually works.
SQ = re.compile(r"'((?:[^'\\]|\\.){0,160}?)'")
DQ = re.compile(r'"((?:[^"\\]|\\.){0,160}?)"')
WORDS = re.compile(r"[A-Za-z]{3}\s+[A-Za-z]{2}")


def englishy(line):
    """Return the first quoted run that reads like prose, or None."""
    for pat in (SQ, DQ):
        for m in pat.finditer(line):
            body = m.group(1)
            if WORDS.search(body):
                return body
    return None
SAFE = re.compile(r"\b(?:psxFmt|T)\s*\(")


def scan(path):
    name = os.path.basename(path)
    src = open(path, encoding="utf-8", errors="replace").read()
    hits = []
    for i, line in enumerate(src.splitlines(), 1):
        s = line.strip()
        if not TARGET.search(s):
            continue
        if SAFE.search(s):            # already translated through the pattern API
            continue
        if "+" not in s:              # a bare literal is a text node; the walker gets it
            continue
        frag = englishy(s)
        if not frag:
            continue
        frag = frag.strip()
        # a lone HTML tag or a class name is not prose
        if frag.startswith("<") and frag.endswith(">"):
            continue
        hits.append((i, frag[:60], s[:110]))
    return name, hits


def main():
    args = sys.argv[1:]
    if args:
        files = [os.path.join(BASE, a) for a in args]
    else:
        files = sorted(os.path.join(BASE, f) for f in os.listdir(BASE)
                       if f.endswith(".html") and f not in SKIP)
    total = 0
    for f in files:
        if not os.path.exists(f):
            print("missing: %s" % f)
            continue
        name, hits = scan(f)
        if not hits:
            continue
        total += len(hits)
        print("\n%s" % name)
        for ln, frag, ctx in hits:
            print("  line %-5d %s" % (ln, frag))
            print("             %s" % ctx)
    if total:
        print("\n%d composed string(s) bypass the translator." % total)
        print("Route each through psxFmt: the pattern is translated, the")
        print('values are dropped in after. psxFmt("{n} stops · {t} walking",')
        print("  {n: count, t: fmt(walk)}). Named placeholders, because word")
        print("order differs between languages.")
        return 1
    print("No composed string bypasses the translator.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
