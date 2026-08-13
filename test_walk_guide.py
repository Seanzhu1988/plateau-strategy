# -*- coding: utf-8 -*-
"""The walking guide's geometry, walked down a fake street in a real browser.

The idea: while you walk, it says what is on your left and what is on your
right. The hard part is not the speech and not finding the places, it is
knowing which way you FACE, and knowing when the fix is too poor to say
"left" at all.

A phone in a city street is routinely 20, 40 m out. If the fix is 30 m out and
the shop is 15 m away, "on your left" is a coin toss, and a guide that says
left when it means right is worse than a silent one. So the assertions below
care as much about the refusals as the announcements.

Run against the dev server on :5055, the geometry is exercised in the browser
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
    chk("±80 m is never enough, that is a lost phone",
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
    chk("nor on a rough fix, the refusal that matters most (%s)" % rough.get("why"),
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

    print("\nfollowing a footprint, how far off the recorded line am I?")
    # A straight north line at -122.33. At 47.6°N a degree of longitude is
    # ~75.0 km (111.32 cos 47.6), so 0.0004° east is ~30 m off the line.
    PATH = "[[47.6000,-122.33],[47.6002,-122.33],[47.6004,-122.33]]"
    d = pg.evaluate("WalkGuide.nearestOnPathM({lat:47.6001,lon:-122.33}, %s)" % PATH)
    chk("standing on the line reads ~0 m (%.1f)" % d, d < 1)
    d = pg.evaluate("WalkGuide.nearestOnPathM({lat:47.6001,lon:-122.3296}, %s)" % PATH)
    chk("30 m east of it reads ~30 m (%.1f)" % d, 27 < d < 33)
    # 30 m beyond the north end: nearest point must clamp to the endpoint,
    # not project onto the segment's infinite extension.
    d = pg.evaluate("WalkGuide.nearestOnPathM({lat:47.60067,lon:-122.33}, %s)" % PATH)
    chk("beyond the end clamps to the endpoint (%.1f)" % d, 27 < d < 33)
    chk("stored-shape [lat,lon] pairs and {lat,lon} objects both work",
        abs(pg.evaluate("WalkGuide.nearestOnPathM({lat:47.6001,lon:-122.3296},"
                        "[{lat:47.6000,lon:-122.33},{lat:47.6004,lon:-122.33}])") - 30) < 3)
    chk("an empty path is infinitely far, not zero",
        pg.evaluate("WalkGuide.nearestOnPathM({lat:0,lon:0}, []) === Infinity"))

    print("\nand 'you have left the path' is only said when it is provable:")
    chk("40 m off with a ±5 m fix is astray",
        pg.evaluate("WalkGuide.offPath(5, 40)") is True)
    chk("40 m off with a ±35 m fix is NOT provable, the fix could be lying",
        pg.evaluate("WalkGuide.offPath(35, 40)") is False)
    chk("24 m off is within the floor even with a perfect fix",
        pg.evaluate("WalkGuide.offPath(0, 24)") is False)
    chk("26 m off with a perfect fix is astray",
        pg.evaluate("WalkGuide.offPath(0, 26)") is True)

    print("\nfootprints appear only when you face the right way, Sean's rule:")
    # A recorded path running due north; the walker stands on it.
    TRAIL = ("[[47.6000,-122.33],[47.6001,-122.33],[47.6002,-122.33],"
             "[47.6003,-122.33],[47.6004,-122.33],[47.6005,-122.33]]")
    ARGS = "({lat:47.6001,lon:-122.33}, %s, " + TRAIL + ", {accuracy:5})"

    t = pg.evaluate("WalkGuide.trailAhead" + ARGS % "0")
    chk("facing along the path, the footprints show (%s)" % t.get("why", "ok"),
        t.get("show") is True and t.get("dir") == 1)
    chk("and they lead FORWARD, the next points north",
        t["trail"][0]["lat"] > 47.6001)
    t = pg.evaluate("WalkGuide.trailAhead" + ARGS % "180")
    chk("facing back down it also shows, a corridor works both ways (dir %s)"
        % t.get("dir"), t.get("show") is True and t.get("dir") == -1)
    chk("and those footprints lead south", t["trail"][0]["lat"] < 47.6001)
    t = pg.evaluate("WalkGuide.trailAhead" + ARGS % "90")
    chk("facing across it shows NOTHING, the emptiness is the message (%s)"
        % t.get("why"), t.get("show") is False and "facing" in t.get("why", ""))
    t = pg.evaluate("WalkGuide.trailAhead" + ARGS % "null")
    chk("standing still shows nothing, no heading, no guess", t.get("show") is False)
    t = pg.evaluate("WalkGuide.trailAhead({lat:47.6001,lon:-122.325}, 0, "
                    + TRAIL + ", {accuracy:5})")
    chk("380 m off the path shows nothing (%s)" % t.get("why"),
        t.get("show") is False and t.get("why") == "off the path")
    t = pg.evaluate("WalkGuide.trailAhead({lat:47.6001,lon:-122.33}, 0, [], {})")
    chk("no recorded path, no footprints", t.get("show") is False)

    print("\nindoor announcements: a described point spoken as you reach it,")
    print("only while facing along the corridor:")
    # A north line, 8 points at 8 m, with a note at index 4 on the right.
    CORR = ("{key:'c', points:["
            + ",".join("[%.6f,-122.33]" % (47.6000 + i * 8 / 111320.0) for i in range(8))
            + "], notes:[{at:4, text:'The ticket machines', side:'right'}]}")

    def announce(idx, heading, over=""):
        pos = "{lat:%.6f, lon:-122.33}" % (47.6000 + idx * 8 / 111320.0)
        st = "{said:{}, lastSpokeAt:0, accuracy:5, now:1000000%s}" % (", " + over if over else "")
        return pg.evaluate("(function(){var r=WalkGuide.corridorAnnounce(%s,%d,%s,%s);"
                           "return r?r.text:null;})()" % (pos, heading, CORR, st))

    a = announce(4, 0)                       # standing at the note, facing north (along)
    chk("reaching the point facing forward speaks it (%s)" % a,
        a and "ticket machines" in a and "on your right" in a)
    a = announce(3, 0)                       # one step before, still within reach
    chk("it speaks just before you get there too", a and "on your right" in a)
    chk("facing across the corridor says nothing (the gate holds)",
        announce(4, 90) is None)
    chk("standing before the note but facing back down the line says nothing",
        announce(2, 180) is None)
    a = announce(6, 180)                      # walking the corridor backwards toward the note
    chk("walking it backwards flips the side to your LEFT (%s)" % a,
        a and "on your left" in a)
    chk("a point already passed is not announced",
        announce(1, 0) is None or "ticket" not in (announce(1, 0) or ""))
    chk("nothing is said twice",
        pg.evaluate("(function(){var pos={lat:%.6f,lon:-122.33};"
                    "return WalkGuide.corridorAnnounce(pos,0,%s,"
                    "{said:{'c:note0':true},lastSpokeAt:0,accuracy:5,now:1000000});})()"
                    % (47.6000 + 4 * 8 / 111320.0, CORR)) is None)
    chk("nor within the gap after the last one",
        announce(4, 0, "lastSpokeAt:999000") is None)
    chk("a rough fix off the line says nothing",
        pg.evaluate("WalkGuide.corridorAnnounce({lat:47.6100,lon:-122.33},0,%s,"
                    "{said:{},accuracy:5,now:1})" % CORR) is None)
    chk("a corridor with no notes says nothing",
        pg.evaluate("WalkGuide.corridorAnnounce({lat:47.6000,lon:-122.33},0,"
                    "{key:'c',points:[[47.6,-122.33],[47.6001,-122.33]],notes:[]},"
                    "{said:{},accuracy:5,now:1})") is None)

    chk("no page errors across the whole run (%s)" % (errs or "clean"), not errs)
    pg.close()
    br.close()

print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
sys.exit(1 if fails else 0)
