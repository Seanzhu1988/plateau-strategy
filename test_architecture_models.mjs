import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as THREE from './vendor/three/three.module.min.js';
import {buildWorldTradeCenter} from './architecture-wtc.js';
import {buildBostonLandmark,installBostonGeometryHelpers,BOSTON_LANDMARKS} from './architecture-boston.js';

globalThis.window={};
vm.runInThisContext(readFileSync(new URL('./trail-3d.js',import.meta.url),'utf8'),{filename:'trail-3d.js'});
installBostonGeometryHelpers(window.TRAIL3D);
for(const key of Object.keys(BOSTON_LANDMARKS))vm.runInThisContext(readFileSync(new URL(`./trail-form-${key}.js`,import.meta.url),'utf8'),{filename:`trail-form-${key}.js`});
const kit={materialFor:color=>new THREE.MeshStandardMaterial({color,side:THREE.DoubleSide})};

function verify(model){
  assert.ok(model.group.isGroup);assert.ok(model.views.length>=3);assert.ok(model.sources.length);
  let triangles=0;
  model.group.traverse(object=>{
    if(!object.isMesh)return;
    for(const [name,attribute] of Object.entries(object.geometry.attributes))assert.ok(Array.from(attribute.array).every(Number.isFinite),`Invalid ${name}`);
    if(object.instanceMatrix)assert.ok(Array.from(object.instanceMatrix.array).every(Number.isFinite),'Invalid instance matrix');
    triangles+=(object.geometry.index?.count||object.geometry.attributes.position.count)/3*(object.isInstancedMesh?object.count:1);
  });
  assert.ok(triangles>500);assert.ok(triangles<1500000,`Excessive mobile geometry: ${triangles}`);
  for(const view of model.views){
    assert.ok(view.position.every(Number.isFinite));assert.ok(view.target.every(Number.isFinite));assert.ok(view.label);
    if(view.bounds){assert.ok(view.bounds.isBox3);assert.ok(!view.bounds.isEmpty());assert.ok(view.bounds.min.toArray().concat(view.bounds.max.toArray()).every(Number.isFinite));}
  }
  const box=new THREE.Box3().setFromObject(model.group);assert.ok(!box.isEmpty());
  assert.ok(box.min.toArray().concat(box.max.toArray()).every(Number.isFinite));
  return box;
}
for(const key of Object.keys(BOSTON_LANDMARKS))test(`${key}: physical geometry, source record and usable views`,()=>verify(buildBostonLandmark(THREE,key,kit)));
test('Unknown Boston keys are rejected',()=>assert.throws(()=>buildBostonLandmark(THREE,'not-a-landmark',kit)));
test('WTC tower and both memorial voids retain actual scale and depth',()=>{
  const model=buildWorldTradeCenter(THREE,kit),box=verify(model);
  assert.equal(box.max.y,1776);assert.equal(model.stats.towerFacets,8);assert.equal(model.stats.poolCount,2);
  model.group.updateMatrixWorld(true);
  for(const [x,z] of [[-105,-20],[85,240]]){
    const ray=new THREE.Raycaster(new THREE.Vector3(x,10,z),new THREE.Vector3(0,-1,0));
    const hits=ray.intersectObject(model.group,true);
    assert.ok(hits.length,'The central void needs a basin below it');
    assert.ok(hits[0].point.y < -45,'An opaque plaza or water plane covers the central void');
  }
});
