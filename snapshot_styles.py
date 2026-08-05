# -*- coding: utf-8 -*-
"""Record what every element on every page actually looks like, so a stylesheet
can be taken apart and the result PROVEN identical.

This is the piece that has been missing every previous time. Collapsing nine
stylesheets into one means deleting hundreds of declarations that are covered
by a later layer. Deleting the wrong one is invisible until someone opens the
page — which is why the last attempt was reverted and why every repaint since
has been additive: adding a louder rule is safe, and removing the old one is
the thing nobody could verify.

So: walk every element on every page, resolve the properties a reader can see,
and write them to a file keyed by the element's position in the tree. Do the
surgery. Walk again. Diff. A collapse that changes nothing changes nothing —
and if it does, the diff names the element and the property.

    python3 app.py &
    python3 snapshot_styles.py before.json      # baseline
    ... edit stylesheets ...
    python3 snapshot_styles.py after.json
    python3 snapshot_styles.py --diff before.json after.json
"""
import json
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:                                          # pragma: no cover
    sys.exit("playwright is not installed:  pip install playwright")

BASE = "http://127.0.0.1:5055"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

ROUTES = ["/", "/book", "/renter", "/driver", "/agent", "/partners", "/dispatch",
          "/trips", "/trip-planner", "/road-trip", "/destination-book",
          "/favorite-place", "/guide-studio", "/books", "/articles", "/archive",
          "/board", "/deflator", "/factor-clock", "/setup"]

# The landing page is eight views stacked in one document, seven of them
# display:none at load. Snapshotting only what is on screen would sign off on
# one view and call the route covered.
VIEWS = ["overview", "transportation", "operations", "realestate",
         "finance", "reinvestment", "tools", "security"]

# What a reader can see. Not layout: this is about colour, and a diff full of
# paddings would bury the one line that matters.
FREEZE_JS = """() => {
  const s = document.createElement('style');
  s.textContent = '*,*::before,*::after{' +
    'transition:none !important;animation:none !important;' +
    'transition-duration:0s !important;animation-duration:0s !important;' +
    'animation-play-state:paused !important;caret-color:transparent !important;}';
  document.head.appendChild(s);
}"""

COLLECT_JS = r"""() => {
  const PROPS = ['color','backgroundColor','backgroundImage','borderTopColor',
                 'borderRightColor','borderBottomColor','borderLeftColor',
                 'borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth',
                 'boxShadow','fontFamily','fontWeight','fontSize','textDecorationColor',
                 'outlineColor','opacity','visibility','display'];
  const out = {};
  // Key by position in the tree rather than by selector: two elements can share
  // every class and differ in what they render, and a selector key would
  // silently merge them.
  const walk = (el, path) => {
    const cs = getComputedStyle(el);
    // A property set in the element's own style="" attribute outranks every
    // stylesheet, so no amount of collapsing them can change it — and two of
    // these are driven by a running script, which is why freezing CSS
    // animations did not settle them. Out of scope, so out of the snapshot.
    const inl = el.style;
    const v = [];
    for (const p of PROPS) v.push(inl && inl[p] ? '!' : cs[p]);
    out[path + '|' + el.tagName.toLowerCase()] = v.join('');
    let i = 0;
    for (const c of el.children) walk(c, path + '/' + (i++));
  };
  if (document.body) walk(document.body, '');
  return out;
}"""


def capture(path_out):
    snap = {}
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME)
        pg = b.new_page(viewport={"width": 1440, "height": 950})
        for route in ROUTES:
            pg.goto(BASE + route, wait_until="domcontentloaded")
            pg.wait_for_timeout(1400)
            pg.evaluate(FREEZE_JS)
            pg.wait_for_timeout(120)
            if route == "/":
                for v in VIEWS:
                    try:
                        pg.evaluate("showView('%s')" % v)
                    except Exception:
                        continue
                    pg.evaluate(FREEZE_JS)        # the fade is off; nothing to wait out
                    pg.wait_for_timeout(220)
                    for k, val in pg.evaluate(COLLECT_JS).items():
                        snap["/#%s %s" % (v, k)] = val
            else:
                for k, val in pg.evaluate(COLLECT_JS).items():
                    snap["%s %s" % (route, k)] = val
        b.close()
    json.dump(snap, open(path_out, "w"), separators=(",", ":"))
    print("  %d elements recorded -> %s" % (len(snap), path_out))


def diff(a_path, b_path):
    a = json.load(open(a_path))
    b = json.load(open(b_path))
    only_a = set(a) - set(b)
    only_b = set(b) - set(a)
    changed = [k for k in (set(a) & set(b)) if a[k] != b[k]]

    print("\n  %d elements before, %d after" % (len(a), len(b)))
    if only_a or only_b:
        print("  %d disappeared, %d appeared — the DOM moved, so this is not a"
              % (len(only_a), len(only_b)))
        print("  pure restyle and the comparison below only covers what is in both.")
        for k in sorted(only_a)[:5]:
            print("      gone: %s" % k[:96])
        for k in sorted(only_b)[:5]:
            print("      new:  %s" % k[:96])

    if not changed:
        print("\n  IDENTICAL — every shared element resolves to the same paint.")
        return 0

    print("\n  %d elements changed:\n" % len(changed))
    PROPS = ['color', 'background-color', 'background-image', 'border-top-color',
             'border-right-color', 'border-bottom-color', 'border-left-color',
             'border-top-width', 'border-right-width', 'border-bottom-width',
             'border-left-width', 'box-shadow', 'font-family', 'font-weight',
             'font-size', 'text-decoration-color', 'outline-color', 'opacity',
             'visibility', 'display']
    shown = 0
    for k in sorted(changed):
        av, bv = a[k].split(""), b[k].split("")
        deltas = [(PROPS[i], x, y) for i, (x, y) in enumerate(zip(av, bv)) if x != y]
        if not deltas:
            continue
        shown += 1
        if shown > 25:
            continue
        print("    %s" % k[:104])
        for name, x, y in deltas[:4]:
            print("        %-22s %s  ->  %s" % (name, x[:34], y[:34]))
    if shown > 25:
        print("    … and %d more" % (shown - 25))
    return 1


if __name__ == "__main__":
    if len(sys.argv) >= 4 and sys.argv[1] == "--diff":
        raise SystemExit(diff(sys.argv[2], sys.argv[3]))
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    capture(sys.argv[1])
