# -*- coding: utf-8 -*-
"""The design gate. Renders every page and measures what a reader actually sees.

Three checks, one browser pass:

  1. **Contrast** — every element that renders its own text, against what is
     really behind it, at both desktop and phone width.
  2. **Gradients** — the single most recognisable tell of a generated site,
     and the thing the paper redesign exists to remove.
  3. **Arm assignment** — which of the four business hues each page resolved
     to, because a page tagged with the wrong arm is a bug no ratio can see.

Why this is a rendering check and not a grep over the stylesheets — every one
of these was a real mistake made on this repo:

  * A bulk find-and-replace left a badge dark-brown on dark-brown at 1.47:1.
    The map had no idea which hex was text and which was background.
  * An audit reported 1:1 on `rgba(...,.06)` because it treated a translucent
    tint as an opaque fill instead of compositing it against its parent.
  * A repaint of "pale text on white" pushed ink onto the one dark panel on
    the site, breaking four rules that had been correct.
  * A stylesheet comment described the opposite of what the stylesheet did:
    an earlier rule carried one extra `:not()` and silently outranked it.
  * PALETTE.md claimed twice that gradients were "verified absent on every
    route". Both times it was written rather than measured. Seventy survived.

And the one that hid the most: the landing page is eight views stacked in one
document, seven of them `display:none` at load. Measuring only what is on
screen measures one view and calls the whole route clean.

Usage:
    python3 app.py &                    # or any host/port via --base
    python3 check_design.py             # report
    python3 check_design.py --strict    # exit non-zero on any failure
"""
import argparse
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:                                          # pragma: no cover
    sys.exit("playwright is not installed:  pip install playwright")

# Every page the site serves to a visitor. /contrast-audit is the older
# in-browser tool and is deliberately not in the list — it is scaffolding.
ROUTES = ["/", "/book", "/renter", "/driver", "/agent", "/partners", "/dispatch",
          "/trips", "/trip-planner", "/road-trip", "/destination-book",
          "/favorite-place", "/guide-studio", "/books", "/articles", "/archive",
          "/board", "/deflator", "/factor-clock", "/setup"]

# The eight views stacked inside "/". Each is activated in turn.
VIEWS = ["overview", "transportation", "operations", "realestate",
         "finance", "reinvestment", "tools", "security"]

# Chromium ships with the container; do not download another one.
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

CONTRAST_JS = r"""() => {
  const px = c => {                       // "rgba(r, g, b, a)" -> [r,g,b,a]
    const m = c.match(/[\d.]+/g);
    return m ? [ +m[0], +m[1], +m[2], m.length > 3 ? +m[3] : 1 ] : null;
  };
  const over = (fg, bg) => {              // source-over compositing
    const a = fg[3];
    return [ fg[0]*a + bg[0]*(1-a), fg[1]*a + bg[1]*(1-a), fg[2]*a + bg[2]*(1-a), 1 ];
  };
  // What is actually behind this element: walk up until something is opaque.
  // Reading the element's own background-color is not enough — most of the
  // tints on this site are translucent and sit on a parent that is not.
  const behind = el => {
    let acc = null;
    for (let n = el; n; n = n.parentElement) {
      const c = px(getComputedStyle(n).backgroundColor);
      if (!c || c[3] === 0) continue;
      acc = acc ? over(acc, c) : c;
      if (acc[3] === 1) return acc;
    }
    return acc ? over(acc, [255,255,255,1]) : [255,255,255,1];
  };
  const lum = c => {
    const f = v => { v /= 255; return v <= .03928 ? v/12.92 : Math.pow((v+.055)/1.055, 2.4); };
    return .2126*f(c[0]) + .7152*f(c[1]) + .0722*f(c[2]);
  };
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p,q) => q-p);
    return (x + .05) / (y + .05);
  };

  const out = [];
  for (const el of document.querySelectorAll("*")) {
    // Only elements that render their own text. A wrapper inherits its
    // colour but paints no glyphs, and counting it double-reports.
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;

    // The wordmark is painted through -webkit-text-fill-color, which wins
    // over `color`; reading `color` alone measures a colour nobody sees.
    let fg = px(cs.webkitTextFillColor && cs.webkitTextFillColor !== "rgba(0, 0, 0, 0)"
                ? cs.webkitTextFillColor : cs.color);
    if (!fg) continue;
    const bg = behind(el);
    if (fg[3] < 1) fg = over(fg, bg);

    const size = parseFloat(cs.fontSize);
    const w = cs.fontWeight === "bold" ? 700 : (+cs.fontWeight || 400);
    const large = size >= 24 || (size >= 18.66 && w >= 700);
    const need = large ? 3 : 4.5;
    const got = ratio(fg, bg);
    if (got + 1e-9 < need) {
      out.push({ text: el.textContent.trim().slice(0, 48), got: +got.toFixed(2), need,
                 fg: cs.color, bg: `rgb(${bg.slice(0,3).map(Math.round).join(",")})`,
                 sel: el.tagName.toLowerCase() + (el.className && typeof el.className === "string"
                      ? "." + el.className.trim().split(/\s+/).slice(0,2).join(".") : "") });
    }
  }
  const armEl = document.querySelector("[data-arm]");
  return { fails: out,
           arm: armEl ? armEl.getAttribute("data-arm") : null,
           accent: getComputedStyle(armEl || document.body).getPropertyValue("--psx-accent").trim() };
}"""

