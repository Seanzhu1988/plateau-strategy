# -*- coding: utf-8 -*-
"""Does the site actually work on a phone? Four things that decide it.

check_design already samples contrast at 390px, so colour is covered. These are
the failures it cannot see, and they are the ones that make a page feel broken
rather than merely ugly:

  1. SIDEWAYS SCROLL. One element wider than the screen and the whole page
     slides under the thumb. It is the single most common mobile defect and it
     is invisible on a desktop, because there is always room. Checked at 320px
     as well as 390 — a 320px screen is still out there and it is where a fixed
     width first bites.

  2. TAP TARGETS. Apple and Google both put the floor around 44px. A 20px link
     is reachable with a mouse and a coin toss with a thumb.

  3. iOS INPUT ZOOM. Safari zooms the whole page when a field with a font size
     under 16px takes focus, and does not zoom back out. The field is legible
     and the form is then unusable, which is why this reads as a layout bug
     rather than a typography one.

  4. TEXT TOO SMALL TO READ. Anything under 12px on a phone.

Run against a live server:
    python3 check_mobile.py --base http://127.0.0.1:5055
"""
import argparse
import os
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:                                          # pragma: no cover
    sys.exit("playwright is not installed:  pip install playwright")

CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

ROUTES = ["/", "/book", "/renter", "/driver", "/agent", "/partners",
          "/trips", "/trip-planner", "/road-trip", "/destination-book",
          "/favorite-place", "/guide-studio", "/books", "/articles",
          "/board", "/factor-clock", "/setup", "/dispatch"]

VIEWS = ["overview", "transportation", "operations", "realestate",
         "finance", "reinvestment", "tools", "security"]

# 320 is the narrowest screen still in real use; 390 is a current iPhone.
WIDTHS = [(320, "320px"), (390, "390px")]

TAP_FLOOR = 44          # px, the Apple/Google guidance
TEXT_FLOOR = 12         # px
INPUT_FLOOR = 16        # px — below this iOS Safari zooms on focus

PROBE = """(cfg) => {
  const doc = document.documentElement;
  const out = {overflow: 0, widest: null, taps: [], small: [], zoomy: []};

  // ---- 1. sideways scroll, and what is causing it
  out.overflow = Math.max(0, doc.scrollWidth - doc.clientWidth);
  if (out.overflow > 1) {
    let worst = null;
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const over = Math.round(r.right - doc.clientWidth);
      if (over > 1 && (!worst || over > worst.over)) {
        worst = {over, tag: el.tagName.toLowerCase(),
                 cls: (el.className && el.className.toString().slice(0, 40)) || '',
                 id: el.id || '', w: Math.round(r.width)};
      }
    }
    out.widest = worst;
  }

  const seen = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const name = (el) => el.tagName.toLowerCase()
      + (el.id ? '#' + el.id : '')
      + (el.className ? '.' + el.className.toString().trim().split(/\\s+/)[0] : '');

  // ---- 2. tap targets
  for (const el of document.querySelectorAll('a[href], button, [onclick], select')) {
    if (!seen(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < cfg.tap || r.height < cfg.tap) {
      out.taps.push({el: name(el), w: Math.round(r.width), h: Math.round(r.height),
                     text: (el.textContent || '').trim().slice(0, 24)});
    }
  }

  // ---- 3. fields that make iOS zoom
  for (const el of document.querySelectorAll('input, textarea, select')) {
    if (!seen(el)) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < cfg.input) out.zoomy.push({el: name(el), size: fs});
  }

  // ---- 4. text too small to read
  for (const el of document.querySelectorAll('body *')) {
    if (!el.childElementCount && (el.textContent || '').trim().length > 2) {
      if (!seen(el)) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < cfg.text) out.small.push({el: name(el), size: fs,
                                         text: el.textContent.trim().slice(0, 24)});
    }
  }
  return out;
}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://127.0.0.1:5055")
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()

    key = (os.environ.get("ROBOT_SHARE_KEY") or "").strip()
    routes = list(ROUTES) + (["/robot"] if key else [])
    if not key:
        print("note: /robot not checked — set ROBOT_SHARE_KEY to include it")

    cfg = {"tap": TAP_FLOOR, "text": TEXT_FLOOR, "input": INPUT_FLOOR}
    overflow_fails, tap_fails, zoom_fails, text_fails = [], [], [], []

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        for width, tag in WIDTHS:
            page = browser.new_page(viewport={"width": width, "height": 780},
                                    is_mobile=True, has_touch=True,
                                    device_scale_factor=2)
            if key:
                page.goto(args.base + "/robot?k=" + key, wait_until="domcontentloaded")
            for route in routes:
                resp = page.goto(args.base + route, wait_until="domcontentloaded")
                page.wait_for_timeout(420)
                if resp is None or (resp.status >= 400 and resp.status != 401):
                    print("DEAD %-6s %-18s %s" % (tag, route, resp.status if resp else "no response"))
                    continue

                steps = VIEWS if route == "/" else [None]
                for view in steps:
                    if view:
                        page.evaluate("showView('%s')" % view)
                        page.wait_for_timeout(420)
                    label = route + (" #" + view if view else "")
                    r = page.evaluate(PROBE, cfg)

                    if r["overflow"] > 1:
                        w = r["widest"] or {}
                        overflow_fails.append((tag, label, r["overflow"], w))
                        print("FAIL %-6s %-24s scrolls sideways by %dpx  <- %s%s w=%s"
                              % (tag, label, r["overflow"], w.get("tag", "?"),
                                 ("." + w.get("cls", "")) if w.get("cls") else "",
                                 w.get("w", "?")))
                    if r["zoomy"]:
                        zoom_fails.append((tag, label, r["zoomy"]))
                        print("FAIL %-6s %-24s %d field(s) under %dpx — iOS will zoom: %s"
                              % (tag, label, len(r["zoomy"]), INPUT_FLOOR,
                                 ", ".join("%s(%gpx)" % (z["el"], z["size"]) for z in r["zoomy"][:3])))
                    if r["taps"]:
                        tap_fails.append((tag, label, r["taps"]))
                    if r["small"]:
                        text_fails.append((tag, label, r["small"]))

                    if not (r["overflow"] > 1 or r["zoomy"]):
                        print("ok   %-6s %-24s %s"
                              % (tag, label,
                                 ("%d small tap target(s)" % len(r["taps"])) if r["taps"] else ""))
            page.close()
        browser.close()

    print("\n" + "=" * 70)
    bad = bool(overflow_fails or zoom_fails)
    print("%-5s no page scrolls sideways" % ("FAIL" if overflow_fails else "ok"))
    print("%-5s no field small enough to make iOS zoom" % ("FAIL" if zoom_fails else "ok"))
    # Tap targets and small text are reported, not gated: the site has dense
    # tables and legal fine print where a 40px row is a deliberate choice.
    # Printing the count keeps them visible without blocking a commit on them.
    print("note  %d page/width combinations have a tap target under %dpx"
          % (len(tap_fails), TAP_FLOOR))
    print("note  %d have text under %dpx" % (len(text_fails), TEXT_FLOOR))
    if tap_fails:
        worst = sorted(tap_fails, key=lambda x: -len(x[2]))[0]
        print("      worst: %s %s — %d, e.g. %s"
              % (worst[0], worst[1], len(worst[2]),
                 ", ".join("%s %dx%d" % (t["el"], t["w"], t["h"]) for t in worst[2][:3])))

    sys.exit(1 if (bad and args.strict) else 0)


if __name__ == "__main__":
    main()
