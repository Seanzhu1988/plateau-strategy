# -*- coding: utf-8 -*-
"""The "who counts as a visitor" panel in Dispatch, end to end in a browser.

The panel exists because /api/traffic/networks was built and never given an
interface, the only way to register a network was curl. It matters most for
the numbers that are smallest: a handful of our own visits is invisible in a
thousand and decisive in twenty.

Three things are checked that a screenshot would not show:

  * the page's script still PARSES. The panel nearly shipped with a second
    `function esc()` beside the `const esc` already at the top of the file,
    which is a SyntaxError that kills every handler on the page, assign, mark
    paid, log out, not just the new ones.
  * registering a network never sends an address. The server takes it from the
    request, so a signed-in session cannot erase traffic from somewhere it has
    never been.
  * the network address is rendered as text. It comes from X-Forwarded-For,
    which the caller controls.

    python3 test_dispatch_optout.py        # needs the dev server on :5055
"""
import json
import os
import sys

from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5055"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
USER = (os.environ.get("OWNER_TEST_USER") or "").strip()
PASS = (os.environ.get("OWNER_TEST_PASS") or "").strip()

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


def me(counted=True, today=False, net=False, ip="203.0.113.7"):
    return {"ok": True, "device_counted": counted, "in_today_count": today,
            "network": ip, "network_registered": net}


with sync_playwright() as p:
    br = p.chromium.launch(executable_path=CHROME)

    # ---- the whole script must still parse -------------------------------
    pg = br.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(BASE + "/dispatch", wait_until="networkidle")
    chk("the page raises nothing (%s)" % (errs or "clean"), not errs)
    syntax = [e for e in errs if "already been declared" in e or "SyntaxError" in e]
    chk("no redeclaration of esc (%s)" % (syntax or "clean"), not syntax)
    chk("existing handlers are still defined",
        pg.evaluate("typeof showToast === 'function' && typeof doAuth === 'function'"))
    chk("and so are the new ones",
        pg.evaluate("typeof loadTrafficMe === 'function'"
                    " && typeof toggleNetwork === 'function'"))
    pg.close()

    # ---- the panel renders -----------------------------------------------
    def panel(state, sign_in=True):
        pg = br.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        posted = {}

        pg.route("**/api/traffic/me", lambda r: r.fulfill(
            status=200, content_type="application/json", body=json.dumps(state)))

        def net(route, request):
            posted["body"] = request.post_data or ""
            route.fulfill(status=200, content_type="application/json",
                          body='{"ok":true,"here":"203.0.113.7",'
                               '"here_registered":true,"networks":[]}')
        pg.route("**/api/traffic/networks", net)

        pg.goto(BASE + "/dispatch", wait_until="networkidle")
        if sign_in:
            # Exactly what doAuth() does after /api/owner/login returns ok:
            # drop the overlay, then start the app. Without the first half the
            # overlay still covers the page and swallows every click, which
            # is the correct behaviour, and worth having proved: the panel is
            # unreachable until somebody signs in.
            pg.evaluate("document.getElementById('authOverlay')"
                        ".classList.add('hidden'); startApp();")
        pg.wait_for_timeout(500)
        return pg, errs, posted

    print("\nthe panel says what is true right now:")
    pg, errs, _ = panel(me(counted=True))
    txt = pg.text_content("#trafficMe") or ""
    chk("it reports a counted browser", "IS being counted" in txt)
    chk("and offers to stop it", "Stop counting this browser" in txt)
    chk("the network row is there", "not registered" in txt)
    chk("the address is shown", "203.0.113.7" in txt)
    chk("no page errors (%s)" % (errs or "clean"), not errs)
    chk("the shareable link is the public opt-out page",
        (pg.input_value("#optoutLink") or "").endswith("/not-a-traveler"))
    pg.close()

    print("\nan opted-out browser reads differently:")
    pg, _, _ = panel(me(counted=False))
    txt = pg.text_content("#trafficMe") or ""
    chk("it says so", "is not counted" in txt)
    chk("and offers to undo it", "Count it again" in txt)
    chk("the today row is absent when it is not in today's number",
        "Remove from today" not in txt)
    pg.close()

    print("\nand a visit already counted today can be taken back:")
    pg, _, _ = panel(me(counted=True, today=True))
    chk("the row appears", "Remove from today" in (pg.text_content("#trafficMe") or ""))
    pg.close()

    print("\nregistering a network never names an address:")
    pg, errs, posted = panel(me(net=False))
    pg.get_by_role("button", name="Register this network").click()
    pg.wait_for_timeout(400)
    body = json.loads(posted.get("body") or "{}")
    chk("the request carries no ip (%s)" % sorted(body), "ip" not in body)
    chk("only a label", body.get("label") == "dispatch")
    chk("no page errors (%s)" % (errs or "clean"), not errs)
    pg.close()

    print("\nremoving one does name it, that is how an old office is dropped:")
    pg, _, posted = panel(me(net=True))
    pg.get_by_role("button", name="Stop ignoring this network").click()
    pg.wait_for_timeout(400)
    body = json.loads(posted.get("body") or "{}")
    chk("remove is set", body.get("remove") is True)
    chk("and the address is the one shown", body.get("ip") == "203.0.113.7")
    pg.close()

    print("\nthe address is rendered as text, not markup:")
    evil = '"><img src=x onerror=alert(1)>'
    pg, errs, _ = panel(me(ip=evil))
    chk("it appears verbatim in the text", evil in (pg.text_content("#trafficMe") or ""))
    chk("no element was injected", pg.query_selector("#trafficMe img") is None)
    chk("and nothing raised (%s)" % (errs or "clean"), not errs)
    pg.close()

    print("\na failed read leaves a sentence, not a blank box:")
    pg = br.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.route("**/api/traffic/me", lambda r: r.fulfill(
        status=500, content_type="text/html", body="<h1>nope</h1>"))
    pg.goto(BASE + "/dispatch", wait_until="networkidle")
    pg.evaluate("document.getElementById('authOverlay').classList.add('hidden');"
                " startApp();")
    pg.wait_for_timeout(500)
    chk("it says it could not read the state",
        "Could not read" in (pg.text_content("#trafficMe") or ""))
    chk("and raises nothing (%s)" % (errs or "clean"), not errs)
    pg.close()

    br.close()

print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
sys.exit(1 if fails else 0)
