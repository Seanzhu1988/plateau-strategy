// Fit an architectural bounding box without stretching the building or
// letting an authored camera crop its spire on a different screen shape.
export function fitArchitectureView(THREE, camera, bounds, view, margin=.86) {
  const target=bounds.getCenter(new THREE.Vector3());
  const direction=new THREE.Vector3().fromArray(view.position)
    .sub(new THREE.Vector3().fromArray(view.target)).normalize();
  const corners=[];
  for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])corners.push(new THREE.Vector3(x,y,z));
  const probe=camera.clone();probe.updateProjectionMatrix();
  const size=bounds.getSize(new THREE.Vector3()).length();
  function fits(distance){
    probe.position.copy(target).addScaledVector(direction,distance);probe.lookAt(target);probe.updateMatrixWorld(true);
    return corners.every(c=>{const p=c.clone().project(probe);return Math.abs(p.x)<=margin&&Math.abs(p.y)<=margin&&p.z>-1&&p.z<1;});
  }
  let lo=Math.max(camera.near*2,size*.05),hi=Math.max(size*12,lo*2);
  for(let i=0;i<10&&!fits(hi);i++)hi*=2;
  for(let i=0;i<32;i++){const mid=(lo+hi)/2;if(fits(mid))hi=mid;else lo=mid;}
  return {...view,target:target.toArray(),position:target.clone().addScaledVector(direction,hi).toArray()};
}
