# -*- coding: utf-8 -*-
"""Every container tag opens and closes. Checked because a regex broke it.

Removing a block of markup with a regular expression is how a stray </div>
gets left behind. Match the opening tag and a lazy `.*?</div>` and the match
stops at the first *inner* close, abandoning the outer one:

    <div class="psx-stats">
        <div class="psx-stat">…</div>   <- .*?</div> ends here
        …
    </div>                              <- left behind

The browser does not complain. It silently re-parents everything after the
orphan, so #view-overview ended one section early, every
"#view-overview .psx-*" rule stopped matching, and the four business cards
stacked full-width. No error, no 404, no failing test — the page just looked
wrong, and it took a screenshot to notice.

So: count them. HTML parsers are forgiving; this is not.

Usage:  python3 check_markup.py [--strict]
"""
import glob
import re
import sys

# Void elements never close, and these three are routinely written unclosed
# in valid HTML, so counting them would produce noise rather than findings.
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}
OPTIONAL_CLOSE = {"li", "p", "option", "tr", "td", "th", "tbody", "thead", "dt", "dd"}

# The ones whose imbalance actually re-parents a page.
WATCH = ["div", "section", "main", "header", "footer", "nav", "form",
         "span", "button", "a", "ul", "table", "svg"]

TAG = re.compile(r"<(/?)([a-zA-Z][\w-]*)([^>]*?)(/?)>")


def strip_noise(src):
    """Comments and <script>/<style> bodies contain tag-like text that is not
    markup — a template string with </div> in it, a CSS selector with >."""
    src = re.sub(r"<!--.*?-->", "", src, flags=re.S)
    src = re.sub(r"<(script|style)\b[^>]*>.*?</\1\s*>", r"<\1></\1>", src, flags=re.S | re.I)
    return src


def balance(src):
    counts = {}
    for closing, name, attrs, selfclose in TAG.findall(src):
        name = name.lower()
        if name in VOID or selfclose:
            continue
        c = counts.setdefault(name, [0, 0])
        c[1 if closing else 0] += 1
    return counts


def main():
    strict = "--strict" in sys.argv
    problems = 0
    for path in sorted(glob.glob("*.html")):
        if "backup" in path:
            continue
        counts = balance(strip_noise(open(path, encoding="utf-8").read()))
        bad = []
        for name in WATCH:
            opens, closes = counts.get(name, (0, 0))
            if opens != closes:
                bad.append(f"<{name}> {opens} open / {closes} close  ({closes - opens:+d})")
        if bad:
            problems += 1
            print(f"FAIL {path}")
            for b in bad:
                print(f"       {b}")
        else:
            print(f"ok   {path}")

    print("\n" + "=" * 60)
    if problems:
        print(f"{problems} file(s) with unbalanced tags")
    else:
        print("every watched container tag opens and closes")
    sys.exit(1 if (strict and problems) else 0)


if __name__ == "__main__":
    main()
