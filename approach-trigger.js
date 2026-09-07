/* approach-trigger.js: the guide notices you are arriving.
 *
 * [SEAN 2026-09-06, APPROACH_TRIGGER.md: "a guide that senses when a traveler
 * is nearing a landmark, sizes the moment to the building in front of them,
 * and tells them where to look ... this is not a National Mall feature."]
 *
 * PHASE 1 OF FOUR. This file does the sizing and the state machine and nothing
 * else. There is no heads-up cue yet, no left and right, no cluster ordering.
 * Those are phases 2 to 4 and the shape here is built to take them: every zone
 * crossing already emits its own event, so phase 2 is a listener rather than a
 * rewrite.
 *
 * WHAT IT REPLACES. The Mall page carried one flat rule: within 60 m of the
 * nearest stop, with the fix good to 80 m, open it and play it once. That is a
 * good rule for a rowhouse and a poor one for a 169 m obelisk, which you can
 * see from half a mile and which the walker passes long before the guide
 * notices. The radii here grow with the building.
 *
 * THE RULE THAT MATTERS MOST: A STOP WITH NO MEASUREMENTS BEHAVES EXACTLY AS
 * IT DOES TODAY. Height and footprint are optional. Where they are missing the
 * stop keeps the flat 60 m, so shipping this cannot make any stop worse than
 * it was, and the data can arrive one landmark at a time. Half the Mall has no
 * published footprint I could source; those stops are unchanged.
 *
 * WHY THE NUMBERS ARE NOT SCRAPED FROM THE MODEL FILES. The rebuilt landmarks
 * do carry their real dimensions, but as prose in a header comment and as
 * expressions like `500 * FT * VE`, where VE is a vertical exaggeration passed
 * in at mount time (dc-3d.js offers a `tall` scene at ve 1.6). Reading heights
 * out of that code would inherit the exaggeration. So the numbers are stated
 * once, by hand, with their source beside them, and this module only consumes
 * them.
 *
 * PRIVACY. Position is passed in by the page and never leaves the phone. This
 * module holds no history and makes no request of any kind.
 */
