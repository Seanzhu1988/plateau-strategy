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
test('generic tour snapshots accept only explicit same-origin walking assets', async () => {
 const a={lat:40,lon:-75},b={lat:40.01,lon:-75.01};
 const original=global.fetch;
 global.fetch=async url=>{
  assert.equal(url,'/test-walking.json');
  return {ok:true,json:async()=>({version:1,profile:'hiking-beta',legs:[{
   from:[a.lat,a.lon],to:[b.lat,b.lon],meters:1234,points:[[40,-75],[40.005,-75.002],[40.01,-75.01]]
  }]})};
 };
 try {
  const leg=await route.snapshotWalking('/test-walking.json',a,b);
  assert.equal(leg.meters,1234); assert.equal(leg.points.length,3);
  await assert.rejects(route.snapshotWalking('https://example.com/walking.json',a,b));
  await assert.rejects(route.snapshotWalking('/app.py',a,b));
 } finally { global.fetch=original; }
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

test('Philadelphia uses all eighteen checked pedestrian legs and no straight-line map fallback', () => {
 const fs=require('node:fs');
 const snapshot=JSON.parse(fs.readFileSync('philadelphia-walking.json','utf8'));
 const trail=JSON.parse(fs.readFileSync('trails.json','utf8')).trails.find(t=>t.id==='philadelphia');
 const page=fs.readFileSync('tour.html','utf8');
 assert.equal(trail.walking_snapshot,'/philadelphia-walking.json');
 assert.ok(trail.stops.every(stop=>stop.est!==true));
 assert.equal(snapshot.legs.length,trail.stops.length-1);
 let meters=0;
 trail.stops.slice(1).forEach((stop,i)=>{
  const before=trail.stops[i],leg=snapshot.legs[i],result=route.snapshotLeg(snapshot,before,stop);
  assert.deepEqual(leg.from,[before.lat,before.lon]);
  assert.deepEqual(leg.to,[stop.lat,stop.lon]);
  assert.equal(leg.from_name,before.name); assert.equal(leg.to_name,stop.name);
  assert.equal(stop.walk_m_from_prev,result.meters);
  assert.equal(stop.walk_min_from_prev,Math.ceil(result.meters/75));
  assert.ok(result.points.length>=2);
  assert.ok(result.points.every(p=>p[0]>39.94&&p[0]<39.98&&p[1]>-75.19&&p[1]<-75.13));
  meters+=result.meters;
 });
 assert.equal(meters,8528); assert.equal(trail.length_m,meters);
 assert.equal(trail.walk_min_total,Math.ceil(meters/75));
 assert.match(page,/PSXTourRouting\.snapshotWalking\(t\.walking_snapshot/);
 assert.doesNotMatch(page,/L\.polyline\(line/);
 assert.doesNotMatch(page,/google\.com\/maps\/dir/);
});

test('Harvard uses all nine checked pedestrian legs through and around the Yard', () => {
 const fs=require('node:fs');
 const snapshot=JSON.parse(fs.readFileSync('harvard-walking.json','utf8'));
 const trail=JSON.parse(fs.readFileSync('trails.json','utf8')).trails.find(t=>t.id==='ivy-harvard');
 assert.equal(trail.walking_snapshot,'/harvard-walking.json');
 assert.equal(snapshot.legs.length,trail.stops.length-1);
 assert.ok(trail.stops.every(stop=>stop.est!==true));
 let meters=0;
 trail.stops.slice(1).forEach((stop,i)=>{
  const before=trail.stops[i],leg=snapshot.legs[i],result=route.snapshotLeg(snapshot,before,stop);
  assert.deepEqual(leg.from,[before.lat,before.lon]);
  assert.deepEqual(leg.to,[stop.lat,stop.lon]);
  assert.equal(leg.from_name,before.name); assert.equal(leg.to_name,stop.name);
  assert.equal(stop.walk_m_from_prev,result.meters);
  assert.equal(stop.walk_min_from_prev,Math.ceil(result.meters/75));
  assert.ok(result.points.length>=2);
  assert.ok(result.points.every(p=>p[0]>42.36&&p[0]<42.39&&p[1]>-71.13&&p[1]<-71.10));
  assert.equal(result.band.color,'#15803d');
  meters+=result.meters;
 });
 assert.equal(meters,1781); assert.equal(trail.length_m,meters);
 assert.equal(trail.walk_min_total,Math.ceil(meters/75));
 assert.match(fs.readFileSync('tour.html','utf8'),/line\.concat\(mappedPoints\)/);
});

test('Yale uses all nine checked pedestrian legs through the Old Campus and libraries', () => {
 const fs=require('node:fs');
 const snapshot=JSON.parse(fs.readFileSync('yale-walking.json','utf8'));
 const trail=JSON.parse(fs.readFileSync('trails.json','utf8')).trails.find(t=>t.id==='ivy-yale');
 assert.equal(trail.walking_snapshot,'/yale-walking.json');
 assert.equal(snapshot.legs.length,trail.stops.length-1);
 assert.ok(trail.stops.every(stop=>stop.est!==true));
 let meters=0;
 trail.stops.slice(1).forEach((stop,i)=>{
  const before=trail.stops[i],leg=snapshot.legs[i],result=route.snapshotLeg(snapshot,before,stop);
  assert.deepEqual(leg.from,[before.lat,before.lon]);
  assert.deepEqual(leg.to,[stop.lat,stop.lon]);
  assert.equal(leg.from_name,before.name); assert.equal(leg.to_name,stop.name);
  assert.equal(stop.walk_m_from_prev,result.meters);
  assert.equal(stop.walk_min_from_prev,Math.ceil(result.meters/75));
  assert.ok(result.points.length>=2);
  assert.ok(result.points.every(p=>p[0]>41.29&&p[0]<41.33&&p[1]>-72.95&&p[1]<-72.90));
  assert.equal(result.band.color,'#15803d');
  meters+=result.meters;
 });
 assert.equal(meters,2095); assert.equal(trail.length_m,meters);
 assert.equal(trail.walk_min_total,Math.ceil(meters/75));
});
