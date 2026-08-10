/* The live walking guide: what is on your left, what is on your right.
 *
 * Everything here is pure geometry and one decision function, kept out of the
 * page so it can be tested with made-up positions instead of by walking down
 * a street with a laptop.
 *
 * THE PART THAT IS ACTUALLY HARD
 * ------------------------------
 * Not the speech, and not finding the places. It is knowing which way the
 * person is FACING, and knowing when the fix is too poor to say "left" at all.
 *
 * GPS gives a heading, and at walking pace it is close to useless: it is
 * derived from consecutive fixes, so standing still it is null and strolling
 * it wanders by tens of degrees. The compass is better but needs an explicit
 * permission grant on iOS and reads badly near cars, steel and phone cases
 * with magnets in them. So heading is taken from where the person has
 * ACTUALLY MOVED over the last several metres, which is noisy over one step
 * and steady over ten.
 *
 * And the thing that decides whether this feels magic or broken: a phone in a
 * city street is routinely 20–40 m out. If the fix is 30 m out and the shop is
 * 15 m away, "on your left" is a coin toss, and a guide that says left when it
 * means right is worse than one that says nothing. So an announcement is
 * withheld unless the distance to the place is comfortably larger than the
 * error on the fix. Silence is the correct output for a bad fix.
 */
