import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from './vendor/three/three.module.min.js';
import {fitArchitectureView} from './architecture-camera.js';

for(const aspect of [.57,.85,1.72,2.4])for(const size of [[710,1841,1020],[175,115,85],[40,220,100]]) {
  test(`Full structure fits aspect ${aspect}, bounds ${size}`,()=>{
    const bounds=new THREE.Box3(new THREE.Vector3(-size[0]/2,0,-size[2]/2),new THREE.Vector3(size[0]/2,size[1],size[2]/2));
    const camera=new THREE.PerspectiveCamera(34,aspect,.1,100000);
    const view=fitArchitectureView(THREE,camera,bounds,{id:'front',position:[300,150,450],target:[0,30,0]});
    camera.position.fromArray(view.position);camera.lookAt(new THREE.Vector3().fromArray(view.target));camera.updateMatrixWorld(true);
    for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
      const p=new THREE.Vector3(x,y,z).project(camera);
      assert.ok(Math.abs(p.x)<=.86001&&Math.abs(p.y)<=.86001,`Clipped ${p.toArray()}`);
      assert.ok(p.z>-1&&p.z<1);
    }
  });
}

test('Offset close-up bounds stay framed without fitting the entire landmark',()=>{
  const bounds=new THREE.Box3(new THREE.Vector3(-28,4,84),new THREE.Vector3(28,40,128));
  const camera=new THREE.PerspectiveCamera(34,.6,.1,100000);
  const view=fitArchitectureView(THREE,camera,bounds,{id:'detail',position:[95,65,190],target:[0,22,106]});
  assert.deepEqual(view.target,[0,22,106]);
  camera.position.fromArray(view.position);camera.lookAt(new THREE.Vector3().fromArray(view.target));camera.updateMatrixWorld(true);
  for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
    const p=new THREE.Vector3(x,y,z).project(camera);
    assert.ok(Math.abs(p.x)<=.86001&&Math.abs(p.y)<=.86001,`Clipped detail ${p.toArray()}`);
  }
});
