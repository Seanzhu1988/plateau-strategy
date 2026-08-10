# -*- coding: utf-8 -*-
"""The walking guide's geometry, walked down a fake street in a real browser.

The idea: while you walk, it says what is on your left and what is on your
right. The hard part is not the speech and not finding the places — it is
knowing which way you FACE, and knowing when the fix is too poor to say
"left" at all.

A phone in a city street is routinely 20–40 m out. If the fix is 30 m out and
the shop is 15 m away, "on your left" is a coin toss, and a guide that says
left when it means right is worse than a silent one. So the assertions below
care as much about the refusals as the announcements.

Run against the dev server on :5055 — the geometry is exercised in the browser
that would actually run it, with positions fed in rather than walked.

    python3 test_walk_guide.py
"""
import sys

from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:5055"
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


with sync_playwright() as p:
    br = p.chromium.launch(executable_path=CHROME)
    pg = br.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    # Overpass must not be called for a geometry test.
    pg.route("**/overpass-api.de/**", lambda r: r.fulfill(
        status=200, content_type="application/json", body='{"elements":[]}'))
    pg.goto(BASE + "/walk", wait_until="networkidle")
    chk("the page loads with no errors (%s)" % (errs or "clean"), not errs)
    chk("the guide module is present", pg.evaluate("typeof WalkGuide === 'object'"))

    print("\ndistance and bearing are real geometry:")
    # One degree of latitude is ~111.2 km; Seattle to Portland is ~234 km.
    d = pg.evaluate("WalkGuide.distanceM({lat:47.6062,lon:-122.3321},"
                    "{lat:45.5152,lon:-122.6784})")
    chk("Seattle to Portland is about 234 km (%.1f km)" % (d / 1000),
        230000 < d < 240000)
    b = pg.evaluate("WalkGuide.bearingTo({lat:47.0,lon:-122.0},{lat:48.0,lon:-122.0})")
    chk("due north is 0° (%.1f)" % b, b < 0.5 or b > 359.5)
    b = pg.evaluate("WalkGuide.bearingTo({lat:47.0,lon:-122.0},{lat:47.0,lon:-121.0})")
    chk("due east is 90° (%.1f)" % b, 89 < b < 91)

    print("\nleft is left, walking north:")
    for heading, bearing, want in [(0, 270, 'left'), (0, 90, 'right'),
                                   (0, 5, 'ahead'), (0, 180, 'behind'),
                                   (90, 0, 'left'), (90, 180, 'right'),
                                   (350, 20, 'right'), (10, 340, 'left')]:
        got = pg.evaluate("WalkGuide.relativeSide(%d,%d).side" % (heading, bearing))
        chk("facing %3d°, a place at %3d° is %-6s (%s)" % (heading, bearing, want, got),
            got == want)

    print("\nheading comes from where you have walked, not from one step:")
    h = pg.evaluate("WalkGuide.headingFromTrail([{lat:47.6000,lon:-122.3300}])")
    chk("one fix gives no heading", h is None)
    # ~2 m apart: a shuffle, not a direction.
    h = pg.evaluate("WalkGuide.headingFromTrail("
                    "[{lat:47.60000,lon:-122.33000},{lat:47.60002,lon:-122.33000}])")
    chk("two fixes a couple of metres apart still give none", h is None)
    # ~33 m north
    h = pg.evaluate("WalkGuide.headingFromTrail("
                    "[{lat:47.60000,lon:-122.33000},{lat:47.60030,lon:-122.33000}])")
    chk("walking 30 m north reads as north (%s)" % h, h is not None and (h < 1 or h > 359))

    print("\na rough fix buys silence, not a guess:")
    chk("±5 m is fine for a place 50 m away",
        pg.evaluate("WalkGuide.fixIsGoodEnough(5,50)") is True)
    chk("±30 m is NOT enough for a place 15 m away",
        pg.evaluate("WalkGuide.fixIsGoodEnough(30,15)") is False)
    chk("±30 m is fine for a cathedral 200 m ahead",
        pg.evaluate("WalkGuide.fixIsGoodEnough(30,200)") is True)
    chk("±80 m is never enough — that is a lost phone",
        pg.evaluate("WalkGuide.fixIsGoodEnough(80,400)") is False)

    print("\nthe decision to speak, with every reason not to:")
    SETUP = """
      var here = {lat:47.60000, lon:-122.33000};
      var st = function (o) {
        var s = {said:{}, lastSpokeAt:0, heading:0, pos:here, accuracy:5,
                 now:1000000};
        for (var k in o) s[k] = o[k];
        return s;
      };
      var LEFT  = {id:'a', name:'Left Place',  lat:47.60030, lon:-122.33040};
      var RIGHT = {id:'b', name:'Right Place', lat:47.60030, lon:-122.32960};
      var BACK  = {id:'c', name:'Behind You',  lat:47.59960, lon:-122.33000};
      var FAR   = {id:'d', name:'Miles Away',  lat:47.62000, lon:-122.33000};
    """
    pg.evaluate(SETUP)

    def dec(place, over=""):
        return pg.evaluate("(function(){%s return WalkGuide.shouldAnnounce(%s, st(%s));})()"
                           % (SETUP, place, over or "{}"))

    d1 = dec("LEFT")
    chk("a place off to the left is announced as left (%s)" % d1.get("side"),
        d1.get("ok") and d1.get("side") == "left")
    d2 = dec("RIGHT")
    chk("and one to the right as right (%s)" % d2.get("side"),
        d2.get("ok") and d2.get("side") == "right")
    chk("something behind you is not announced (%s)" % dec("BACK").get("why"),
        dec("BACK").get("ok") is False)
    chk("something 2 km away is not announced (%s)" % dec("FAR").get("why"),
        dec("FAR").get("ok") is False)
    chk("nothing is said twice (%s)" % dec("LEFT", "{said:{a:true}}").get("why"),
        dec("LEFT", "{said:{a:true}}").get("ok") is False)
    chk("nor within 20 s of the last one (%s)"
        % dec("LEFT", "{lastSpokeAt:995000}").get("why"),
        dec("LEFT", "{lastSpokeAt:995000}").get("ok") is False)
    chk("nor while standing still, with no heading (%s)"
        % dec("LEFT", "{heading:null}").get("why"),
        dec("LEFT", "{heading:null}").get("ok") is False)
    rough = dec("LEFT", "{accuracy:45}")
    chk("nor on a rough fix — the refusal that matters most (%s)" % rough.get("why"),
        rough.get("ok") is False and "fix" in rough.get("why", ""))

    print("\nthe sentence is written to be heard, not read:")
    s = pg.evaluate("(function(){%s var d = WalkGuide.shouldAnnounce(LEFT, st());"
                    " return WalkGuide.phrase(LEFT, d, {});})()" % SETUP)
    chk("it names the place first (%s)" % s, s.startswith("Left Place"))
    chk("and says which side", "on your left" in s)
    chk("with a rounded distance, not 37 metres",
        not any(ch.isdigit() for ch in s.split("metres")[0].split("about")[-1].strip()[:-1])
        or s.split("about ")[-1].split(" metres")[0][-1] == "0" or "just here" in s)
    long_visit = pg.evaluate(
        "(function(){%s var P = {id:'e',name:'Big Museum',lat:47.60030,lon:-122.33040,"
        "typical_visit:180}; var d = WalkGuide.shouldAnnounce(P, st());"
        " return WalkGuide.phrase(P, d, {minutesLeft: 40});})()" % SETUP)
    chk("it says when there is not time (%s)" % long_visit[-46:],
        "more than you have left" in long_visit)
    fits = pg.evaluate(
        "(function(){%s var P = {id:'f',name:'Small Gallery',lat:47.60030,lon:-122.33040,"
        "typical_visit:25}; var d = WalkGuide.shouldAnnounce(P, st());"
        " return WalkGuide.phrase(P, d, {minutesLeft: 90});})()" % SETUP)
    chk("and when there is (%s)" % fits[-30:], "you have time" in fits)
    silent = pg.evaluate(
        "(function(){%s var P = {id:'g',name:'Unknown Stay',lat:47.60030,lon:-122.33040};"
        " var d = WalkGuide.shouldAnnounce(P, st());"
        " return WalkGuide.phrase(P, d, {minutesLeft: 90});})()" % SETUP)
    chk("with no opinion when the stay time is unknown",
        "time" not in silent.lower())

    print("\nand walking the street end to end announces in the right order:")
    walked = pg.evaluate("""(function () {
      %s
      var said = [], state = {said:{}, lastSpokeAt:0};
      var trail = [], t = 0;
      // 30 fixes heading north, one every 3 m, past both places.
      for (var i = 0; i < 30; i++) {
        var pos = {lat: 47.59960 + i * 0.000027, lon: -122.33000};
        trail.push(pos);
        t += 25000;                       // 25 s apart, clear of the gap rule
        var h = WalkGuide.headingFromTrail(trail);
        [LEFT, RIGHT].forEach(function (pl) {
          var d = WalkGuide.shouldAnnounce(pl, {said: state.said,
            lastSpokeAt: state.lastSpokeAt, heading: h, pos: pos,
            accuracy: 5, now: t});
          if (d.ok) { state.said[pl.id] = true; state.lastSpokeAt = t;
                      said.push(pl.name + ':' + d.side); }
        });
      }
      return said;
    })()""" % SETUP)
    chk("both places were called (%s)" % walked, len(walked) == 2)
    chk("the left one as left", any(x == "Left Place:left" for x in walked))
    chk("the right one as right", any(x == "Right Place:right" for x in walked))
    chk("and neither was repeated", len(set(walked)) == len(walked))

    chk("no page errors across the whole run (%s)" % (errs or "clean"), not errs)
    pg.close()
    br.close()

print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
sys.exit(1 if fails else 0)