(function (root) {
  "use strict";

  var R_EARTH = 6371008.8;

  /* The flat radius the Mall used before this existed. It stays as the answer
     for any stop we have not measured. */
  var FLAT_M = 60;

  function clamp(lo, v, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  /* Great-circle metres. The walk is a couple of miles, so the cheap
     equirectangular approximation would be fine, but haversine costs nothing
     at eighteen stops per position update and removes a class of question. */
  function distance(lat1, lon1, lat2, lon2) {
    var p1 = lat1 * Math.PI / 180, p2 = lat2 * Math.PI / 180;
    var dp = (lat2 - lat1) * Math.PI / 180, dl = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
    return 2 * R_EARTH * Math.asin(Math.sqrt(a));
  }

  /* Initial great-circle bearing, degrees clockwise from north. "Initial"
     matters: over a couple of miles the difference from the final bearing is
     a fraction of a degree, but using the right one costs nothing. */
  function bearing(lat1, lon1, lat2, lon2) {
    var p1 = lat1 * Math.PI / 180, p2 = lat2 * Math.PI / 180;
    var dl = (lon2 - lon1) * Math.PI / 180;
    var y = Math.sin(dl) * Math.cos(p2);
    var x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  /* Which way to look, from the difference between where the landmark is and
     which way the walker is facing. The bands are wide on purpose: a phone
     heading is worth a few degrees at best, so "on your right" covers a
     quadrant rather than pretending to point. */
  function sideOf(brg, heading) {
    if (heading == null || isNaN(heading)) return null;
    var t = ((brg - heading + 540) % 360) - 180;      /* -180 .. 180 */
    if (t > -30 && t <= 30) return "ahead";
    if (t > 30 && t <= 150) return "right";
    if (t < -30 && t >= -150) return "left";
    return "behind";
  }

  /* Three radii from two numbers. Height drives how early a thing can be seen,
     footprint drives its presence on the ground, and the clamps stop either
     one running away: an obelisk cannot announce itself from a mile, and a
     garden shed still gets a usable zone.

     The constants are tuning dials and are meant to be moved after a real
     walk, which is why they are named and gathered here rather than inlined. */
  function ringsFor(h, w) {
    if (!(h > 0) || !(w > 0)) return null;      /* unmeasured: caller falls back */
    return {
      headsUp: Math.round(clamp(50, 40 + 2.5 * h + 0.5 * w, 600)),
      narrate: Math.round(clamp(40, 20 + 0.6 * h + 0.8 * w, 220)),
      base:    Math.round(clamp(15,  8 + 0.15 * h + 0.6 * w, 60))
    };
  }

  /* A landmark's own zones, resolved once at load. A stop with no measurements
     gets the flat radius in the narrate slot and nothing else, which is
     precisely the old behaviour: one ring, one event, the description. */
  function prepare(stops) {
    var out = [];
    for (var i = 0; i < stops.length; i++) {
      var s = stops[i];
      if (!(typeof s.lat === "number" && typeof s.lon === "number")) continue;
      var r = ringsFor(s.height_m, s.footprint_m);
      out.push({
        stop: s,
        rings: r || { headsUp: 0, narrate: FLAT_M, base: 0 },
        measured: !!r,
        /* Prominence orders a cluster in phase 4. Height counts for more than
           footprint because it is what you see first down a long axis. */
        weight: (s.height_m || 0) * 2 + (s.footprint_m || 0),
        state: "dormant",
        spoken: false,
        arrivedSaid: false
      });
    }
    return out;
  }

  /* THE HYSTERESIS BUFFER. Leaving a zone needs more than entering it, so a
     walker standing on an edge does not stutter the audio on and off with the
     ordinary wobble of a GPS fix. */
  var LEAVE_BUFFER = 15;

  /* Zones ordered from outside in, so the code can ask whether a step is
     inward or outward without comparing strings. */
  var RANK = { dormant: 0, sighted: 1, approaching: 2, arrived: 3 };

  /* Above this height a walker has to raise their eyes, and being told so is
     the difference between finding the Monument and walking past its base. */
  var LOOK_UP_M = 25;

  function create(opts) {
    var o = opts || {};
    var marks = prepare(o.stops || []);
    /* Heading, in order of trust: the fix's own course while moving, then the
       compass the page feeds in, then the line between the last two fixes.
       A walker standing still has no course and no derived heading, which is
       why the compass is worth asking for. */
    var lastFix = null, compass = null;
    var onEvent = typeof o.onEvent === "function" ? o.onEvent : function () {};
    /* A fix fuzzier than the zone is deep is not evidence of arrival. The gate
       is the old page's 80 m, kept because it was tuned on real walks, but it
       is also compared against the zone itself below. */
    var maxAccuracy = o.maxAccuracy == null ? 80 : o.maxAccuracy;

    function zoneOf(m, d) {
      if (m.rings.base && d <= m.rings.base) return "arrived";
      if (d <= m.rings.narrate) return "approaching";
      if (m.rings.headsUp && d <= m.rings.headsUp) return "sighted";
      return "dormant";
    }

    /* Rank matters only when more than one landmark is in range. At the narrate
       radius on the Mall that never happens, the stops are a median 288 m
       apart; at the heads-up radius of a tall building it happens constantly,
       which is why the ordering is here in phase 1 rather than waiting. */
    function update(lat, lon, accuracy, course) {
      var acc = accuracy == null ? 0 : accuracy;
      var heading = (course != null && !isNaN(course)) ? course : null;
      if (heading == null && lastFix && distance(lastFix[0], lastFix[1], lat, lon) > 8) {
        heading = bearing(lastFix[0], lastFix[1], lat, lon);
      }
      if (heading == null) heading = compass;
      if (!lastFix || distance(lastFix[0], lastFix[1], lat, lon) > 8) lastFix = [lat, lon];
      var live = [], i, m, d, z;
      for (i = 0; i < marks.length; i++) {
        m = marks[i];
        d = distance(lat, lon, m.stop.lat, m.stop.lon);
        z = zoneOf(m, d);

        /* THE BUFFER APPLIES TO EVERY OUTWARD STEP, not only to leaving
           altogether. Guarding the exit to dormant alone was not enough: a
           walker standing on the narrate edge fell back to "sighted" and
           returned, over and over, and each return was a fresh crossing. The
           test caught seven events where one was due. Moving outward now has
           to clear the ring it is leaving by the buffer; moving inward is
           always believed, because arriving is what the walker came to do. */
        if (RANK[z] < RANK[m.state]) {
          var leaving = m.state === "arrived" ? m.rings.base
                      : m.state === "approaching" ? m.rings.narrate
                      : m.rings.headsUp;
          if (!(d > leaving + LEAVE_BUFFER)) z = m.state;
        }

        if (z !== "dormant") live.push({ m: m, d: d, z: z });
        else { m.state = "dormant"; continue; }

        /* An uncertain fix is held, not trusted. A reading good to 80 m says
           nothing about a 41 m base ring, so the deeper the zone the better
           the fix has to be. */
        var need = z === "arrived" ? m.rings.base : (z === "approaching" ? m.rings.narrate : m.rings.headsUp);
        if (acc > maxAccuracy || (need && acc > need)) { continue; }

        if (m.state !== z) {
          var was = m.state;
          m.state = z;
          live[live.length - 1].crossed = { from: was, to: z };
        }
      }

      if (!live.length) return null;

      /* One voice at a time: the most prominent thing in range speaks, the
         rest wait. Ties, and the unmeasured, fall back to nearest. */
      live.sort(function (a, b) {
        return (b.m.weight - a.m.weight) || (a.d - b.d);
      });

      for (i = 0; i < live.length; i++) {
        var L = live[i];
        if (!L.crossed) continue;

        /* ARRIVAL IS ITS OWN EVENT. It used to be folded in with the narrate
           branch, so a walker who had already heard the description got no
           arrival at all: the state machine moved to "arrived" and nothing was
           emitted. Walking to the foot of the Washington Monument still read
           "coming up ahead". Arrival now speaks whether or not the description
           has played, once per visit. */
        if (L.z === "arrived") {
          /* Order matters, and it is the reverse of what reads naturally in
             code: the description is started FIRST and the arrival line is
             emitted LAST, because both write the same one line on screen and
             the walker standing at the door should be left looking at "you are
             here", not at "coming up ahead". Tested by walking to the foot of
             the Monument, which is where the first attempt read wrong. */
          var stop = null;
          if (!L.m.spoken) { L.m.spoken = true; onEvent(cue("narrate", L, lat, lon, heading)); stop = L.m.stop; }
          if (!L.m.arrivedSaid) { L.m.arrivedSaid = true; onEvent(cue("arrived", L, lat, lon, heading)); }
          if (stop) return stop;
          continue;
        }
        if (L.z === "approaching") {
          if (L.m.spoken) continue;            /* a landmark speaks once a visit */
          L.m.spoken = true;
          onEvent(cue("narrate", L, lat, lon, heading));
          return L.m.stop;
        }
        onEvent(cue(L.z, L, lat, lon, heading));
      }
      return null;
    }

    function cue(type, L, lat, lon, heading) {
      var brg = bearing(lat, lon, L.m.stop.lat, L.m.stop.lon);
      return {
        type: type, stop: L.m.stop, distance: Math.round(L.d),
        measured: L.m.measured, rings: L.m.rings,
        bearing: Math.round(brg),
        side: sideOf(brg, heading),
        lookUp: (L.m.stop.height_m || 0) >= LOOK_UP_M
      };
    }

    return {
      update: update,
      /* The page hands the compass in rather than the module listening for it,
         because the permission prompt belongs to a user gesture the page owns. */
      setCompass: function (deg) { compass = (deg == null || isNaN(deg)) ? null : deg; },
      /* For the page's status line and for anyone checking the sizing without
         walking to Washington. */
      describe: function () {
        return marks.map(function (m) {
          return { name: m.stop.name, measured: m.measured, rings: m.rings };
        });
      },
      reset: function () {
        marks.forEach(function (m) { m.state = "dormant"; m.spoken = false; m.arrivedSaid = false; });
      }
    };
  }

  root.ApproachTrigger = { create: create, ringsFor: ringsFor, distance: distance,
                           bearing: bearing, sideOf: sideOf, FLAT_M: FLAT_M };
})(typeof window !== "undefined" ? window : this);
