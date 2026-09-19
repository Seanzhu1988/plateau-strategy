const test = require('node:test');
const assert = require('node:assert/strict');
const route = require('./tour-routing.js');
test('distance boundaries preserve the requested strict over thresholds', () => {
 const mile=1609.344;
 assert.equal(route.band(.99*mile).color,'#15803d');
 assert.equal(route.band(mile).color,'#123456');
 assert.equal(route.band(1.5*mile).color,'#123456');
 assert.equal(route.band(1.501*mile).color,'#c65d00');
 assert.equal(route.band(3*mile).color,'#c65d00');
 assert.equal(route.band(3.001*mile).color,'#b91c1c');
 assert.equal(route.band(NaN).label,'Distance unavailable');
});
test('walking geometry uses a foot profile and supplied path, never a car shortcut', async () => {
 const a={lat:38,lon:-77},b={lat:38.1,lon:-77.1};
 const result=await route.walking(a,b,async url=>{
  assert.match(url,/profile=hiking-beta/);
  return {ok:true,json:async()=>({features:[{properties:{'track-length':'2300'},geometry:{type:'LineString',coordinates:[[-77,38],[-77.05,38.08],[-77.1,38.1]]}}]})};
 });
 assert.equal(result.points.length,3); assert.equal(result.meters,2300);
 assert.match(route.directions(a,b),/travelmode=walking/);
 await assert.rejects(route.walking(a,b,async()=>({ok:false})));
 await assert.rejects(route.walking(a,b,async()=>({ok:true,json:async()=>({features:[]})})));
});
test('checked Mall snapshot preserves every leg and rejects restricted or stale coordinates', () => {
 const fs=require('node:fs');
 const snapshot=JSON.parse(fs.readFileSync('national-mall-walking.json','utf8'));
 const stops=JSON.parse(fs.readFileSync('trails.json','utf8')).trails.find(t=>t.id==='national-mall').stops;
 assert.equal(snapshot.legs.length,stops.length-1);
 let meters=0,unavailable=0;
 stops.slice(1).forEach((stop,i)=>{
  const leg=snapshot.legs[i];
  assert.deepEqual(leg.from,[stops[i].lat,stops[i].lon]);
  assert.deepEqual(leg.to,[stop.lat,stop.lon]);
  if(leg.unavailable) {unavailable++;assert.throws(()=>route.snapshotLeg(snapshot,stops[i],stop));}
  else {const result=route.snapshotLeg(snapshot,stops[i],stop);meters+=result.meters; assert.ok(result.points.length>2);}
 });
 assert.equal(unavailable,0);assert.equal(meters,11752);
 assert.throws(()=>route.snapshotLeg(snapshot,{lat:0,lon:0},stops[1]));
 assert.throws(()=>route.snapshotLeg({...snapshot,profile:'driving'},stops[0],stops[1]));
});

test('Mall crossing uses park footways and the south approach instead of the north-side detour', () => {
 const snapshot=require('./national-mall-walking.json');
 const leg=snapshot.legs.find(l=>l.from_name==='National Air and Space Museum');
 assert.equal(leg.to_name,'National Gallery of Art');
 assert.equal(leg.includes_steps,true);
 assert.equal(leg.entrance_sources.length,2);
 assert.ok(leg.meters<350);
 assert.ok(leg.points.every(p=>p[1]>-77.0205 && p[0]<38.8911));
 assert.ok(leg.points.some(p=>p[0]>38.889 && p[0]<38.890));
});

test('White House arrival and departure share an exterior Ellipse viewpoint', () => {
 const snapshot=require('./national-mall-walking.json');
 const arrival=snapshot.legs[10],departure=snapshot.legs[11];
 assert.deepEqual(arrival.points.at(-1),departure.points[0]);
 assert.equal(arrival.meters,677);
 assert.equal(departure.meters,485);
 assert.ok(arrival.points.every(p=>p[0]<38.8952));
 assert.ok(departure.points.every(p=>p[0]<38.8956 || p[1]<-77.0383));
});
