import * as THREE from 'three';
import { OrbitControls } from './vendor/three/OrbitControls.js';
import { buildWorldTradeCenter } from './architecture-wtc.js';
import { buildBostonLandmark, installBostonGeometryHelpers } from './architecture-boston.js';
import { fitArchitectureView } from './architecture-camera.js';
import { createArchitectureAssetLoader, shouldDisposeArchitecturePage } from './architecture-assets.js';
import { architectureViewURL } from './architecture-navigation.js';

const stage = document.querySelector('#stage');
const loading = document.querySelector('#loading');
const status = document.querySelector('#status');
const select = document.querySelector('#landmark');
const publicView = document.body.dataset.mode === 'public';
const names = {
  'world-trade-center':'World Trade Center & 9/11 Memorial',
  'state-house':'Massachusetts State House','park-street':'Park Street Church',
  'old-south':'Old South Meeting House','old-state-house':'Old State House',
  'faneuil-hall':'Faneuil Hall','paul-revere':'Paul Revere House',
  'old-north':'Old North Church',constitution:'USS Constitution','bunker-hill':'Bunker Hill Monument'
};
const descriptions = {
  'world-trade-center':'The faceted glass tower and the two reflecting pools. Switch between the skyline and a closer view of the memorial.',
  'state-house':'Bulfinch’s brick facade, classical portico and gilded dome.',
  'park-street':'A brick church crowned by Peter Banner’s layered white steeple.',
  'old-south':'The brick meeting house, arched windows and copper-topped steeple.',
  'old-state-house':'The balcony, stepped gables and cupola at the heart of colonial Boston.',
  'faneuil-hall':'The market hall’s brick arcades, fanlights and grasshopper weathervane.',
  'paul-revere':'The timber house, projecting upper story and steep roof in the North End.',
  'old-north':'The brick body and layered white tower of the church of the two lanterns.',
  constitution:'The frigate’s curved hull, gun ports, three masts and standing rigging.',
  'bunker-hill':'A tapered Quincy granite obelisk, rising 221 feet above its base.'
};
let renderer, scene, camera, controls, sun, active = null, defaultView, pending = 0;
let activeKey = null, activePresetId = null, userMoved = false;
let disposed = false, animation = 0, intersecting = true;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const materials = new Map();
const textures = new Map();
const shared = new Set();

