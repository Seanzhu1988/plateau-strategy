# -*- coding: utf-8 -*-
"""What a cold visit actually costs, over the wire.

The first version of this measured response.body(), which Playwright hands
back already decompressed — so it reported the same figure before and after
gzip was switched on and made a working fix look like no fix. transferSize
from the Resource Timing API is the number that leaves the server.
"""
import sys
from playwright.sync_api import sync_playwright
B = "http://127.0.0.1:5055"
ROUTES = ["/", "/book", "/trip-planner", "/destination-book", "/road-trip"]
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    wire = decoded = 0
    for r in ROUTES:
        ctx = b.new_context()                     # cold cache every time
        pg = ctx.new_page()
        pg.goto(B + r, wait_until="load")
        pg.wait_for_timeout(700)
        m = pg.evaluate("""() => {
            const rs = performance.getEntriesByType('resource');
            const nav = performance.getEntriesByType('navigation')[0] || {};
            const sum = (a, k) => a.reduce((s, x) => s + (x[k] || 0), 0);
            return {
              n: rs.length + 1,
              wire: sum(rs, 'transferSize') + (nav.transferSize || 0),
              decoded: sum(rs, 'decodedBodySize') + (nav.decodedBodySize || 0),
              fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0]||{}).startTime||0),
              load: Math.round(nav.loadEventEnd || 0),
            };
        }""")
        wire += m["wire"]; decoded += m["decoded"]
        print(f"  {r:20} {m['n']:>2} req · wire {m['wire']/1024:6.0f} KB "
              f"(from {m['decoded']/1024:6.0f} KB) · FCP {m['fcp']:>4}ms · load {m['load']:>4}ms")
        ctx.close()
    b.close()
saved = 100 - (wire * 100 // decoded) if decoded else 0
print(f"\n  five cold loads: {wire/1024:.0f} KB over the wire, from {decoded/1024:.0f} KB of content — {saved}% saved")
