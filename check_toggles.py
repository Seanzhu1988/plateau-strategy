# -*- coding: utf-8 -*-
"""Click every toggle twice. It has to end up where it started.

"When one button being clicked it should have to be unclicked."

A control that turns on and cannot turn off is worse than one that never
worked, because the reader assumes they did it wrong and clicks it again. And
there is a second version of the same complaint that looks identical on screen
and has a different cause: the button DID untoggle, but it kept :focus, so it
still looks pressed. Both end with a row of controls that appear stuck on, and
guessing which one is happening is how this gets fixed in the wrong place.

So this drives a real browser: find everything that behaves like a toggle,
click it, click it again, and compare the class list and aria-pressed against
what they were before. Twice is the whole test, a toggle is a thing that
returns.

Reported separately:
  * LATCHED  , state changed on the first click and did not come back.
  * EXCLUSIVE, it stayed on, but clicking it turned a SIBLING off, so it is
                one of a radio group. Individual/Organization has no valid
                "neither" state; staying on is the right behaviour and this is
                listed only so the difference is visible rather than assumed.
  * STUCK LOOK, state did come back, but the control still draws as active
                 because focus never left it. Read with the mouse parked away
                 from the control, or :hover would masquerade as this.

    python3 app.py &
    python3 check_toggles.py
"""
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:                                          # pragma: no cover
    sys.exit("playwright is not installed:  pip install playwright")

BASE = "http://127.0.0.1:5055"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

ROUTES = ["/", "/book", "/renter", "/driver", "/agent", "/trips", "/trip-planner",
          "/road-trip", "/destination-book", "/favorite-place", "/guide-studio",
          "/books", "/articles", "/archive", "/factor-clock"]

# Things that look like a toggle: they carry state in a class or aria-pressed
# rather than navigating somewhere. Anything with an href is a link and a link
# is allowed to be one-way.
FIND_JS = r"""() => {
  const out = [];
  const sel = 'button, [role=button], .chip, .gp-chip, .dchip, .fchip, .b-tag, ' +
              '.pill, .toggle, [aria-pressed], .seg, .tab, .cat, .filt';
  document.querySelectorAll(sel).forEach((el, i) => {
    if (el.closest('a[href]') || el.getAttribute('href')) return;
    if (!el.getClientRects().length) return;                 // not on screen
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.pointerEvents === 'none') return;
    // Anything that submits, navigates or opens a file is not a toggle.
    const t = (el.getAttribute('type') || '').toLowerCase();
    if (t === 'submit' || t === 'file' || t === 'reset') return;
    const txt = (el.textContent || '').trim().slice(0, 34);
    el.setAttribute('data-psx-toggle-probe', i);
    out.push({ i, txt, cls: el.className, tag: el.tagName.toLowerCase() });
  });
  return out;
}"""

SIBS_JS = """(i) => {
  const el = document.querySelector('[data-psx-toggle-probe="' + i + '"]');
  if (!el || !el.parentElement) return [];
  return Array.from(el.parentElement.children)
    .filter(x => x !== el)
    .map(x => (x.className || '').trim().split(/\s+/).sort().join(' '));
}"""

STATE_JS = """(i) => {
  const el = document.querySelector('[data-psx-toggle-probe="' + i + '"]');
  if (!el) return null;
  // Class TOKENS, sorted, not the raw string. Comparing className verbatim
  // reported the article vote buttons as latched when all that had changed was
  // a trailing space, which is a bug in the test, not in the page.
  const cls = (el.className || '').trim().split(/\s+/).filter(Boolean).sort().join(' ');
  return { cls: cls, pressed: el.getAttribute('aria-pressed'),
           focused: document.activeElement === el,
           bg: getComputedStyle(el).backgroundColor,
           fg: getComputedStyle(el).color };
}"""


def main():
    latched, stuck, exclusive = [], [], []
    checked = 0
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME)
        pg = b.new_page(viewport={"width": 1440, "height": 950})
        pg.on("dialog", lambda d: d.dismiss())

        for route in ROUTES:
            pg.goto(BASE + route, wait_until="domcontentloaded")
            pg.wait_for_timeout(1200)
            try:
                cands = pg.evaluate(FIND_JS)
            except Exception:
                continue

            for c in cands[:40]:
                loc = pg.locator('[data-psx-toggle-probe="%d"]' % c["i"])
                try:
                    if loc.count() != 1:
                        continue
                    before = pg.evaluate(STATE_JS, c["i"])
                    sibs_before = pg.evaluate(SIBS_JS, c["i"])
                    loc.click(timeout=1500, force=True)
                    pg.wait_for_timeout(230)
                    mid = pg.evaluate(STATE_JS, c["i"])
                    sibs_mid = pg.evaluate(SIBS_JS, c["i"])
                    if mid is None:                       # it navigated or re-rendered
                        pg.goto(BASE + route, wait_until="domcontentloaded")
                        pg.wait_for_timeout(900)
                        pg.evaluate(FIND_JS)
                        continue
                    loc.click(timeout=1500, force=True)
                    pg.wait_for_timeout(230)
                    # park the mouse elsewhere: otherwise :hover is still on the
                    # control and every button looks like it kept a pressed state
                    pg.mouse.move(4, 4)
                    pg.wait_for_timeout(120)
                    after = pg.evaluate(STATE_JS, c["i"])
                    if after is None:
                        continue
                except Exception:
                    continue
                checked += 1

                changed_on_first = (mid["cls"] != before["cls"]
                                    or mid["pressed"] != before["pressed"])
                came_back = (after["cls"] == before["cls"]
                             and after["pressed"] == before["pressed"])
                turned_a_sibling_off = sibs_before != sibs_mid
                if changed_on_first and not came_back and turned_a_sibling_off:
                    exclusive.append((route, c["txt"]))
                elif changed_on_first and not came_back:
                    latched.append((route, c["txt"], before["cls"], after["cls"]))
                elif came_back and after["focused"] and (
                        after["bg"] != before["bg"] or after["fg"] != before["fg"]):
                    # it untoggled in the markup but still draws as pressed
                    stuck.append((route, c["txt"], before["bg"], after["bg"]))
        b.close()

    print("\n  %d controls clicked twice.\n" % checked)
    print("  LATCHED, turned on and would not turn off")
    if latched:
        for r, t, a, z in latched:
            print("    %-18s %-34s" % (r, t))
            print("        was: %s" % (a or "(no class)"))
            print("        now: %s" % (z or "(no class)"))
    else:
        print("    none")

    print("\n  EXCLUSIVE, one of a radio group, so staying on is correct")
    if exclusive:
        for r, t in exclusive:
            print("    %-18s %s" % (r, t))
    else:
        print("    none")

    print("\n  STUCK LOOK, state returned, but it still draws as pressed")
    if stuck:
        for r, t, a, z in stuck:
            print("    %-18s %-34s %s -> %s" % (r, t, a, z))
    else:
        print("    none")

    if latched:
        sys.exit(1)


if __name__ == "__main__":
    main()
