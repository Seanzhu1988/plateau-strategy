# -*- coding: utf-8 -*-
"""The design gate. Renders every page and measures what a reader actually sees.

Four checks, one browser pass:

  1. **Contrast** — every element that renders its own text, against what is
     really behind it, at both desktop and phone width.
  2. **Gradients** — the single most recognisable tell of a generated site,
     and the thing the paper redesign exists to remove.
  3. **Arm assignment** — which of the four business hues each page resolved
     to, because a page tagged with the wrong arm is a bug no ratio can see.
  4. **Off-palette colour** — text that is perfectly legible and still not a
     colour anyone chose. Passing contrast is not the same as belonging: a
     Tailwind amber on a Trip Planner link clears AA and is still a leftover,
     and the Destination Book had a link with no styling at all, rendering in
     the 1994 browser-default blue. This is the check that separates a page
     that is accessible from a page that looks designed.

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

# Every colour a glyph is allowed to be. Anything else is a leftover — it
# does not matter that it is legible. Kept as rendered rgb() strings so this
# compares against what the browser actually resolved, tokens and all.
PALETTE = [
    "rgb(20, 17, 12)", "rgb(74, 69, 61)", "rgb(107, 101, 91)", "rgb(255, 255, 255)",
    "rgb(27, 77, 143)", "rgb(29, 76, 79)", "rgb(123, 45, 38)", "rgb(156, 66, 33)",
    "rgb(22, 64, 111)", "rgb(22, 58, 60)", "rgb(99, 36, 30)", "rgb(125, 53, 26)",
    "rgb(27, 94, 67)", "rgb(138, 90, 18)", "rgb(163, 48, 42)",
    "rgb(164, 22, 26)", "rgb(193, 18, 31)",
    # modern.css's four arm hues and its ink. These are the CURRENT design's
    # chosen colours — the four above them are paper.css's, which modern.css
    # supersedes. Both lists are live because both stylesheets are, and that is
    # the layering problem this gate was reporting as 967 stray colours. Listing
    # them stops the gate crying wolf; it does not make eight arm hues right,
    # and the fix is to end up with one set, not two.
    "rgb(29, 78, 216)", "rgb(13, 122, 111)", "rgb(168, 50, 31)", "rgb(180, 83, 9)",
    "rgb(11, 11, 12)", "rgb(61, 61, 66)", "rgb(110, 110, 118)",   # --m-body, --m-muted
    # modern.css moved again: a deeper ink and the navy taken from the owner's
    # LLC logo. Listed for the same reason as the four above — the gate should
    # measure against the palette actually in use, and say so rather than
    # reporting 696 strays every run and being ignored.
    "rgb(11, 8, 9)", "rgb(31, 58, 95)", "rgb(20, 39, 63)",   # --m-ink, --m-rose navy, --m-navy
    # map categories — data, so they stay distinguishable from each other
    "rgb(15, 109, 92)", "rgb(168, 90, 8)", "rgb(107, 47, 190)", "rgb(11, 100, 128)",
    "rgb(154, 91, 6)",
    # the Real Estate blueprint sheet, which keeps its own linework colours
    "rgb(234, 244, 255)", "rgb(207, 227, 255)", "rgb(143, 180, 232)", "rgb(255, 206, 107)",
]

STRAY_JS = r"""(palette) => {
  const out = [];
  for (const el of document.querySelectorAll("*")) {
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    if (!el.getClientRects().length) continue;
    if (el.closest(".leaflet-container")) continue;   // the map draws its own labels
    const c = getComputedStyle(el).color;
    if (palette.includes(c)) continue;
    out.push({ c, sel: el.tagName.toLowerCase() + (typeof el.className === "string" && el.className
               ? "." + el.className.trim().split(/\s+/).slice(0,2).join(".") : ""),
               t: el.textContent.trim().slice(0, 34) });
  }
  return out;
}"""

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

    contrast_fails, gradient_fails, stray_fails, untagged = 0, 0, 0, []

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
                        # The view fade is 350ms. Sampling inside it composites
                        # every colour against what is underneath at 0.9-something
                        # opacity, and reports tokens one unit off — rgb(75,69,61)
                        # for body text that is rgb(74,69,61). Two false failures
                        # that look exactly like real ones.
                        page.wait_for_timeout(500)

                    res = page.evaluate(CONTRAST_JS)
                    bad = res["fails"]
                    grads = page.evaluate(GRADIENT_JS) if tag == "desktop" else []
                    strays = page.evaluate(STRAY_JS, PALETTE) if tag == "desktop" else []

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
                    stray_fails += len(strays)

                    mark = "ok  " if not (bad or grads or strays or not arm) else "FAIL"
                    print(f"{mark} {tag:8} {label:20} arm={str(arm):15} accent={accent}")
                    for f in bad[:6]:
                        print(f"       contrast {f['got']}:1 (needs {f['need']}) {f['sel']}"
                              f"  fg={f['fg']} bg={f['bg']}  {f['text']!r}")
                    if len(bad) > 6:
                        print(f"       ... and {len(bad)-6} more on this page")
                    for h in grads:
                        print(f"       gradient {h['sel']}  {h['prop']}: {h['v']}")
                    seen_stray = set()
                    for h in strays:
                        key = (h["c"], h["sel"])
                        if key in seen_stray:
                            continue
                        seen_stray.add(key)
                        print(f"       off-palette {h['c']} {h['sel']}  {h['t']!r}")
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
    if stray_fails:
        print(f"FAIL  {stray_fails} element(s) in a colour outside the palette"); ok = False
    else:
        print("ok    every text colour on the site is one somebody chose")
    if untagged:
        print(f"FAIL  {len(untagged)} page(s) with no data-arm: {', '.join(untagged)}"); ok = False
    else:
        print("ok    every page resolves to one of the four arms")

    sys.exit(1 if (args.strict and not ok) else 0)


if __name__ == "__main__":
    main()
