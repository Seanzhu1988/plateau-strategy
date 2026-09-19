const stage=document.querySelector('#stage'), start=document.querySelector('#start'), status=document.querySelector('#status');
let renderer,scene,camera,controls,THREE,center,radius,busy=false;
function render(){if(renderer)renderer.render(scene,camera);}
function resize(){if(!renderer)return;const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();render();}
function view(back=false){const direction=new THREE.Vector3(back?-1.25:1.0,.85,back?-1.6:1.7).normalize();const fov=THREE.MathUtils.degToRad(camera.fov);const angle=Math.min(fov,2*Math.atan(Math.tan(fov/2)*camera.aspect));camera.position.copy(center).addScaledVector(direction,radius/Math.sin(angle/2)*1.05);controls.target.copy(center);controls.update();render();}
function zoom(factor){if(!controls)return;const offset=camera.position.clone().sub(center);offset.multiplyScalar(factor).clampLength(controls.minDistance,controls.maxDistance);camera.position.copy(center).add(offset);controls.update();render();}
async function load(){
 if(busy||controls)return;busy=true;start.disabled=true;status.textContent='Loading the château...';
 try{
  const [three,loaderModule,orbitModule]=await Promise.all([import('three'),import('/vendor/three/GLTFLoader.js'),import('/vendor/three/OrbitControls.js')]);THREE=three;
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NeutralToneMapping;
  const abort=new AbortController();const timer=setTimeout(()=>abort.abort(),90000);let bytes;
  try{const response=await fetch('/quebec-assets/frontenac-autumn-v4.glb',{signal:abort.signal});if(!response.ok)throw Error('Model unavailable');bytes=await response.arrayBuffer();}finally{clearTimeout(timer);}
  const gltf=await new loaderModule.GLTFLoader().parseAsync(bytes,'/quebec-assets/');
  scene=new THREE.Scene();scene.background=new THREE.Color('#dce7eb');
  const remove=[];gltf.scene.traverse(o=>{if(o.isLight||o.isCamera)remove.push(o);});remove.forEach(o=>o.removeFromParent());scene.add(gltf.scene);
  const box=new THREE.Box3().setFromObject(gltf.scene);center=box.getCenter(new THREE.Vector3());radius=box.getBoundingSphere(new THREE.Sphere()).radius;
  scene.add(new THREE.HemisphereLight(0xdcecff,0x716451,2.1));const sun=new THREE.DirectionalLight(0xffefdc,3.1);sun.position.set(-100,180,150);scene.add(sun);
  camera=new THREE.PerspectiveCamera(38,stage.clientWidth/stage.clientHeight,.1,radius*30);
  controls=new orbitModule.OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.minDistance=radius*.5;controls.maxDistance=radius*10;controls.maxPolarAngle=Math.PI*.49;controls.addEventListener('change',render);
  renderer.domElement.setAttribute('aria-hidden','true');stage.append(renderer.domElement);resize();view();
  stage.dataset.ready='true';document.querySelector('#poster').hidden=true;document.querySelectorAll('.controls button').forEach(b=>b.disabled=false);status.textContent='Ready to explore. Drag to turn the château.';
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();status.textContent='The 3D view stopped. Reload the page to try again.';document.querySelector('#poster').hidden=false;renderer.domElement.hidden=true;document.querySelectorAll('.controls button').forEach(b=>b.disabled=true);});
  stage.focus();new ResizeObserver(resize).observe(stage);
 }catch(error){if(renderer){renderer.dispose();renderer=null;}status.textContent='The interactive view could not load. The preview is still available; please try again.';start.textContent='Try 3D again';start.disabled=false;}
 finally{busy=false;}
}
start.addEventListener('click',load);
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view==='back')));
document.querySelector('#reset').addEventListener('click',()=>view());
document.querySelector('#zoom-in').addEventListener('click',()=>zoom(.8));document.querySelector('#zoom-out').addEventListener('click',()=>zoom(1.25));
document.querySelector('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.querySelector('.viewer').requestFullscreen)await document.querySelector('.viewer').requestFullscreen();else status.textContent='Full screen is not available in this browser.';}catch{status.textContent='Full screen is not available in this browser.';}});
stage.addEventListener('keydown',e=>{if(!controls)return;const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'];if(!keys.includes(e.key))return;e.preventDefault();if(['+','='].includes(e.key))return zoom(.85);if(e.key==='-')return zoom(1.18);const sphere=new THREE.Spherical().setFromVector3(camera.position.clone().sub(center));if(e.key==='ArrowLeft')sphere.theta-=.12;if(e.key==='ArrowRight')sphere.theta+=.12;if(e.key==='ArrowUp')sphere.phi=Math.max(.12,sphere.phi-.12);if(e.key==='ArrowDown')sphere.phi=Math.min(Math.PI*.49,sphere.phi+.12);camera.position.copy(center).add(new THREE.Vector3().setFromSpherical(sphere));controls.update();render();});
