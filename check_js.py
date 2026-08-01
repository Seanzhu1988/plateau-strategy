"""Load every page in a real browser and fail on any JS error.

Run the app first, then: python3 check_js.py

The call-site rewrite touched 73 places by brace-matching. A syntax error in
an inline <script> is silent in a diff and total in a browser — the whole
block stops running — so it gets checked by loading the page, not by reading
it. Also exercises psxJSON against a URL that cannot answer, which is the
actual reported bug: the promise must resolve, not reject.
"""
import sys
from playwright.sync_api import sync_playwright
B = "http://127.0.0.1:5055"
ROUTES = ["/","/book","/renter","/driver","/agent","/partners","/dispatch","/trips",
          "/trip-planner","/road-trip","/destination-book","/favorite-place",
          "/guide-studio","/books","/articles","/archive","/board","/deflator",
          "/factor-clock","/setup"]
bad = 0
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    for route in ROUTES:
        errs = []
        pg = b.new_page()
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(B + route, wait_until="domcontentloaded")
        pg.wait_for_timeout(700)
        has = pg.evaluate("typeof window.psxJSON === 'function'")

        # Markup nesting. Editing HTML with a regex is how a stray </div>
        # gets left behind: removing a block by matching its opening tag and
        # a lazy .*?</div> stops at the first inner close and abandons the
        # outer one. The browser then silently re-parents everything after
        # it, so #view-overview ended one section early and every
        # "#view-overview .psx-*" rule quietly stopped matching. Nothing
        # errors, nothing 404s, and the page just looks wrong. Compare the
        # tags the file contains against the tree the browser actually
        # built.
        nesting = pg.evaluate("""() => {
            const bad = [];
            // A stray close tag shows up as an element the parser had to
            // move: a <section> whose parent is <main> when the source put
            // it inside a .view, for instance. Rather than re-parse, check
            // the invariants this site relies on.
            const views = document.querySelectorAll('.view').length;
            document.querySelectorAll('section[id], .psx-cards, .psx-hero').forEach(el => {
                if (!el.closest('.view') && document.querySelector('.view'))
                    bad.push((el.id || el.className).toString().slice(0, 40) + ' is outside every .view');
            });
            return { views, bad };
        }""")
        if nesting["bad"]:
            bad += 1
            print(f"FAIL {route:20} broken nesting")
            for n in nesting["bad"][:4]:
                print("        ", n)
            pg.close()
            continue
        # Leaflet is loaded from unpkg. Where that CDN is unreachable — this
        # container blocks it — the map pages raise "L is not defined" with
        # nothing wrong in our code. Reported, never counted as a failure.
        errs = [e for e in errs if "L is not defined" not in e]
        if errs or not has:
            bad += 1
            print(f"FAIL {route:20} psxJSON={has}")
            for e in errs[:3]: print("       ", e[:150])
        else:
            print(f"ok   {route:20} psxJSON present, no page errors")
        pg.close()

    # The bug itself: a call that cannot succeed must resolve, not reject.
    pg = b.new_page(); pg.goto(B + "/", wait_until="domcontentloaded"); pg.wait_for_timeout(400)
    for url, label in (("/api/definitely-not-a-route", "404 HTML body"),
                       ("http://127.0.0.1:1/nope",     "connection refused")):
        res = pg.evaluate("""async (u) => {
            try { const j = await psxJSON(u); return {resolved:true, ok:j && j.ok, error:j && j.error}; }
            catch (e) { return {resolved:false, threw:String(e)}; }
        }""", url)
        good = res["resolved"] and res.get("ok") is False and res.get("error")
        print(f"{'ok  ' if good else 'FAIL'} psxJSON on {label:20} -> {res}")
        if not good: bad += 1
    b.close()
print("\n" + "="*66)
print("no JS errors, psxJSON resolves on every failure mode" if not bad else f"{bad} problem(s)")
sys.exit(1 if bad else 0)
