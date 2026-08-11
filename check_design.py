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
import os
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:                                          # pragma: no cover
    sys.exit("playwright is not installed:  pip install playwright")

# ---------------------------------------------------------------------------
# Routes are DERIVED, never hand-typed.
#
# The hand-typed list drifted: /professionals went live at app.py:5412 and was
# never added, so the gate reported "every page passes" while never opening it.
# A list a human must remember to update is the same failure shape as a
# :not() chain a human must remember to sync.
#
# Two sources, because neither alone is complete:
#   * app.py            — what the site actually serves (catches new routes)
#   * the .html files    — what exists on disk (catches files with no route,
#                          which a url_map walk can never see)
# ---------------------------------------------------------------------------
import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Scaffolding, on purpose. Anything NOT listed here must be swept or explained.
EXCLUDED = {
    "contrast-audit.html": "the older in-browser tool — scaffolding, not a page",
}
BACKUP_RE = re.compile(r"\.backup-\d+", re.I)


def discover():
    """Return (routes, dark_files). Static scan — importing app.py would start
    its background threads, and a gate must not have side effects."""
    src = open(os.path.join(BASE_DIR, "app.py"), encoding="utf-8", errors="replace").read()
    # @app.route("/x")  ...  send_file(... "y.html")   — decorator to the file
    # it eventually serves, allowing decorator stacks and intervening lines.
    routes, served = [], set()
    for m in re.finditer(r'@app\.route\(\s*[\'"]([^\'"]+)[\'"]', src):
        path = m.group(1)
        if "<" in path or path.startswith(("/api/", "/sms/", "/media/")):
            continue                                    # params + non-HTML endpoints
        # Bound the window to THIS decorator's own function.
        #   * unbounded, it reads the next function and credits this route with
        #     that file (/modern.css was first reported as a page this way);
        #   * bounded at the next @app.route, it truncates STACKED decorators —
        #     @app.route("/renter") sits directly above @app.route("/driver"),
        #     so /renter lost its send_file and silently left the sweep. That
        #     is a coverage regression wearing the costume of a tidy fix.
        # So: find this route's `def`, then stop at the decorator after it.
        d = src.find("\ndef ", m.end())
        nxt = src.find("@app.route", d) if d != -1 else -1
        body = src[m.end():nxt if nxt != -1 else m.end() + 1400]
        f = re.search(r'BASE_DIR,\s*[\'"]([a-zA-Z0-9_.-]+\.html)[\'"]', body)
        if not f:
            continue
        if f.group(1) in EXCLUDED:
            continue
        routes.append(path)
        served.add(f.group(1))

    dark = []
    for fn in sorted(os.listdir(BASE_DIR)):
        if not fn.endswith(".html") or BACKUP_RE.search(fn):
            continue
        if fn in served or fn in EXCLUDED:
            continue
        dark.append(fn)
    return sorted(set(routes)), dark


ROUTES, DARK_FILES = discover()

# Pages shared by link need their key before they will answer at all. The key
# is spent once per browser context, below, rather than being carried in the
# route — otherwise it would be printed on every result line and end up in
# whatever log this gate writes to. Covered when the key is in the
# environment; the skip is printed rather than silent, because a gate that
# quietly stops covering a page is worse than one that fails.
# /setup became owner-only on 2026-08-08, after the council found it open to
# anyone. Same story as /robot below: locking a page drops it out of whatever
# was checking it unless the checker can sign in too.
_OWNER_USER = (os.environ.get("OWNER_TEST_USER") or "").strip()
_OWNER_PASS = (os.environ.get("OWNER_TEST_PASS") or "").strip()
if not _OWNER_USER:
    ROUTES = [r for r in ROUTES if r != "/setup"]
    print("note: /setup not checked — set OWNER_TEST_USER/OWNER_TEST_PASS to include it")

_ROBOT_KEY = (os.environ.get("ROBOT_SHARE_KEY") or "").strip()
_LAB_USER = (os.environ.get("LAB_TEST_USER") or "").strip()
_LAB_PASS = (os.environ.get("LAB_TEST_PASS") or "").strip()
if _ROBOT_KEY:
    ROUTES.append("/robot")
    if not _LAB_USER:
        print("note: /robot will show its sign-in page — set LAB_TEST_USER and "
              "LAB_TEST_PASS to check the page behind it")
else:
    print("note: /robot not checked — set ROBOT_SHARE_KEY to include it")

# The eight views stacked inside "/". Each is activated in turn.
VIEWS = ["overview", "transportation", "operations", "realestate",
         "finance", "reinvestment", "tools", "security"]


