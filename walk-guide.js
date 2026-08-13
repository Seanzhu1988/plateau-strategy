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
 * city street is routinely 20, 40 m out. If the fix is 30 m out and the shop is
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
   * than a guess when they have not moved far enough, a wrong heading turns
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
   * nose, so it is honestly "ahead", and announcing at the first legal
   * moment therefore called EVERYTHING ahead, and the left-and-right that is
   * the whole point never happened. Found by walking a simulated street, not
   * by reading the code.
   *
   * So a place in the ahead band is held until you are close enough for the
   * side to have declared itself. Past this range "ahead" is the true answer
   *, something dead in front stays dead in front, and it gets called. */
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
      return { ok: false, why: 'still ahead, waiting to see which side it falls',
               distance: d };
    }
    return { ok: true, side: rel.side, angle: rel.angle, distance: d };
  }

  /* The sentence. Spoken aloud, so it is written to be heard once and not
   * re-read: the place first, then where to look, then why to care. Distances
   * are rounded hard, nobody paces out 37 metres. */
  function phrase(place, decision, opts) {
    opts = opts || {};
    var m = decision.distance;
    var far = m < 20 ? 'just here' : ('about ' + (Math.round(m / 10) * 10) + ' metres');
    var where = decision.side === 'ahead' ? (far + ' ahead')
              : (far + ' on your ' + decision.side);
    var s = place.name + ', ' + where + '.';
    if (place.blurb) s += ' ' + place.blurb.replace(/\s+/g, ' ').trim();
    // "Have I time?", only said when both halves are known, because a guess
    // about somebody's evening is worse than no opinion.
    if (place.typical_visit && opts.minutesLeft) {
      s += place.typical_visit <= opts.minutesLeft
        ? ' People usually spend about ' + place.typical_visit
          + ' minutes here, so you have time.'
        : ' People usually spend about ' + place.typical_visit
          + ' minutes here, more than you have left today.';
    }
    return s;
  }

  /* Metres from a position to the nearest point of a recorded footprint.
   *
   * A footprint's promise is "this line works". The useful question while
   * following one is not "where is the next turn", indoors there are no
   * street names to turn onto, but "am I still on the line, and how far off
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

  /* Sean's rule, verbatim: "they face correct direction shows foot prints."
   *
   * The footprints of the person who walked this corridor before you are the
   * guidance, but only when you are FACING along the path. Turn the wrong
   * way and they disappear, and the emptiness is the message: no arrows, no
   * "recalculating", nothing to read. You turn until the footprints come
   * back, which is a thing a tired traveller does without being taught.
   *
   * Returns {show, dir, trail, why}: dir is +1 walking the corridor the way
   * it was recorded, -1 walking it home again, a corridor works both ways, 
   * and trail is the next stretch of recorded points to draw as footprints.
   */
  var TRAIL_CONE = 60;             // degrees off the path direction that still counts as "along it"
  var TRAIL_M = 40;                // how far ahead the footprints are drawn

  function trailAhead(pos, heading, points, opts) {
    opts = opts || {};
    if (!points || points.length < 2) return { show: false, why: 'no recorded path' };
    if (heading === null || heading === undefined) {
      return { show: false, why: 'not moving enough to know which way you face' };
    }
    var d = nearestOnPathM(pos, points);
    if (offPath(opts.accuracy, d)) {
      return { show: false, why: 'off the path', distance: d };
    }
    // Nearest recorded vertex, and the path's own direction there.
    var ni = 0, nd = Infinity;
    for (var i = 0; i < points.length; i++) {
      var p = { lat: points[i].lat !== undefined ? points[i].lat : points[i][0],
                lon: points[i].lon !== undefined ? points[i].lon : points[i][1] };
      var dm = distanceM(pos, p);
      if (dm < nd) { nd = dm; ni = i; }
    }
    function at(i) {
      var p = points[Math.max(0, Math.min(points.length - 1, i))];
      return { lat: p.lat !== undefined ? p.lat : p[0],
               lon: p.lon !== undefined ? p.lon : p[1] };
    }
    var fwd = ni < points.length - 1 ? bearingTo(at(ni), at(ni + 1))
                                     : bearingTo(at(ni - 1), at(ni));
    // 0 = facing along the path, 180 = facing back down it.
    var delta = Math.abs(((fwd - heading + 540) % 360) - 180);
    var dir = 0;
    if (delta <= TRAIL_CONE) dir = 1;
    else if (delta >= 180 - TRAIL_CONE) dir = -1;
    else return { show: false, why: 'facing away from the path', distance: d };
    var trail = [], run = 0, j = ni;
    while (run < TRAIL_M) {
      var k = j + dir;
      if (k < 0 || k >= points.length) break;
      run += distanceM(at(j), at(k));
      trail.push(at(k));
      j = k;
    }
    if (!trail.length) return { show: false, why: 'end of the recorded path', distance: d };
    return { show: true, dir: dir, trail: trail, distance: d };
  }

  /* Indoor announcement: a described point ON a recorded corridor, spoken as
   * you reach it while walking the corridor the right way.
   *
   * This is the indoor half of the guide, and the whole reason it is separate
   * from shouldAnnounce(). Outdoors, shouldAnnounce fires on GPS distance to an
   * OpenStreetMap place. Indoors GPS is too rough for that and a hallway has no
   * OSM places, so the trigger is different: snap to the recorded line, and
   * fire a note when your progress along the line reaches its point AND you are
   * facing along the corridor. The footprint is the position reference GPS
   * cannot be indoors.
   *
   * corridor: { points: [[lat,lon],...],
   *             notes:  [{ at:<index into points>, text:"The ticket machines",
   *                        side:"left"|"right"|"ahead" }] }
   * state:    { said:{}, lastSpokeAt, accuracy, now }
   * Returns { id, text, at } to speak, or null.
   */
  var NOTE_WINDOW = 2;             // recorded indices either side counts as "reached"

  function _asLL(p) {
    return { lat: p.lat !== undefined ? p.lat : p[0],
             lon: p.lon !== undefined ? p.lon : p[1] };
  }

  function corridorAnnounce(pos, heading, corridor, state) {
    state = state || {};
    if (!corridor || !corridor.points || corridor.points.length < 2) return null;
    var notes = corridor.notes || [];
    if (!notes.length) return null;
    if (state.lastSpokeAt && state.now && (state.now - state.lastSpokeAt) < GAP_MS) {
      return null;                 // one thing at a time, room to look at it
    }
    // Must be ON the line, and facing along it. trailAhead enforces both, plus
    // the no-heading and off-path refusals, so it is the one gate to ask.
    var t = trailAhead(pos, heading, corridor.points, { accuracy: state.accuracy });
    if (!t.show) return null;
    var dir = t.dir;               // +1 as recorded, -1 walking it back
    // Progress = nearest recorded index.
    var ni = 0, nd = Infinity;
    for (var k = 0; k < corridor.points.length; k++) {
      var dm = distanceM(pos, _asLL(corridor.points[k]));
      if (dm < nd) { nd = dm; ni = k; }
    }
    var said = state.said || {};
    var pfx = corridor.key ? corridor.key + ':' : '';   // so two corridors' notes never collide
    var best = null;
    for (var j = 0; j < notes.length; j++) {
      var nt = notes[j];
      var id = pfx + 'note' + (nt.id !== undefined ? nt.id : j);
      if (said[id]) continue;
      // How far the note is ahead of us in the direction we are actually
      // walking. Negative means we have passed it; only announce at or just
      // before reaching it.
      var ahead = (nt.at - ni) * dir;
      if (ahead < 0 || ahead > NOTE_WINDOW) continue;
      if (!best || ahead < best.ahead) best = { nt: nt, id: id, ahead: ahead };
    }
    if (!best) return null;
    // Left and right are relative to travel; walking the corridor backwards
    // flips them, so the note recorded "on your right" is on your left going
    // the other way.
    var side = best.nt.side;
    if (dir === -1 && side === 'left') side = 'right';
    else if (dir === -1 && side === 'right') side = 'left';
    var where = (!side || side === 'ahead') ? 'just ahead' : ('on your ' + side);
    return { id: best.id, at: best.nt.at,
             text: best.nt.text + ', ' + where + '.' };
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
    trailAhead: trailAhead,
    corridorAnnounce: corridorAnnounce,
    NEAR: NEAR, GAP_MS: GAP_MS, MIN_RUN: MIN_RUN, AHEAD_MAX: AHEAD_MAX,
    TRAIL_CONE: TRAIL_CONE, TRAIL_M: TRAIL_M, NOTE_WINDOW: NOTE_WINDOW
  };
})(window);