(function (w) {
  "use strict";

  var R = 6371000;                       // mean earth radius, metres
  function rad(d) { return d * Math.PI / 180; }
  function deg(r) { return r * 180 / Math.PI; }

  /* Metres between two points. */
  function distanceM(a, b) {
    var dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat))
          * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  }

  /* Initial bearing from a to b, degrees clockwise from north. */
  function bearingTo(a, b) {
    var dLon = rad(b.lon - a.lon);
    var y = Math.sin(dLon) * Math.cos(rad(b.lat));
    var x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat))
          - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(dLon);
    return (deg(Math.atan2(y, x)) + 360) % 360;
  }

  /* Which way the person is facing, from where they have been.
   *
   * Takes the oldest fix at least MIN_RUN metres back and bearings from it to
   * now. One step is noise; ten metres is a direction. Returns null rather
   * than a guess when they have not moved far enough — a wrong heading turns
   * every left into a right, so "I do not know" has to be an available
   * answer. */
  var MIN_RUN = 8;                       // metres of travel before a heading is believable
  function headingFromTrail(trail) {
    if (!trail || trail.length < 2) return null;
    var last = trail[trail.length - 1];
    for (var i = trail.length - 2; i >= 0; i--) {
      if (distanceM(trail[i], last) >= MIN_RUN) return bearingTo(trail[i], last);
    }
    return null;
  }

  /* Where a place sits relative to the way you are walking.
   *
   * Returns {side, angle} with angle in -180..180: negative is left, positive
   * is right. The bands are deliberately wide for ahead and behind, because
   * "slightly to your left" for something 5 degrees off your nose is a
   * distinction nobody standing on a pavement cares about. */
  function relativeSide(heading, bearing) {
    var a = ((bearing - heading + 540) % 360) - 180;
    var side;
    if (Math.abs(a) <= 25) side = 'ahead';
    else if (Math.abs(a) >= 155) side = 'behind';
    else side = a < 0 ? 'left' : 'right';
    return { side: side, angle: a };
  }

  /* Can this fix support the sentence we want to say?
   *
   * The test is the ratio, not the raw accuracy. A 30 m error is fine for a
   * cathedral 200 m ahead and useless for a doorway 15 m away, and it is the
   * near ones a walking guide most wants to call. */
  function fixIsGoodEnough(accuracyM, distanceToPlaceM) {
    if (!isFinite(accuracyM) || accuracyM <= 0) return true;   // no estimate given
    if (accuracyM > 60) return false;          // lost in a street canyon
    return distanceToPlaceM >= accuracyM * 2;
  }

  /* THE DECISION: say something about this place, now, or stay quiet?
   *
   * A guide that narrates every bench, postbox and bin is switched off inside
   * a minute, so most of this function is reasons not to speak.
   *
   * state: {said: {id: true}, lastSpokeAt: ms, heading: deg|null,
   *         pos: {lat,lon}, accuracy: m, now: ms}
   */
  var NEAR = 120;                  // metres: beyond this it is not "on your left"
  var TOO_CLOSE = 8;               // already past it; announcing now is late
  var GAP_MS = 20000;              // one thing at a time, with room to look at it
  /* Something 80 m up the road and 30 m off it sits only 21 degrees off your
   * nose, so it is honestly "ahead" — and announcing at the first legal
   * moment therefore called EVERYTHING ahead, and the left-and-right that is
   * the whole point never happened. Found by walking a simulated street, not
   * by reading the code.
   *
   * So a place in the ahead band is held until you are close enough for the
   * side to have declared itself. Past this range "ahead" is the true answer
   * — something dead in front stays dead in front — and it gets called. */
  var AHEAD_MAX = 45;

  function shouldAnnounce(place, state) {
    if (!place || !state || !state.pos) return { ok: false, why: 'no position' };
    if (state.said && state.said[place.id]) return { ok: false, why: 'already said' };
    if (state.lastSpokeAt && (state.now - state.lastSpokeAt) < GAP_MS) {
      return { ok: false, why: 'too soon after the last one' };
    }
    var d = distanceM(state.pos, place);
    if (d > NEAR) return { ok: false, why: 'too far', distance: d };
    if (d < TOO_CLOSE) return { ok: false, why: 'already level with it', distance: d };
    if (!fixIsGoodEnough(state.accuracy, d)) {
      // The single most important refusal in this file.
      return { ok: false, why: 'fix too rough to say which side', distance: d };
    }
    if (state.heading === null || state.heading === undefined) {
      return { ok: false, why: 'not moving enough to know which way you face', distance: d };
    }
    var rel = relativeSide(state.heading, bearingTo(state.pos, place));
    if (rel.side === 'behind') return { ok: false, why: 'behind you', distance: d };
    if (rel.side === 'ahead' && d > AHEAD_MAX) {
      return { ok: false, why: 'still ahead — waiting to see which side it falls',
               distance: d };
    }
    return { ok: true, side: rel.side, angle: rel.angle, distance: d };
  }

  /* The sentence. Spoken aloud, so it is written to be heard once and not
   * re-read: the place first, then where to look, then why to care. Distances
   * are rounded hard — nobody paces out 37 metres. */
  function phrase(place, decision, opts) {
    opts = opts || {};
    var m = decision.distance;
    var far = m < 20 ? 'just here' : ('about ' + (Math.round(m / 10) * 10) + ' metres');
    var where = decision.side === 'ahead' ? (far + ' ahead')
              : (far + ' on your ' + decision.side);
    var s = place.name + ', ' + where + '.';
    if (place.blurb) s += ' ' + place.blurb.replace(/\s+/g, ' ').trim();
    // "Have I time?" — only said when both halves are known, because a guess
    // about somebody's evening is worse than no opinion.
    if (place.typical_visit && opts.minutesLeft) {
      s += place.typical_visit <= opts.minutesLeft
        ? ' People usually spend about ' + place.typical_visit
          + ' minutes here, so you have time.'
        : ' People usually spend about ' + place.typical_visit
          + ' minutes here — more than you have left today.';
    }
    return s;
  }

  /* Metres from a position to the nearest point of a recorded footprint.
   *
   * A footprint's promise is "this line works". The useful question while
   * following one is not "where is the next turn" — indoors there are no
   * street names to turn onto — but "am I still on the line, and how far off
   * if not". Flat projection around the position: corridors are hundreds of
   * metres, where the error in that flattening is centimetres. Accepts points
   * as [lat, lon] pairs (the stored shape) or {lat, lon} objects. */
  function nearestOnPathM(pos, points) {
    if (!points || !points.length) return Infinity;
    var kx = 111320 * Math.cos(rad(pos.lat)), ky = 111320;
    function xy(p) {
      var lat = (p.lat !== undefined) ? p.lat : p[0];
      var lon = (p.lon !== undefined) ? p.lon : p[1];
      return { x: (lon - pos.lon) * kx, y: (lat - pos.lat) * ky };
    }
    var prev = xy(points[0]);
    var best = Math.sqrt(prev.x * prev.x + prev.y * prev.y);
    for (var i = 1; i < points.length; i++) {
      var cur = xy(points[i]);
      var dx = cur.x - prev.x, dy = cur.y - prev.y;
      var len2 = dx * dx + dy * dy;
      // The closest point of this segment to the origin (which is us).
      var t = len2 ? (-(prev.x * dx + prev.y * dy)) / len2 : 0;
      t = Math.max(0, Math.min(1, t));
      var px = prev.x + t * dx, py = prev.y + t * dy;
      var d = Math.sqrt(px * px + py * py);
      if (d < best) best = d;
      prev = cur;
    }
    return best;
  }

  /* Confidently astray, or just not provably on the line? The tolerance grows
   * with the fix error for the same reason announcements are withheld on a
   * rough fix: "you have left the path" from a phone that is merely guessing
   * is the guide crying wolf, and it is ignored by the time it is right. */
  function offPath(accuracyM, distM) {
    var acc = (isFinite(accuracyM) && accuracyM > 0) ? accuracyM : 0;
    return distM > Math.max(25, acc * 1.5);
  }

  w.WalkGuide = {
    distanceM: distanceM,
    bearingTo: bearingTo,
    headingFromTrail: headingFromTrail,
    relativeSide: relativeSide,
    fixIsGoodEnough: fixIsGoodEnough,
    shouldAnnounce: shouldAnnounce,
    phrase: phrase,
    nearestOnPathM: nearestOnPathM,
    offPath: offPath,
    NEAR: NEAR, GAP_MS: GAP_MS, MIN_RUN: MIN_RUN, AHEAD_MAX: AHEAD_MAX
  };
})(window);
