# -*- coding: utf-8 -*-
"""Does the same kind of thing look the same on every page?

Contrast and palette checks already prove every colour is legible and comes
from the token set. Neither says whether a button on one page looks like a
button on another, which is what "inconsistent painting" means.
"""
import collections, sys
from playwright.sync_api import sync_playwright
B = "http://127.0.0.1:5055"
ROUTES = ["/", "/book", "/renter", "/driver", "/agent", "/partners", "/dispatch",
          "/trips", "/trip-planner", "/road-trip", "/destination-book",
          "/favorite-place", "/guide-studio", "/books", "/articles", "/archive",
          "/board", "/factor-clock", "/setup"]
JS = """() => {
  const vis = e => { const r = e.getBoundingClientRect();
                     return r.width > 8 && r.height > 8 && getComputedStyle(e).visibility !== 'hidden'; };
  const bg = e => getComputedStyle(e).backgroundColor;
  const out = { accent: getComputedStyle(document.body).getPropertyValue('--psx-accent').trim(),
                arm: (document.querySelector('[data-arm]')||{}).dataset?.arm || null,
                buttons: {}, links: {}, headings: {} };
  document.querySelectorAll('button, .btn, a.btn, input[type=submit]').forEach(e => {
    if (!vis(e)) return;
    if (e.closest('.i18n-wrap') || e.id === 'i18nBtn' || e.classList.contains('gp-chip')) return;
    const c = bg(e);
    if (c === 'rgba(0, 0, 0, 0)') return;             // ghost buttons are their own thing
    out.buttons[c] = (out.buttons[c] || 0) + 1;
  });
  document.querySelectorAll('a:not(.btn)').forEach(e => {
    if (!vis(e) || e.closest('header, footer, nav, .i18n-wrap')) return;
    if (getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)') return;   // link-shaped buttons
    const c = getComputedStyle(e).color;
    out.links[c] = (out.links[c] || 0) + 1;
  });
  document.querySelectorAll('h1,h2,h3').forEach(e => {
    if (!vis(e)) return;
    if (e.closest('#view-realestate')) return;        // the drawing sheet keeps its own ink
    out.headings[getComputedStyle(e).color] = (out.headings[getComputedStyle(e).color] || 0) + 1;
  });
  return out;
}"""
rows = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    for r in ROUTES:
        pg.goto(B + r, wait_until="domcontentloaded"); pg.wait_for_timeout(500)
        d = pg.evaluate(JS)
        rows.append((r, d))
    b.close()

def top(d):
    return sorted(d.items(), key=lambda kv: -kv[1])

print("  route                arm         button fills                       link colour")
for r, d in rows:
    bt = ", ".join(f"{c.replace('rgb','').replace(' ','')}x{n}" for c, n in top(d["buttons"])[:3]) or "—"
    lk = ", ".join(f"{c.replace('rgb','').replace(' ','')}x{n}" for c, n in top(d["links"])[:2]) or "—"
    print(f"  {r:20} {str(d['arm']):11} {bt:34} {lk}")

# heading colour must be one ink everywhere
heads = collections.Counter()
for _, d in rows:
    for c, n in d["headings"].items(): heads[c] += n
print(f"\n  heading colours across the site: {dict(heads)}")