GRADIENT_JS = r"""() => {
  const hits = [];
  for (const el of document.querySelectorAll("*")) {
    // Two exemptions, both drawn rather than decorative: the Real Estate
    // blueprint, whose grid IS a gradient, and the map, which is data.
    if (el.closest("#view-realestate .bp-sheet") || el.closest(".leaflet-container")) continue;
    // A gradient on a display:none element is not on the page. This asks
    // what a reader sees, so hidden subtrees do not count.
    if (!el.getClientRects().length) continue;
    const cs = getComputedStyle(el);
    for (const prop of ["backgroundImage", "webkitTextFillColor", "borderImageSource"]) {
      const v = cs[prop];
      if (v && v.includes("gradient")) {
        // The hatch on a zero-value Deflator track encodes "no data".
        if (v.includes("repeating-linear-gradient")) continue;
        hits.push({ sel: el.tagName.toLowerCase() + (typeof el.className === "string" && el.className
                    ? "." + el.className.trim().split(/\s+/).slice(0,2).join(".") : ""),
                    prop, v: v.slice(0, 68) });
      }
    }
  }
  return hits;
}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://127.0.0.1:5055",
                    help="where the site is served (default: %(default)s)")
    ap.add_argument("--strict", action="store_true",
                    help="exit non-zero on any failure, so this can gate a commit")
    args = ap.parse_args()

    contrast_fails, gradient_fails, untagged = 0, 0, []

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        for width, tag in ((1280, "desktop"), (390, "mobile")):
            page = browser.new_page(viewport={"width": width, "height": 900})
            for route in ROUTES:
                resp = page.goto(args.base + route, wait_until="domcontentloaded")
                page.wait_for_timeout(320)
                if resp is None or resp.status >= 400:
                    print(f"DEAD {tag:8} {route:20} {resp.status if resp else 'no response'}")
                    contrast_fails += 1
                    continue

                steps = VIEWS if route == "/" else [None]
                for view in steps:
                    if view:
                        page.evaluate(f"showView('{view}')")
                        page.wait_for_timeout(260)

                    res = page.evaluate(CONTRAST_JS)
                    bad = res["fails"]
                    grads = page.evaluate(GRADIENT_JS) if tag == "desktop" else []

                    if view:
                        scope = f"document.querySelector('#view-{view}')"
                        arm = page.evaluate(f"{scope}.dataset.arm")
                        accent = page.evaluate(
                            f"getComputedStyle({scope}).getPropertyValue('--psx-accent').trim()")
                        label = f"/ #{view}"
                    else:
                        arm, accent, label = res["arm"], res["accent"], route

                    if not arm:
                        untagged.append(label)
                    contrast_fails += len(bad)
                    gradient_fails += len(grads)

                    mark = "ok  " if not (bad or grads or not arm) else "FAIL"
                    print(f"{mark} {tag:8} {label:20} arm={str(arm):15} accent={accent}")
                    for f in bad[:6]:
                        print(f"       contrast {f['got']}:1 (needs {f['need']}) {f['sel']}"
                              f"  fg={f['fg']} bg={f['bg']}  {f['text']!r}")
                    if len(bad) > 6:
                        print(f"       ... and {len(bad)-6} more on this page")
                    for h in grads:
                        print(f"       gradient {h['sel']}  {h['prop']}: {h['v']}")
            page.close()
        browser.close()

    print("\n" + "=" * 70)
    ok = True
    if contrast_fails:
        print(f"FAIL  {contrast_fails} element(s) below their WCAG floor"); ok = False
    else:
        print("ok    contrast: every element clears its floor, desktop and phone")
    if gradient_fails:
        print(f"FAIL  {gradient_fails} gradient(s) outside the two exemptions"); ok = False
    else:
        print("ok    gradients: none outside the blueprint sheet and the no-data hatch")
    if untagged:
        print(f"FAIL  {len(untagged)} page(s) with no data-arm: {', '.join(untagged)}"); ok = False
    else:
        print("ok    every page resolves to one of the four arms")

    sys.exit(1 if (args.strict and not ok) else 0)


if __name__ == "__main__":
    main()
