/* Walking geometry only. Never substitute a car route or a straight line. */
(function (root) {
  'use strict';
  function band(meters) {
    if (!Number.isFinite(meters) || meters < 0) return {color:'#64748b', label:'Distance unavailable'};
    var miles = meters / 1609.344;
    if (miles > 3) return {color:'#b91c1c', label:'Long detour: consider a ride'};
    if (miles > 1.5) return {color:'#c65d00', label:'Longer walk: optional detour'};
    if (miles >= 1) return {color:'#123456', label:'Moderate walk'};
    return {color:'#15803d', label:'Short walk'};
  }
  function point(p) {
    if (!p || !Number.isFinite(p.lat) || !Number.isFinite(p.lon) || Math.abs(p.lat)>90 || Math.abs(p.lon)>180) throw new Error('Invalid destination');
    return p.lon + ',' + p.lat;
  }
  function directions(a, b, mode) {
    point(a); point(b);
    return 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(a.lat+','+a.lon) + '&destination=' + encodeURIComponent(b.lat+','+b.lon) + '&travelmode=' + (mode === 'driving' ? 'driving' : 'walking');
  }
  var snapshotPromises = {};
  function snapshotLeg(snapshot, a, b) {
    point(a); point(b);
    if (!snapshot || snapshot.version !== 1 || snapshot.profile !== 'hiking-beta' || !Array.isArray(snapshot.legs)) throw new Error('Walking snapshot unavailable');
    var leg = snapshot.legs.find(function (l) {return l.from && l.to && l.from[0] === a.lat && l.from[1] === a.lon && l.to[0] === b.lat && l.to[1] === b.lon;});
    if (!leg || leg.unavailable || !Number.isFinite(leg.meters) || leg.meters <= 0 || !Array.isArray(leg.points) || leg.points.length < 2) throw new Error('Walking route unavailable');
    leg.points.forEach(function (p) { point({lat:p[0],lon:p[1]}); });
    return {meters:leg.meters, points:leg.points, band:band(leg.meters)};
  }
  async function snapshotWalking(asset, a, b) {
    if (!/^\/[a-z0-9-]+-walking\.json$/.test(asset || '')) throw new Error('Walking snapshot unavailable');
    if (!snapshotPromises[asset]) snapshotPromises[asset] = (async function () {
      var controller = new AbortController(), timer = setTimeout(function () {controller.abort();}, 8000);
      try {
        var response = await fetch(asset, {cache:'no-cache', signal:controller.signal});
        if (!response.ok) throw new Error('Walking snapshot unavailable');
        return await response.json();
      } finally { clearTimeout(timer); }
    })();
    return snapshotLeg(await snapshotPromises[asset], a, b);
  }
  async function mallWalking(a, b) {
    return snapshotWalking('/national-mall-walking.json', a, b);
  }
  async function walking(a, b, fetcher) {
    var url = 'https://brouter.de/brouter?lonlats=' + point(a) + '|' + point(b) + '&profile=hiking-beta&alternativeidx=0&format=geojson';
    var controller = new AbortController(), timer = setTimeout(function () {controller.abort();}, 12000);
    try {
      var response = await (fetcher || fetch)(url, {signal:controller.signal});
      if (!response.ok) throw new Error('Walking route unavailable');
      var data = await response.json(), f = data.features && data.features[0];
      var meters = Number(f && f.properties && f.properties['track-length']);
      var coords = f && f.geometry && f.geometry.coordinates;
      if (!f || f.geometry.type !== 'LineString' || !Array.isArray(coords) || coords.length < 2 || !Number.isFinite(meters) || meters <= 0) throw new Error('Walking route unavailable');
      var path = coords.map(function (p) { point({lon:p[0],lat:p[1]}); return [p[1],p[0]]; });
      return {meters:meters, points:path, band:band(meters)};
    } finally { clearTimeout(timer); }
  }
  var api = {band:band, walking:walking, mallWalking:mallWalking, snapshotWalking:snapshotWalking, snapshotLeg:snapshotLeg, directions:directions};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PSXTourRouting = api;
})(typeof window !== 'undefined' ? window : globalThis);