def resolve_chrome():
    """The container's Chromium if we are in the container, otherwise the one
    Playwright installed locally.

    This was hardcoded to a Linux container path, which means the gate could
    not LAUNCH on the machine the site is developed on — it did not merely miss
    findings, it never ran here at all. A gate that cannot start is the
    quietest false pass there is.
    """
    container = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
    return container if os.path.exists(container) else None

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
    # ---- modern.css :root, the CURRENT system ----
    # This list was written in the paper era and never updated when the system
    # moved to navy, so the gate reported the brand colour itself as a leftover
    # — 1869 "off-palette" hits, nearly all of them the design system obeying
    # itself. A gate that cries wolf is ignored, which is its own silent pass.
    # Exactly these tokens, read from modern.css :root — not every colour that
    # happened to render, which would be papering over rather than fixing.
    "rgb(11, 8, 9)",        # --m-ink
    "rgb(61, 61, 66)",      # --m-body
    "rgb(110, 110, 118)",   # --m-muted
    "rgb(31, 58, 95)",      # --m-rose / --m-rose-deep  (the brand navy)
    "rgb(20, 39, 63)",      # --m-navy (hover)
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


# ---------------------------------------------------------------------------
# THE FILL SENSOR — the check that did not exist.
#
# "A control is a word with a rule under it, never a fill behind a word" is the
# strongest rule in the system, stated three times, and nothing measured it.
# Contrast cannot: a solid #2563eb pill with white text PASSES contrast
# beautifully. That is exactly how .jvMsg.me and the language switcher's
# aria-current fill survived four audits.
#
# Carve-outs are declared AT THE ELEMENT (data-carveout), not inferred from a
# chain in a stylesheet. An element that forgets its marking renders plain and
# is caught by eye; a denylist that forgets an entry renders filled and looks
# completely normal. That asymmetry is the whole point.
# ---------------------------------------------------------------------------
FILL_JS = r"""() => {
  const CONTROL = 'a,button,summary,[role=button],[onclick],.chip,.btn,.badge,.tag,.i18n-opt,.pk-bubble';
  const px = c => { const m = c.match(/[\d.]+/g);
                    return m ? [+m[0], +m[1], +m[2], m.length > 3 ? +m[3] : 1] : null; };
  const out = [];
  for (const el of document.querySelectorAll("*")) {
    if (el.closest("[data-carveout]")) continue;        // declared exception
    if (el.closest(".leaflet-container")) continue;     // the map is data
    if (el.closest("#pollock")) continue;               // the mark itself, by design
    const cs = getComputedStyle(el);
    const isControl = el.matches(CONTROL) || cs.cursor === "pointer";
    if (!isControl) continue;
    // must carry its own word — a filled wrapper around a link is a panel
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    if (!el.getClientRects().length) continue;
    const bg = px(cs.backgroundColor);
    const filled = bg && bg[3] > 0.06;                  // a real fill, not a hairline wash
    const img = cs.backgroundImage && cs.backgroundImage !== "none";
    if (filled || img) {
      out.push({ sel: el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") +
                      (typeof el.className === "string" && el.className
                        ? "." + el.className.trim().split(/\s+/).slice(0,2).join(".") : ""),
                 bg: cs.backgroundColor, img: img ? cs.backgroundImage.slice(0, 40) : "",
                 t: el.textContent.trim().slice(0, 30) });
    }
  }
  return out;
}"""

# Focus must be an INSET BAR. Any shadow that paints OUTSIDE the element box is
# a ring — the exact form the settled rule forbids, and the form sitting
# unconditionally on every input at modern.css:576-580. Never measured, because
# the gate never called .focus() once.
FOCUS_JS = r"""() => {
  const out = [];
  if (!document.hasFocus()) return [{ sel: "(window)", shadow: "WINDOW NOT FOCUSED",
                                      t: "focus styles do not render — result is meaningless" }];
  const controls = [...document.querySelectorAll("a,button,input,select,textarea,summary,[role=button],.chip")]
                     .filter(el => el.getClientRects().length);
  for (const el of controls.slice(0, 40)) {
    // Measure the DELTA, not the state. A permanent drop shadow is not a focus
    // ring: the switcher's own `0 10px 28px rgba(0,0,0,.35)` read as a ring on
    // the first pass and would have sent me editing a shadow that was never
    // the bug. What focus ADDS is the only thing this rule is about.
    const before = getComputedStyle(el).boxShadow;
    try { el.focus({ preventScroll: true }); } catch (e) { continue; }
    if (document.activeElement !== el) continue;
    const cs = getComputedStyle(el);
    const sh = cs.boxShadow;
    if (sh && sh !== "none" && sh !== before && !sh.includes("inset")) {
      out.push({ sel: el.tagName.toLowerCase() + (el.id ? "#" + el.id : ""),
                 shadow: sh.slice(0, 60), t: (el.textContent || el.value || "").trim().slice(0, 24) });
    }
    const ow = parseFloat(cs.outlineWidth) || 0;
    if (ow > 0 && cs.outlineStyle !== "none") {
      out.push({ sel: el.tagName.toLowerCase() + (el.id ? "#" + el.id : ""),
                 shadow: `outline ${cs.outlineStyle} ${cs.outlineWidth}`,
                 t: (el.textContent || "").trim().slice(0, 24) });
    }
  }
  try { document.activeElement && document.activeElement.blur(); } catch (e) {}
  return out;
}"""

