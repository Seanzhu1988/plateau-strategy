# -*- coding: utf-8 -*-
"""How many layers of paint is each pixel wearing, and how much of it is dead?

The complaint is "double paint layers", said more than once, and it has never
been answered because nobody counted. The landing page loads NINE stylesheets
in a row — seven inline <style> blocks, then paper.css, then modern.css —
carrying 509 !important declarations between them. Every one of those layers
was added to correct the layer beneath it rather than to change it.

That is not a style problem. It has three concrete consequences and all of
them have already happened here:

  * **Dead paint.** A declaration that is overridden everywhere it matches is
    a lie in the source: it says the tab is ink, the tab is not ink, and the
    only way to find out is to open a browser. This is why "the accent isn't
    visible" took three rounds — the rule was right and something above it won.

  * **Nothing can be changed safely.** The fix for a wrong colour is to add a
    louder rule, because editing the real one may change nothing, or may change
    twelve other things whose correctness depended on being overridden.

  * **The palette is not the palette.** paper.css defines --psx-bg as cream.
    modern.css redefines it as white. Reading either file tells you the wrong
    answer about what the site looks like.

So: ask the browser. Chrome's CSS domain reports, for every element, every
rule that matched and which stylesheet it came from, in cascade order. The
last matching declaration wins; every earlier one for the same property is
paint that was applied and then covered.

    python3 app.py &
    python3 check_layers.py                  # the working tree, port 5055
    python3 check_layers.py 5056             # some other port

It reports, it does not pass or fail — what to delete is a judgement, and this
exists so the judgement is made from a list instead of from memory.
"""
import collections
import re
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:                                          # pragma: no cover
    sys.exit("playwright is not installed:  pip install playwright")

PORT = sys.argv[1] if len(sys.argv) > 1 else "5055"
BASE = "http://127.0.0.1:%s" % PORT
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

ROUTES = ["/", "/book", "/renter", "/driver", "/agent", "/partners", "/trips",
          "/trip-planner", "/road-trip", "/destination-book", "/favorite-place",
          "/guide-studio", "/books", "/articles", "/archive", "/factor-clock"]

# Colour and edge only. Layout is not what anyone is complaining about, and
# including it would bury the answer under a thousand paddings.
PROPS = ("color", "background-color", "border-top-color", "border-right-color",
         "border-bottom-color", "border-left-color", "box-shadow", "background-image")


def sheet_name(sheets, sid, page_url):
    """A human name for a stylesheet id — the file, or which inline block."""
    h = sheets.get(sid)
    if not h:
        return "(inline style attribute)"
    url = h.get("sourceURL") or ""
    if url and not url.rstrip("/").endswith(page_url.rstrip("/")):
        return url.rsplit("/", 1)[-1] or url
    # an inline <style>; name it by its id= if it has one
    return "inline <style%s>" % (" id=%s" % h["ownerId"] if h.get("ownerId") else "")


def main():
    # per stylesheet: how many (element, property) contests it won and lost
    won = collections.Counter()
    lost = collections.Counter()
    # a declaration that never wins anywhere, keyed by sheet -> selector:prop
    never = collections.defaultdict(set)
    ever = collections.defaultdict(set)
    layers_per_prop = collections.Counter()

    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME)
        pg = b.new_page(viewport={"width": 1440, "height": 900})
        cdp = pg.context.new_cdp_session(pg)
        # Chrome announces every stylesheet as it parses it. That event is the
        # only place the id-to-file mapping exists, so it has to be listening
        # before the first navigation or the names are gone.
        sheets = {}
        cdp.on("CSS.styleSheetAdded", lambda e: sheets.__setitem__(
            e["header"]["styleSheetId"], e["header"]))
        cdp.send("DOM.enable"); cdp.send("CSS.enable")

        for route in ROUTES:
            pg.goto(BASE + route, wait_until="domcontentloaded")
            pg.wait_for_timeout(1200)

            doc = cdp.send("DOM.getDocument", {"depth": -1, "pierce": False})
            root = doc["root"]["nodeId"]
            ids = cdp.send("DOM.querySelectorAll",
                           {"nodeId": root, "selector": "body *"})["nodeIds"]

            for nid in ids[:1400]:                 # plenty for a shape, cheap
                try:
                    m = cdp.send("CSS.getMatchedStylesForNode", {"nodeId": nid})
                except Exception:
                    continue
                # winner per property = LAST matching declaration in cascade order
                per_prop = collections.defaultdict(list)
                for entry in m.get("matchedCSSRules", []):
                    rule = entry.get("rule") or {}
                    if rule.get("origin") != "regular":
                        continue
                    sid = rule.get("styleSheetId")
                    sel = (rule.get("selectorList") or {}).get("text", "?")
                    for d in (rule.get("style") or {}).get("cssProperties", []):
                        name = d.get("name")
                        if name not in PROPS or d.get("disabled"):
                            continue
                        per_prop[name].append((sid, sel, bool(d.get("important"))))
                for name, chain in per_prop.items():
                    if len(chain) < 2:
                        # one layer only — record the win, nothing was covered
                        if chain:
                            sid, sel, _ = chain[0]
                            won[sid] += 1; ever[sid].add(sel + "|" + name)
                        continue
                    layers_per_prop[len(chain)] += 1
                    # !important wins over non-important regardless of order
                    imp = [c for c in chain if c[2]]
                    winner = (imp or chain)[-1]
                    for c in chain:
                        key = c[1] + "|" + name
                        if c is winner:
                            won[c[0]] += 1; ever[c[0]].add(key)
                        else:
                            lost[c[0]] += 1; never[c[0]].add(key)

        names = dict(sheets)
        b.close()

    print("\n  WHICH LAYER ACTUALLY WINS")
    print("  Every (element, property) contest, across %d pages.\n" % len(ROUTES))
    def nm(sid):
        h = names.get(sid) or {}
        u = h.get("sourceURL") or ""
        if u:
            return u.rsplit("/", 1)[-1]
        return "inline <style> line %s" % (h.get("startLine", "?"))
    print("  %-42s %8s %8s %7s" % ("stylesheet", "wins", "covered", "waste"))
    total_w = total_l = 0
    for sid in sorted(set(list(won) + list(lost)), key=lambda s: -(won[s] + lost[s])):
        w, l = won[sid], lost[sid]
        total_w += w; total_l += l
        pct = (100.0 * l / (w + l)) if (w + l) else 0
        print("  %-42s %8d %8d %6.0f%%" % (nm(sid), w, l, pct))
    if total_w + total_l:
        print("\n  %d declarations applied, %d of them covered by a later layer (%.0f%%)"
              % (total_w + total_l, total_l, 100.0 * total_l / (total_w + total_l)))

    print("\n  HOW DEEP DOES THE PAINT GO")
    print("  layers on one property     how many times")
    for n in sorted(layers_per_prop):
        print("    %-24d %d" % (n, layers_per_prop[n]))

    print("\n  DEAD PAINT — selectors whose declaration never won anywhere")
    dead_total = 0
    for sid in sorted(never, key=lambda s: -len(never[s] - ever[s])):
        d = never[sid] - ever[sid]
        dead_total += len(d)
        if not d:
            continue
        print("    %s: %d" % (nm(sid), len(d)))
        for k in sorted(d)[:6]:
            sel, prop = k.rsplit("|", 1)
            print("        %-58s %s" % (sel[:58], prop))
    print("\n  %d selector/property pairs are written and never take effect." % dead_total)


if __name__ == "__main__":
    main()