function noise(seed) {
  let n = seed;
  return () => { n = (Math.imul(n,1664525) + 1013904223) >>> 0; return n / 4294967296; };
}
function surface(kind) {
  if (textures.has(kind)) return textures.get(kind);
  const canvas = document.createElement('canvas'); canvas.width=canvas.height=512;
  const ctx = canvas.getContext('2d'); const random = noise(419);
  ctx.fillStyle = '#d7d7d7'; ctx.fillRect(0,0,512,512);
  if (kind === 'brick') {
    ctx.fillStyle='#949494'; ctx.fillRect(0,0,512,512);
    const bh=64,bw=192;
    for(let row=0;row<8;row++) for(let col=-1;col<4;col++) {
      const shade=180+Math.floor(random()*54); ctx.fillStyle=`rgb(${shade},${shade},${shade})`;
      ctx.fillRect(col*bw+(row%2)*bw/2+3,row*bh+3,bw-6,bh-6);
    }
  } else if(kind==='slate') {
    for(let row=0;row<8;row++) for(let col=-1;col<9;col++) {
      const shade=158+Math.floor(random()*69);ctx.fillStyle=`rgb(${shade},${shade},${shade})`;
      ctx.fillRect(col*64+(row%2)*32,row*64,62,61);
    }
  } else if(kind==='wood') {
    for(let row=0;row<16;row++) {
      ctx.fillStyle=row%2?'#c8c8c8':'#e1e1e1';ctx.fillRect(0,row*32,512,30);
      ctx.strokeStyle='#999';ctx.beginPath();ctx.moveTo(0,row*32+30);ctx.lineTo(512,row*32+30);ctx.stroke();
    }
  }
  const data=ctx.getImageData(0,0,512,512);
  for(let i=0;i<data.data.length;i+=4) {
    const n=(random()-.5)*24;
    for(let c=0;c<3;c++) data.data[i+c]=Math.max(0,Math.min(255,data.data[i+c]+n));
  }
  ctx.putImageData(data,0,0);
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
  map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  // UV coordinates supplied by the converter are feet, not a whole facade.
  map.repeat.set(kind==='brick'?.38:kind==='wood'?.15:.22,kind==='brick'?.38:kind==='wood'?.15:.22);
  textures.set(kind,map);return map;
}
function materialFor(value) {
  const key=String(value || '#aaa'); if(materials.has(key))return materials.get(key);
  const color=new THREE.Color(key);const rgb=color.clone().convertLinearToSRGB();
  const {r,g,b}=rgb;let roughness=.84,metalness=0,kind='stone';
  if(r>g*1.25 && r>b*1.3 && r>.32){kind='brick';roughness=.91;}
  else if(r>.48 && g>.35 && b<g*.68){kind=null;roughness=.29;metalness=.72;}
  else if(b>r*1.09 && b>g*.99){kind=null;roughness=.21;metalness=.25;}
  else if(Math.max(r,g,b)<.37){kind='slate';roughness=.76;}
  else if(r>g*1.08 && g>b*1.1 && r<.58){kind='wood';roughness=.87;}
  const mat=new THREE.MeshStandardMaterial({color,roughness,metalness,side:THREE.DoubleSide,
    map:kind?surface(kind):null,bumpMap:kind?surface(kind):null,bumpScale:kind==='brick'?.07:.035});
  // Unshaded source colors are lit only once, here in real three-dimensional space.
  mat.name=key;materials.set(key,mat);shared.add(mat);return mat;
}
function makeEnvironment() {
  const envScene=new THREE.Scene();
  const sky=new THREE.Mesh(new THREE.SphereGeometry(1800,32,16),new THREE.ShaderMaterial({
    side:THREE.BackSide,uniforms:{},vertexShader:'varying vec3 v; void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec3 v; void main(){float h=normalize(v).y;vec3 horizon=vec3(.76,.84,.90);vec3 zenith=vec3(.25,.46,.69);vec3 ground=vec3(.24,.27,.28);vec3 c=h>0.?mix(horizon,zenith,pow(h,.5)):mix(horizon,ground,min(1.,-h*5.));gl_FragColor=vec4(c,1.);}'
  }));envScene.add(sky);
  const skyLight=new THREE.Mesh(new THREE.PlaneGeometry(600,250),new THREE.MeshBasicMaterial({color:new THREE.Color(5.5,5.1,4.6)}));
  skyLight.position.set(-500,700,700);skyLight.lookAt(0,0,0);envScene.add(skyLight);
  const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(envScene,.08,.1,2500);
  scene.environment=env.texture;scene.environmentIntensity=.8;
  pmrem.dispose();sky.geometry.dispose();sky.material.dispose();skyLight.geometry.dispose();skyLight.material.dispose();
  return env;
}
function draw(){if(renderer&&!disposed){renderer.render(scene,camera);}}
function resize(){if(!renderer)return;const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;
  renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  if(active)updateDetails(active,activeKey,activePresetId,userMoved);draw();}
