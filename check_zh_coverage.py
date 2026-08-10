# -*- coding: utf-8 -*-
"""How much of each page is actually in Chinese?

"The translation is extremely low level" has now been said five times, and
answered five times by rewriting strings. Two of those five turned out not to
be a register problem at all: the Destination Book was Chinese chrome around
85 English paragraphs, and the Road Trip Planner produced an entirely English
answer inside a Chinese page. Both were invisible to a check that reads the
dictionary, because the dictionary was fine — the text never reached it.

So this counts, per page, the words a Chinese reader still sees in English.
A surface that is a third English is not a quality problem, and no amount of
polishing the other two thirds will fix it.

    python3 app.py &
    python3 check_zh_coverage.py
"""
import re
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:                                          # pragma: no cover
    sys.exit("playwright is not installed:  pip install playwright")

BASE = "http://127.0.0.1:5055"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

ROUTES = ["/", "/book", "/renter", "/driver", "/agent", "/partners", "/trips",
          "/trip-planner", "/road-trip", "/destination-book", "/favorite-place",
          "/guide-studio", "/books", "/articles", "/archive", "/factor-clock"]
VIEWS = ["overview", "transportation", "operations", "realestate", "finance",
         "reinvestment", "tools", "security"]

# Correctly English: brand and product names, drawing codes, units. Venue names
# are handled separately — TRANSLATION.md keeps them in the language of the
# sign outside, so "Pike Place Market" staying English is right, not a gap.
SKIP = re.compile(
    r"^(Plateau|Strategy|Solution|Lab|Tesla|Sea|Tac|SEA|OSRM|Overpass|Nominatim|"
    r"OpenStreetMap|Jarvis|Atlas|Square|Google|Stripe|VIN|LLC|PDF|CSV|"
    r"A3|RE|REV|NTS|FIG|kW|USD|mi|km|min|hr|max|www|com|io)$", re.I)

def venue_names():
    """Place names from the book, which are correctly English.

    TRANSLATION.md keeps venue names in the language of the sign outside —
    a traveller has to ask for "Pike Place Market", not a translation of it.
    Counting them as untranslated buried the real gaps under 130 false ones.
    Read from the data rather than typed out, because a hand-written list is
    how two of three names got missed in the road trip test.
    """
    import json, os
    names = set()
    for f in ("destinations.json",):
        p = os.path.join(os.path.dirname(os.path.abspath(__file__)), f)
        if not os.path.exists(p):
            continue
        try:
            d = json.load(open(p, encoding="utf-8"))
        except Exception:
            continue
        for e in (d.get("entries") or []):
            n = (e.get("name") or "").strip()
            if n:
                names.add(n)
                for w in re.findall(r"[A-Za-z][A-Za-z'’-]{2,}", n):
                    names.add(w)
    return names


COLLECT_JS = """() => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const out = []; let n;
  while ((n = w.nextNode())) {
    const t = (n.nodeValue || '').trim();
    if (!t) continue;
    const p = n.parentElement;
    if (!p || !p.getClientRects().length) continue;
    // The language switcher lists every language in its own name on purpose.
    if (p.closest('script,style,.i18n-wrap,#i18nMenu,#i18nBtn')) continue;
    out.push(t);
  }
  return out;
}"""


def main():
    VENUES = venue_names()
    rows = []
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME)
        pg = b.new_page(viewport={"width": 1280, "height": 900})

        def measure(label):
            en_words, zh_chars, samples = 0, 0, []
            for t in pg.evaluate(COLLECT_JS):
                if re.search(r"[一-鿿]", t):
                    zh_chars += len(t)
                    continue
                words = [x for x in re.findall(r"[A-Za-z][A-Za-z'’-]{2,}", t)
                         if not SKIP.match(x) and x not in VENUES]
                if words:
                    en_words += len(words)
                    if len(samples) < 3 and len(t) > 12:
                        samples.append(t[:60])
            rows.append((label, en_words, zh_chars, samples))

        for r in ROUTES:
            pg.goto(BASE + r + "?lang=zh", wait_until="domcontentloaded")
            pg.wait_for_timeout(1500)
            if r == "/":
                for v in VIEWS:
                    pg.evaluate("showView('%s')" % v)
                    pg.wait_for_timeout(500)
                    measure("/ #%s" % v)
            else:
                measure(r)
        b.close()

    rows.sort(key=lambda x: -x[1])
    print("  surface                English words a Chinese reader still sees")
    for label, en, zh, samples in rows:
        mark = "   <-- worst" if en > 40 else ""
        print("  %-22s %4d%s" % (label, en, mark))
        if en > 40:
            for s in samples:
                print("         %r" % s)
    total = sum(r[1] for r in rows)
    print("\n  %d English words across %d Chinese surfaces" % (total, len(rows)))
    print("  Rewriting register cannot fix these — the text never reached the dictionary.")


if __name__ == "__main__":
    main()
