# -*- coding: utf-8 -*-
"""What colours is the site ACTUALLY painting, and do they belong together?

"The colour still looks strange" has now been said four times. Each previous
answer was a repaint: pick better hues, reassign the arms, fix a specificity
bug. None of them asked the measurable question, which is not "is this hue
nice" but "do these colours come from one system".

Two faults make a page look wrong no matter how good the individual colours
are, and both are arithmetic rather than taste:

  * **Near-miss neutrals.** Two greys a hair apart read as a mistake, not a
    choice. A reader cannot name the difference, only feel that something is
    off. Distinct surfaces need to differ enough to look deliberate, or match
    exactly.

  * **A hue that does not belong to the family.** Warm paper with a cold
    accent is the classic one — each colour is fine alone and the pair looks
    dirty. Measurable as hue distance in OKLCH, which is perceptual, unlike
    HSL where "hue" lies about how things look.

So this samples every painted surface on every page, weights it by how much
of the screen it covers, and reports the neutrals ranked by area and the
chromatic colours ranked by count — each with its OKLCH lightness, chroma and
hue. Then it names the two faults where it finds them.

It reports; it does not pass or fail. Which greys should merge and which hue
should move is a design decision, and this exists to make that decision from
numbers instead of from a screenshot.

    python3 app.py &
    python3 check_palette.py
"""
import collections
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

# Below this chroma a colour is a neutral — it reads as paper, ink or grey
# rather than as a colour. 0.03 in OKLCH is roughly where a warm off-white
# stops looking white and starts looking beige.
NEUTRAL_C = 0.030

COLLECT_JS = r"""() => {
  // sRGB -> OKLab -> OKLCH. Perceptual, so "these two hues clash" is a
  // distance rather than an opinion. HSL would call #1b4d8f and #7b2d26
  // equally far from cream, which is not what an eye sees.
  const lin = u => { u /= 255; return u <= .04045 ? u/12.92 : Math.pow((u+.055)/1.055, 2.4); };
  function oklch(r, g, b) {
    const R = lin(r), G = lin(g), B = lin(b);
    const l = Math.cbrt(.4122214708*R + .5363325363*G + .0514459929*B);
    const m = Math.cbrt(.2119034982*R + .6806995451*G + .1073969566*B);
    const s = Math.cbrt(.0883024619*R + .2817188376*G + .6299787005*B);
    const L = .2104542553*l + .7936177850*m - .0040720468*s;
    const A = 1.9779984951*l - 2.4285922050*m + .4505937099*s;
    const Bb = .0259040371*l + .7827717662*m - .8086757660*s;
    let h = Math.atan2(Bb, A) * 180 / Math.PI; if (h < 0) h += 360;
    return { L: L, C: Math.sqrt(A*A + Bb*Bb), h: h };
  }
  const parse = css => {
    const m = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/.exec(css || '');
    if (!m) return null;
    const a = m[4] === undefined ? 1 : parseFloat(m[4]);
    if (a < .95) return null;               // translucent: it is not the surface
    return [+m[1], +m[2], +m[3]];
  };
  const hex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2,'0')).join('');

  const bg = {}, fg = {};
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < .1) continue;

    // Backgrounds weighted by area: a 4px rule and the page itself are not
    // equally responsible for how the page reads.
    const b = parse(cs.backgroundColor);
    if (b) {
      const k = hex(b);
      (bg[k] = bg[k] || { area: 0, n: 0 }).area += r.width * r.height;
      bg[k].n++;
    }
    // Text colours counted per element that actually holds text.
    let hasText = false;
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && n.nodeValue.trim()) { hasText = true; break; }
    }
    if (hasText) {
      const f = parse(cs.color);
      if (f) { const k = hex(f); (fg[k] = fg[k] || { area: 0, n: 0 }).n++; }
    }
  }
  const out = { bg: [], fg: [] };
  for (const [k, v] of Object.entries(bg)) {
    const c = oklch(parseInt(k.slice(1,3),16), parseInt(k.slice(3,5),16), parseInt(k.slice(5,7),16));
    out.bg.push({ hex: k, area: Math.round(v.area), n: v.n, L: c.L, C: c.C, h: c.h });
  }
  for (const [k, v] of Object.entries(fg)) {
    const c = oklch(parseInt(k.slice(1,3),16), parseInt(k.slice(3,5),16), parseInt(k.slice(5,7),16));
    out.fg.push({ hex: k, n: v.n, L: c.L, C: c.C, h: c.h });
  }
  return out;
}"""