function applyView(view) {
  if(!view)return;camera.position.fromArray(view.position);controls.target.fromArray(view.target);
  camera.lookAt(controls.target);controls.update();draw();
}
function genericViews(group) {
  const bb=new THREE.Box3().setFromObject(group),size=bb.getSize(new THREE.Vector3()),center=bb.getCenter(new THREE.Vector3());
  // Use a sphere fit against the smaller field of view so phones never crop spires.
  const radius=size.length()/2;
  const vertical=THREE.MathUtils.degToRad(camera.fov);
  const limiting=Math.min(vertical,2*Math.atan(Math.tan(vertical/2)*camera.aspect));
  const distance=radius/Math.sin(limiting/2)*1.02;
  const target=[center.x,center.y,center.z];
  function from(id,label,x,y,z){const d=new THREE.Vector3(x,y,z).normalize().multiplyScalar(distance).add(center);return{id,label,position:d.toArray(),target};}
  return [from('front','Front',.75,.4,1.15),from('street','Street view',.08,.12,1.6),from('rear','Other side',-.8,.42,-1.1),from('roof','Roof details',.7,1.45,.9)];
}
function releaseModel(model) {
  if(!model)return;
  const mats=new Set(),geos=new Set();model.group.traverse(o=>{if(o.geometry)geos.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>mats.add(m));});
  geos.forEach(g=>g.dispose());mats.forEach(m=>{if(!shared.has(m)){for(const v of Object.values(m)){if(v?.isTexture&&!Array.from(textures.values()).includes(v))v.dispose();}m.dispose();}});
  if(typeof model.dispose==='function')model.dispose();scene.remove(model.group);
}
function updateDetails(model,key,selectedId=null,preserveOrbit=false) {
  document.querySelector('#model-title').textContent=model.title||names[key];
  document.querySelector('#model-description').textContent=publicView?'':descriptions[key];
  document.querySelector('#notes').textContent=publicView?'':(Array.isArray(model.notes)?model.notes.join(' '):model.notes||'See the source record for measured and derived detail.');
  const sources=document.querySelector('#sources');sources.replaceChildren();
  (publicView?[]:(model.sources||[])).forEach(source=>{const li=document.createElement('li'),a=document.createElement('a');
    const url=typeof source==='string'?source:source.url;
    if(!url||!/^https:\/\//.test(url))return;
    a.href=url;a.textContent=typeof source==='string'?new URL(url).hostname:(source.label||source.title||new URL(url).hostname);a.target='_blank';a.rel='noopener noreferrer';li.append(a);sources.append(li);
  });
  const views=document.querySelector('#views');views.replaceChildren();
  let presets=model.views?.length?model.views:genericViews(model.group);
  // Only full-building views use automatic fitting. The memorial close-ups
  // intentionally omit the top of the tower and must not be zoomed out to it.
  if(key!=='world-trade-center') {
    const bounds=model.bounds||new THREE.Box3().setFromObject(model.group);
    presets=presets.map(v=>fitArchitectureView(THREE,camera,v.bounds||bounds,v));
  } else {
    presets=presets.map((v,i)=>{
      if(i===0)return fitArchitectureView(THREE,camera,new THREE.Box3().setFromObject(model.group),v);
      if(v.id==='facade')return fitArchitectureView(THREE,camera,new THREE.Box3(new THREE.Vector3(-253,1050,-408),new THREE.Vector3(-37,1776,-192)),v);
      if(camera.aspect>=1.25)return v;
      const t=new THREE.Vector3().fromArray(v.target),p=new THREE.Vector3().fromArray(v.position).sub(t).multiplyScalar(1.25/camera.aspect).add(t);
      return {...v,position:p.toArray()};
    });
  }
  defaultView=presets[0];const chosen=presets.find(v=>v.id===selectedId)||defaultView;activePresetId=chosen.id;
  presets.forEach(v=>{const b=document.createElement('button');b.textContent=v.label;b.setAttribute('aria-pressed',String(v===chosen));b.onclick=()=>{views.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');activePresetId=v.id;userMoved=false;applyView(v);history.replaceState(null,'',architectureViewURL(location.href,key,v.id));document.dispatchEvent(new CustomEvent('architecture:view'));};views.append(b);});
  if(!preserveOrbit)applyView(chosen);
  const counts={meshes:0,triangles:0};model.group.traverse(o=>{if(o.isMesh){counts.meshes++;counts.triangles+=(o.geometry.index?.count||o.geometry.attributes.position?.count||0)/3*(o.isInstancedMesh?o.count:1);}});
  document.querySelector('#geometry').textContent=publicView?'':`${counts.meshes.toLocaleString()} mesh groups. ${Math.round(counts.triangles).toLocaleString()} triangles. Real-time lighting and shadows. Model dimensions use feet.`;
  document.dispatchEvent(new CustomEvent('architecture:change',{detail:{key}}));
}
async function show(key,initialView=null) {
  const token=++pending;loading.hidden=false;loading.textContent=publicView?'Opening the 3D view...':'Building the view...';status.textContent='';stage.dataset.status='loading';
  await new Promise(resolve=>requestAnimationFrame(resolve));
  try{
    if(key!=='world-trade-center')await ensureForm(key);
    if(token!==pending)return;
    const kit={THREE,materialFor};
    const next=key==='world-trade-center'?buildWorldTradeCenter(THREE,kit):buildBostonLandmark(THREE,key,kit);
    if(token!==pending)return;
    releaseModel(active);active=next;activeKey=key;activePresetId=null;userMoved=false;scene.add(active.group);
    const bb=new THREE.Box3().setFromObject(active.group),s=bb.getSize(new THREE.Vector3()),c=bb.getCenter(new THREE.Vector3());
    const extent=Math.max(s.x,s.y,s.z),r=extent*.8;
    camera.near=Math.max(.1,extent/10000);camera.far=extent*30;camera.updateProjectionMatrix();
    controls.minDistance=extent*.045;controls.maxDistance=extent*12;
    sun.position.set(c.x-extent*.7,c.y+extent*1.4,c.z+extent*.85);sun.target.position.copy(c);
    Object.assign(sun.shadow.camera,{left:-r,right:r,top:r,bottom:-r,near:1,far:extent*5});sun.shadow.camera.updateProjectionMatrix();
    sun.shadow.normalBias=Math.max(.015,extent*.00015);sun.shadow.bias=-.000035;
    updateDetails(active,key,initialView);loading.hidden=true;
    stage.dataset.status='ready';status.textContent=publicView?'':'Private architectural reconstruction. Not a photographic scan.';
    history.replaceState(null,'',architectureViewURL(location.href,key,activePresetId));document.dispatchEvent(new CustomEvent('architecture:view'));draw();
  }catch(error){if(token!==pending)return;stage.dataset.status='error';loading.hidden=false;loading.textContent='This model could not load. Try another model or reload this page.';status.textContent=publicView?'':error.message;document.dispatchEvent(new CustomEvent('architecture:error'));console.error(error);}
}
const ensureForm=createArchitectureAssetLoader(key=>new Promise((resolve,reject)=>{
  if(!window.TRAIL3D){reject(new Error('The Boston model helper could not load. Reload this page to retry.'));return;}
  installBostonGeometryHelpers(window.TRAIL3D);
  const script=document.createElement('script');script.src=`/trail-form-${key}.js`;
  const finish=(error)=>{clearTimeout(timer);script.onload=script.onerror=null;if(error){script.remove();reject(error);}else resolve();};
  const timer=setTimeout(()=>finish(new Error(`Loading ${names[key]} timed out. Choose another model, then retry.`)),15000);
  script.onload=()=>finish(window.TRAIL_FORMS?.[key]?null:new Error(`The ${names[key]} model did not register.`));
  script.onerror=()=>finish(new Error(`Could not load ${names[key]}. Choose another model, then retry.`));document.head.append(script);
}),Object.keys(names).filter(k=>k!=='world-trade-center'));
async function init(){
  try{
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-label','Interactive 3D architectural reconstruction');
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();stage.dataset.status='error';status.textContent='3D graphics paused. Reload this page to restore the view.';document.dispatchEvent(new CustomEvent('architecture:error'));});
    stage.prepend(renderer.domElement);scene=new THREE.Scene();scene.background=new THREE.Color('#e8edf0');
    camera=new THREE.PerspectiveCamera(34,1,.1,50000);
    controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.maxPolarAngle=Math.PI*.49;controls.minPolarAngle=.045;controls.enablePan=true;controls.screenSpacePanning=true;
    controls.addEventListener('change',draw);controls.addEventListener('start',()=>{userMoved=true;});scene.add(new THREE.HemisphereLight('#dae8fa','#8b8272',1.9));
    sun=new THREE.DirectionalLight('#fff2df',3.0);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun,sun.target);
    const fill=new THREE.DirectionalLight('#bdd8f1',.65);fill.position.set(-500,200,-700);scene.add(fill);
    makeEnvironment();new ResizeObserver(resize).observe(stage);resize();
    const requested=new URLSearchParams(location.search).get('model');select.value=Object.hasOwn(names,requested)?requested:'world-trade-center';
    select.addEventListener('change',()=>show(select.value));
    document.querySelector('#reset').onclick=()=>{if(!defaultView||!activeKey)return;document.querySelectorAll('#views button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));activePresetId=defaultView.id;userMoved=false;applyView(defaultView);history.replaceState(null,'',architectureViewURL(location.href,activeKey,defaultView.id));document.dispatchEvent(new CustomEvent('architecture:view'));};
    const zoom=factor=>{userMoved=true;camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target);controls.update();draw();};
    document.querySelector('#zoom-in').onclick=()=>zoom(.8);document.querySelector('#zoom-out').onclick=()=>zoom(1.25);
    document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.model-view').requestFullscreen();}catch{status.textContent='Full screen is not supported here. Use pinch to zoom.';}};
    new IntersectionObserver(entries=>{intersecting=entries[0].isIntersecting;},{threshold:0}).observe(stage);
    let last=0;function frame(t){if(disposed)return;animation=requestAnimationFrame(frame);if(active?.animate&&!reduceMotion.matches&&!document.hidden&&intersecting&&t-last>50){active.animate(t/1000);draw();last=t;}}animation=requestAnimationFrame(frame);
    window.addEventListener('pagehide',event=>{cancelAnimationFrame(animation);if(!shouldDisposeArchitecturePage(event))return;disposed=true;controls.dispose();releaseModel(active);renderer.dispose();});
    window.addEventListener('pageshow',event=>{if(event.persisted&&!disposed){resize();cancelAnimationFrame(animation);animation=requestAnimationFrame(frame);}});
    await show(select.value,new URLSearchParams(location.search).get('view'));
  }catch(error){stage.dataset.status='error';loading.hidden=false;loading.textContent='The 3D view needs WebGL graphics. Please try a recent browser with graphics acceleration enabled.';status.textContent=publicView?'':error.message;document.dispatchEvent(new CustomEvent('architecture:error'));console.error(error);}
}
init();