# Everything a reader can open, opened. The docstring already records that
# display:none views hid seven-eighths of the landing page; the same lesson was
# never generalised to click-to-open widgets, so the language switcher's
# dropdown — a solid fill behind a language word, on all 23 pages — sat at
# getClientRects().length === 0 and was skipped by every pass.
OPEN_JS = r"""() => {
  for (const sel of ["#i18nBtn", "#jvBtn", "#pollock"]) {
    const el = document.querySelector(sel);
    if (el) { try { el.click(); } catch (e) {} }
  }
  for (const d of document.querySelectorAll("details")) d.open = true;
  return true;
}"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://127.0.0.1:5055",
                    help="where the site is served (default: %(default)s)")
    ap.add_argument("--strict", action="store_true",
                    help="exit non-zero on any failure, so this can gate a commit")
    args = ap.parse_args()

    contrast_fails, gradient_fails, stray_fails, untagged = 0, 0, 0, []
    fill_fails, focus_fails = 0, 0

    print(f"sweeping {len(ROUTES)} derived route(s); "
          f"{len(DARK_FILES)} file(s) on disk with no route")

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=resolve_chrome())
        for width, tag in ((1280, "desktop"), (390, "mobile")):
            page = browser.new_page(viewport={"width": width, "height": 900})
            if _OWNER_USER:                     # sign in once per context
                page.goto(args.base + "/", wait_until="domcontentloaded")
                page.evaluate(
                    """([u, w]) => fetch('/api/owner/login', {method: 'POST',
                         headers: {'Content-Type': 'application/json'},
                         body: JSON.stringify({username: u, password: w})})""",
                    [_OWNER_USER, _OWNER_PASS])
                page.wait_for_timeout(250)
            if _ROBOT_KEY:                      # trade the key for a cookie once
                page.goto(args.base + "/robot?k=" + _ROBOT_KEY,
                          wait_until="domcontentloaded")
                # /robot needs a password as well as the link now, so without
                # an account this gate would only ever see the sign-in page.
                # With one it sees the page behind it too. Credentials come
                # from the environment for the same reason the key does — so
                # they are never printed on a result line or written down here.
                if _LAB_USER:
                    page.evaluate(
                        """([u, p]) => fetch('/api/access/login', {method: 'POST',
                             headers: {'Content-Type': 'application/json'},
                             body: JSON.stringify({username: u, password: p})})""",
                        [_LAB_USER, _LAB_PASS])
                    page.wait_for_timeout(200)
            for route in ROUTES:
                resp = page.goto(args.base + route, wait_until="domcontentloaded")
                page.wait_for_timeout(320)
                # A by-link page answers 401 with a real sign-in page rather
                # than an error body. That is a page visitors see, so it gets
                # checked like any other instead of being counted as dead.
                if resp is not None and resp.status == 401 and route == "/robot":
                    print(f"note {tag:8} {route:20} showing its sign-in page")
                elif resp is None or resp.status >= 400:
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

                    # open everything a reader can open BEFORE measuring
                    page.evaluate(OPEN_JS)
                    page.wait_for_timeout(220)

                    res = page.evaluate(CONTRAST_JS)
                    bad = res["fails"]
                    grads = page.evaluate(GRADIENT_JS) if tag == "desktop" else []
                    strays = page.evaluate(STRAY_JS, PALETTE) if tag == "desktop" else []
                    fills = page.evaluate(FILL_JS) if tag == "desktop" else []
                    focus = page.evaluate(FOCUS_JS) if tag == "desktop" else []

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
                    fill_fails += len(fills)
                    focus_fails += len(focus)

                    mark = "ok  " if not (bad or grads or strays or fills or focus or not arm) else "FAIL"
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
                    seen_fill = set()
                    for h in fills:
                        if h["sel"] in seen_fill:
                            continue
                        seen_fill.add(h["sel"])
                        print(f"       FILL behind a word: {h['sel']}  "
                              f"{h['bg']}{' ' + h['img'] if h['img'] else ''}  {h['t']!r}")
                    for h in focus[:6]:
                        print(f"       focus ring: {h['sel']}  {h['shadow']}  {h['t']!r}")
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
    if fill_fails:
        print(f"FAIL  {fill_fails} control(s) with a fill behind the word"); ok = False
    else:
        print("ok    every control is a word with a rule under it — no fills")
    if focus_fails:
        print(f"FAIL  {focus_fails} control(s) focus as a ring instead of an inset bar"); ok = False
    else:
        print("ok    focus is an inset bar everywhere it was measured")
    if DARK_FILES:
        # Not a failure: an unrouted file ships to nobody. But it must be named,
        # because "no route" is exactly how rent-a-tesla.html kept a full cream
        # theme that no stylesheet could reach and no audit ever opened.
        print(f"note  {len(DARK_FILES)} file(s) with no route (not served, not gated): "
              f"{', '.join(DARK_FILES)}")

    sys.exit(1 if (args.strict and not ok) else 0)


if __name__ == "__main__":
    main()
