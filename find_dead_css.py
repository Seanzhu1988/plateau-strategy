# -*- coding: utf-8 -*-
"""Which rules in a stylesheet never win anything, anywhere?

check_layers.py counts the waste. This names it, precisely enough to delete:
for every rule in the target stylesheet it records the exact byte range in the
file, then asks the browser, on every page and both widths, whether ANY
declaration in that rule ever supplies the value an element ends up with.

A rule where the answer is no everywhere is doing nothing. It is not "mostly
redundant" or "probably safe to remove" — it is text that the browser reads,
resolves, and discards, and the only cost of keeping it is that the next person
to change a colour has to read it first and cannot tell.

Two rules about how this is used, both learned the hard way on this repo:

  * EVERY property, not just colour. A rule whose colour is overridden but
    whose padding still lands is not dead. Tracking colour alone would have
    deleted layout.
  * BOTH widths. A rule that only ever matches inside a phone media query is
    invisible at 1440px and very much alive at 390px.
  * SHORTHANDS COUNT. `border:1px solid X` is reported by the browser as a
    shorthand plus the longhands it implies, and only the shorthand carries a
    source range. An earlier version required a range and so believed those
    rules supplied nothing — it marked four live rules dead, and the snapshot
    caught it at the border widths.

Even then this is evidence, not permission. Nothing here is deleted without
snapshot_styles.py proving the page resolves identically afterwards — the
browser only reports what it saw on the pages it was pointed at.

    python3 app.py &
    python3 find_dead_css.py paper.css
"""
import collections
import json
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:                                          # pragma: no cover
    sys.exit("playwright is not installed:  pip install playwright")

BASE = "http://127.0.0.1:5055"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
TARGET = sys.argv[1] if len(sys.argv) > 1 else "paper.css"

ROUTES = ["/", "/book", "/renter", "/driver", "/agent", "/partners", "/dispatch",
          "/trips", "/trip-planner", "/road-trip", "/destination-book",
          "/favorite-place", "/guide-studio", "/books", "/articles", "/archive",
          "/board", "/deflator", "/factor-clock", "/setup"]
VIEWS = ["overview", "transportation", "operations", "realestate",
         "finance", "reinvestment", "tools", "security"]
WIDTHS = [(1440, 950), (390, 780)]


def main():
    # (start, end) -> did any declaration in this rule ever win
    alive = collections.defaultdict(bool)
    seen = {}                       # (start,end) -> selector text, for the report

    sigs_seen = set()
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME)
        for w, h in WIDTHS:
            pg = b.new_page(viewport={"width": w, "height": h})
            cdp = pg.context.new_cdp_session(pg)
            sheets = {}
            cdp.on("CSS.styleSheetAdded", lambda e: sheets.__setitem__(
                e["header"]["styleSheetId"], e["header"]))
            cdp.send("DOM.enable"); cdp.send("CSS.enable")

            # One getMatchedStylesForNode per element is a round trip per
            # element, and 11650 elements at two widths does not finish. But
            # most of those elements are the same element: every card on every
            # page has the same tag, the same classes and the same ancestry, so
            # it matches the same rules and asking again learns nothing. Query
            # one representative per distinct style context, globally — which
            # collapses twenty pages sharing a header and a footer into one ask.
            SIG_JS = """() => {
              const sig = el => {
                const parts = [];
                for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
                  parts.push(n.tagName + '.' + (typeof n.className === 'string' ? n.className : '')
                             + '#' + (n.id || '') + '[' + [...n.attributes]
                             .map(a => a.name).filter(a => a.startsWith('data-')).join(',') + ']');
                  if (parts.length > 4) break;      // deeper than any selector here reaches
                }
                return parts.join('>');
              };
              const out = [];
              let i = 0;
              for (const el of document.querySelectorAll('body, body *')) {
                el.setAttribute('data-psx-dead-probe', i);
                out.push([i++, sig(el)]);
              }
              return out;
            }"""

            def sweep():
                pairs = pg.evaluate(SIG_JS)
                want = []
                for idx, s in pairs:
                    if s in sigs_seen:
                        continue
                    sigs_seen.add(s)
                    want.append(idx)
                if not want:
                    return
                doc = cdp.send("DOM.getDocument", {"depth": -1, "pierce": False})
                root = doc["root"]["nodeId"]
                ids = []
                for idx in want:
                    r = cdp.send("DOM.querySelectorAll",
                                 {"nodeId": root,
                                  "selector": '[data-psx-dead-probe="%d"]' % idx})["nodeIds"]
                    ids.extend(r)
                for nid in ids:
                    try:
                        m = cdp.send("CSS.getMatchedStylesForNode", {"nodeId": nid})
                    except Exception:
                        continue
                    chain = collections.defaultdict(list)
                    for entry in m.get("matchedCSSRules", []):
                        rule = entry.get("rule") or {}
                        if rule.get("origin") != "regular":
                            continue
                        sid = rule.get("styleSheetId")
                        hdr = sheets.get(sid) or {}
                        src = (hdr.get("sourceURL") or "").rsplit("/", 1)[-1]
                        st = rule.get("style") or {}
                        rng = st.get("range")
                        key = None
                        if src == TARGET and rng:
                            key = (rng["startLine"], rng["startColumn"],
                                   rng["endLine"], rng["endColumn"])
                            seen[key] = (rule.get("selectorList") or {}).get("text", "?")
                        for d in st.get("cssProperties", []):
                            name = d.get("name")
                            # NOT `and d.get("range")`. A shorthand is reported
                            # with a range; the longhands it implies are
                            # reported without one. Requiring a range made every
                            # rule that writes `border:1px solid X` look as
                            # though it supplied nothing, and the first deletion
                            # run took out four such rules. The snapshot caught
                            # it — border widths went 1px to 0px on the tabs and
                            # the CTA — but the analyser should not have said
                            # they were dead. A derived longhand is still this
                            # rule doing the work.
                            if not name or d.get("disabled"):
                                continue
                            chain[name].append((key, bool(d.get("important"))))
                    for name, cs in chain.items():
                        imp = [c for c in cs if c[1]]
                        winner = (imp or cs)[-1]
                        if winner[0] is not None:
                            alive[winner[0]] = True
                # make sure every rule we saw has an entry, even if never a winner
                for k in seen:
                    alive.setdefault(k, False)

            for route in ROUTES:
                pg.goto(BASE + route, wait_until="domcontentloaded")
                pg.wait_for_timeout(1100)
                sweep()
                if route == "/":
                    for v in VIEWS:
                        try:
                            pg.evaluate("showView('%s')" % v)
                        except Exception:
                            continue
                        pg.wait_for_timeout(320)
                        sweep()
            pg.close()
        b.close()

    dead = sorted(k for k in seen if not alive.get(k))
    live = [k for k in seen if alive.get(k)]
    print("\n  %s: %d rules matched something, %d of them never won a single"
          % (TARGET, len(seen), len(dead)))
    print("  declaration on any page at either width.\n")
    for k in dead[:40]:
        print("    line %-5d %s" % (k[0] + 1, seen[k][:88]))
    if len(dead) > 40:
        print("    … and %d more" % (len(dead) - 40))
    print("\n  %d rules still carry the page." % len(live))

    out = TARGET + ".dead.json"
    json.dump([{"range": list(k), "selector": seen[k]} for k in dead], open(out, "w"), indent=1)
    print("  ranges written to %s — feed to the remover, then diff the snapshot." % out)


if __name__ == "__main__":
    main()
