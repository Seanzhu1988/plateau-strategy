import {architectureLanguage} from './architecture-navigation.js';

const contextNode=document.querySelector('#architecture-context');
let context={models:{}};
try{context=JSON.parse(contextNode?.textContent||'{}');}catch{}
const query=new URLSearchParams(location.search);
const embedded=query.get('embed')==='1';
if(embedded)document.body.classList.add('architecture-embed');
let language=architectureLanguage(query.get('lang'));
let key=query.get('model')||'world-trade-center';
let stories={},photoIndex=0,heightFrame=0;
const select=document.querySelector('#landmark');
const zhNames={
  'world-trade-center':'世界贸易中心一号楼与九一一纪念园','state-house':'马萨诸塞州议会大厦',
  'park-street':'公园街教堂','old-south':'老南聚会所','old-state-house':'老州议会大厦',
  'faneuil-hall':'法尼尔厅','paul-revere':'保罗·里维尔故居','old-north':'老北教堂',
  constitution:'宪法号战舰','bunker-hill':'邦克山纪念碑'
};
const labels={
  'Street view':'街景','Other side':'另一侧','Above':'俯瞰','Whole tower':'整座大楼',
  'Glass and spire':'玻璃幕墙与尖塔','Memorial pools':'纪念水池','Waterfall detail':'瀑布细节',
  'Above the plaza':'广场俯瞰','Stern details':'船尾细节'
};
const englishLabels=new WeakMap();
const text=(en,zh)=>language==='zh'?zh:en;
function setText(selector,value){const node=document.querySelector(selector);if(node)node.textContent=value;}
function currentName(){return language==='zh'?(zhNames[key]||context.models[key]?.name):context.models[key]?.name;}
function pageLink(model,view){const url=new URL('/architecture',location.origin);url.searchParams.set('model',model);url.searchParams.set('lang',language);if(view)url.searchParams.set('view',view);return url.pathname+url.search;}
function notifyHeight(){
  if(!embedded||window.parent===window)return;
  cancelAnimationFrame(heightFrame);
  heightFrame=requestAnimationFrame(()=>window.parent.postMessage({type:'architecture:height',height:Math.min(4000,Math.max(400,Math.ceil(document.querySelector('main').getBoundingClientRect().height)+24))},location.origin));
}
function localizeControls(){
  document.documentElement.lang=language;
  setText('label[for="landmark"]',text('Explore a destination','选择目的地'));
  setText('.intro h1',text('Every landmark has a story.','每座地标都有自己的故事。'));
  setText('.intro p',text('Look closer. Discover the people who made it.','走近一点，认识建造它的人。'));
  setText('#model-instructions',text('Drag to turn. Pinch to zoom.','拖动旋转，双指缩放。'));
  setText('#reset',text('Reset view','重置视角'));setText('#fullscreen',text('Full screen','全屏'));
  setText('.illustration-label',text('3D architectural illustration','建筑三维示意'));
  setText('#look-title',text('Look for','值得留意'));
  setText('#story-sources-title',text('Sources','资料来源'));
  setText('#full-model-link',text('Open the full 3D view','打开完整三维视图'));
  document.querySelector('#zoom-in').setAttribute('aria-label',text('Zoom in','放大'));
  document.querySelector('#zoom-out').setAttribute('aria-label',text('Zoom out','缩小'));
  if(currentName())setText('#model-title',currentName());
  for(const option of select.options){if(!englishLabels.has(option))englishLabels.set(option,option.textContent);option.textContent=language==='zh'?(zhNames[option.value]||englishLabels.get(option)):englishLabels.get(option);}
  for(const button of document.querySelectorAll('#views button')){if(!englishLabels.has(button))englishLabels.set(button,button.textContent);const en=englishLabels.get(button);button.textContent=language==='zh'?(labels[en]||en):en;}
  for(const button of document.querySelectorAll('[data-story-language]'))button.setAttribute('aria-pressed',String(button.dataset.storyLanguage===language));
  const destination=context.models[key]?.destinationHref||'/tours';
  const link=new URL(destination,location.origin);link.searchParams.set('lang',language);
  const destinationLink=document.querySelector('#destination-link');destinationLink.href=link.pathname+link.search+link.hash;
  destinationLink.textContent=key==='world-trade-center'?text('Visit the memorial page','查看纪念园介绍'):text('Explore the Freedom Trail','探索自由之路');
  document.querySelector('#full-model-link').href=pageLink(key,new URLSearchParams(location.search).get('view'));
}
function renderStory(){
  localizeControls();
  const entry=stories[key],story=entry?.[language]||entry?.en;
  if(!story){notifyHeight();return;}
  setText('#story-title',story.title);
  const paragraphs=document.querySelector('#story-paragraphs');paragraphs.replaceChildren();
  for(const value of story.paragraphs){const p=document.createElement('p');p.textContent=value;paragraphs.append(p);}
  const look=document.querySelector('#story-look');look.replaceChildren();
  for(const value of story.lookFor||[]){const li=document.createElement('li');li.textContent=value;look.append(li);}
  const sources=document.querySelector('#story-sources');sources.replaceChildren();
  for(const source of entry.sources||[]){if(!/^https:\/\//.test(source.url||''))continue;const li=document.createElement('li'),a=document.createElement('a');a.href=source.url;a.textContent=source.label;a.target='_blank';a.rel='noopener noreferrer';li.append(a);sources.append(li);}
  document.querySelector('#architecture-story').lang=language;
  notifyHeight();
}
function loadFallbackPhoto(){
  const item=context.models[key],photo=item?.photos?.[photoIndex];
  const img=document.querySelector('#model-photo'),figure=document.querySelector('#model-fallback');
  if(!photo){figure.hidden=true;return;}
  img.alt=currentName()||item.name;img.src=photo;
  const credit=document.querySelector('#photo-credit');
  credit.href=item.photoSource||photo;credit.textContent=item.photoCredit||text('Photo source','照片来源');
  setText('#photo-caption',text('Destination photograph','目的地实景照片'));figure.hidden=false;
}
function showUnavailable(){
  document.querySelector('.model-view').classList.add('model-unavailable');
  setText('#status',text('The 3D view is unavailable on this device. Explore the place and its story below.','此设备暂时无法显示三维视图，您仍可查看目的地和故事。'));
  photoIndex=0;loadFallbackPhoto();notifyHeight();
}
document.querySelector('#model-photo').addEventListener('error',()=>{photoIndex++;loadFallbackPhoto();notifyHeight();});
document.querySelector('#model-photo').addEventListener('load',notifyHeight);
select.addEventListener('change',()=>{key=select.value;renderStory();if(document.querySelector('.model-view').classList.contains('model-unavailable')){photoIndex=0;loadFallbackPhoto();}});
document.addEventListener('architecture:change',event=>{
  key=event.detail.key;document.querySelector('.model-view').classList.remove('model-unavailable');document.querySelector('#model-fallback').hidden=true;renderStory();
});
document.addEventListener('architecture:error',showUnavailable);
document.addEventListener('architecture:view',()=>{document.querySelector('#full-model-link').href=pageLink(key,new URLSearchParams(location.search).get('view'));});
for(const button of document.querySelectorAll('[data-story-language]'))button.addEventListener('click',()=>{
  language=button.dataset.storyLanguage;const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url.pathname+url.search);renderStory();
  if(document.querySelector('.model-view').classList.contains('model-unavailable'))showUnavailable();
});
document.querySelector('#model-description').hidden=true;
new ResizeObserver(notifyHeight).observe(document.querySelector('main'));
renderStory();
if(document.querySelector('#stage').dataset.status==='error')showUnavailable();
import('./architecture-stories.js').then(module=>{stories=module.ARCHITECTURE_STORIES;renderStory();}).catch(()=>{
  setText('#story-paragraphs',text('Read more about this destination using the link below.','请通过下方链接继续阅读目的地故事。'));notifyHeight();
});