def main():
    bg = collections.defaultdict(lambda: {"area": 0, "n": 0, "L": 0, "C": 0, "h": 0})
    fg = collections.defaultdict(lambda: {"n": 0, "L": 0, "C": 0, "h": 0})

    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME)
        pg = b.new_page(viewport={"width": 1440, "height": 900})

        def take():
            d = pg.evaluate(COLLECT_JS)
            for e in d["bg"]:
                r = bg[e["hex"]]
                r["area"] += e["area"]; r["n"] += e["n"]
                r["L"], r["C"], r["h"] = e["L"], e["C"], e["h"]
            for e in d["fg"]:
                r = fg[e["hex"]]
                r["n"] += e["n"]
                r["L"], r["C"], r["h"] = e["L"], e["C"], e["h"]

        for route in ROUTES:
            pg.goto(BASE + route, wait_until="domcontentloaded")
            pg.wait_for_timeout(1100)
            take()
            if route == "/":
                for v in VIEWS:
                    pg.evaluate("showView('%s')" % v)
                    pg.wait_for_timeout(450)
                    take()
        b.close()

    total = sum(r["area"] for r in bg.values()) or 1
    neutrals = sorted([(k, v) for k, v in bg.items() if v["C"] < NEUTRAL_C],
                      key=lambda kv: -kv[1]["area"])
    chromatic = sorted([(k, v) for k, v in bg.items() if v["C"] >= NEUTRAL_C],
                       key=lambda kv: -kv[1]["area"])

    print("\n  SURFACES — neutral (what the site is mostly made of)")
    print("  %-9s %6s  %5s  %6s  %6s  %s" % ("hex", "share", "L", "C", "hue", "uses"))
    for k, v in neutrals[:14]:
        print("  %-9s %5.1f%%  %.3f  %.4f  %5.1f  %d"
              % (k, 100.0 * v["area"] / total, v["L"], v["C"], v["h"], v["n"]))

    print("\n  SURFACES — chromatic (blocks of actual colour)")
    print("  %-9s %6s  %5s  %6s  %6s  %s" % ("hex", "share", "L", "C", "hue", "uses"))
    for k, v in chromatic[:12]:
        print("  %-9s %5.1f%%  %.3f  %.4f  %5.1f  %d"
              % (k, 100.0 * v["area"] / total, v["L"], v["C"], v["h"], v["n"]))

    print("\n  TEXT")
    print("  %-9s %6s  %5s  %6s  %6s" % ("hex", "uses", "L", "C", "hue"))
    for k, v in sorted(fg.items(), key=lambda kv: -kv[1]["n"])[:14]:
        print("  %-9s %6d  %.3f  %.4f  %5.1f" % (k, v["n"], v["L"], v["C"], v["h"]))

    # ---- fault 1: neutrals too close to tell apart, too far to match --------
    print("\n  NEAR-MISS NEUTRALS")
    print("  Two surfaces a hair apart read as a mistake. Under ~0.02 in L is")
    print("  below what a reader can name but above what they can ignore.")
    big = [(k, v) for k, v in neutrals if v["area"] / total > 0.004]
    found = False
    for i in range(len(big)):
        for j in range(i + 1, len(big)):
            a, c = big[i][1], big[j][1]
            dL = abs(a["L"] - c["L"])
            if 0 < dL < 0.02:
                found = True
                print("    %s vs %s   dL=%.3f  dC=%.4f"
                      % (big[i][0], big[j][0], dL, abs(a["C"] - c["C"])))
    if not found:
        print("    none — every distinct surface differs enough to look chosen")

    # ---- fault 2: an accent that does not belong to the paper --------------
    print("\n  DO THE ACCENTS BELONG TO THE PAPER?")
    print("  Hue distance in OKLCH between the dominant paper and each colour")
    print("  the site paints with. Warm paper under a cold accent is the")
    print("  single most common reason a palette 'looks off' while every")
    print("  colour in it is defensible on its own.")
    if neutrals:
        paper = neutrals[0][1]
        print("    paper %s  L=%.3f C=%.4f hue=%.1f" % (neutrals[0][0], paper["L"], paper["C"], paper["h"]))
        seen = set()
        for k, v in sorted(fg.items(), key=lambda kv: -kv[1]["n"]):
            if v["C"] < NEUTRAL_C or k in seen:
                continue
            seen.add(k)
            d = abs(v["h"] - paper["h"])
            if d > 180:
                d = 360 - d
            print("    %-9s hue=%5.1f  %3.0f deg from the paper   (%d uses)"
                  % (k, v["h"], d, v["n"]))


if __name__ == "__main__":
    main()
