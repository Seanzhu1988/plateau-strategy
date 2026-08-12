# -*- coding: utf-8 -*-
"""Every page's tab icon resolves.

The icon hrefs were relative, href="plateau-logo.svg" with no leading
slash, so on /trip-planner the browser asked for
/trip-planner/plateau-logo.svg, got a 404, and showed an empty dark tab.
Every page on the site except the home page.

Checked by resolving the href the way a browser does rather than by reading
the attribute, because the attribute looked fine the whole time.
"""
import sys, urllib.request
from playwright.sync_api import sync_playwright
B = "http://127.0.0.1:5055"
ROUTES = ["/", "/book", "/renter", "/driver", "/agent", "/partners", "/dispatch",
          "/trips", "/trip-planner", "/road-trip", "/destination-book",
          "/favorite-place", "/guide-studio", "/books", "/articles", "/archive",
          "/board", "/factor-clock", "/setup"]
bad = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = b.new_page()
    for r in ROUTES:
        pg.goto(B + r, wait_until="domcontentloaded")
        icons = pg.evaluate("""() => [...document.querySelectorAll('link[rel~="icon"],link[rel="apple-touch-icon"]')]
                                   .map(l => l.href)""")
        if not icons:
            bad.append(f"{r}: no icon link at all"); continue
        for href in icons:
            try:
                code = urllib.request.urlopen(href, timeout=5).status
            except Exception as e:
                code = getattr(e, "code", "ERR")
            if code != 200:
                bad.append(f"{r}: {href} -> {code}")
        print(f"  ok   {r:20} {len(icons)} icon(s), all 200")
    b.close()

try:
    fav = urllib.request.urlopen(B + "/favicon.ico", timeout=5).status
except Exception as e:
    fav = getattr(e, "code", "ERR")
print(f"  {'ok  ' if fav == 200 else 'FAIL'} /favicon.ico -> {fav}   (browsers ask for this unprompted)")
if fav != 200:
    bad.append("/favicon.ico is not served")

print("\n" + "=" * 60)
if bad:
    for x in bad: print("FAIL " + x)
    sys.exit(1)
print("every page's tab icon resolves")
