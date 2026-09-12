import test from 'node:test';
import assert from 'node:assert/strict';
import {createArchitectureAssetLoader,shouldDisposeArchitecturePage} from './architecture-assets.js';
test('Only selected assets load, and loaded forms are reused',async()=>{
  const calls=[];const load=createArchitectureAssetLoader(async key=>calls.push(key),['a','b']);
  await Promise.all([load('a'),load('a')]);assert.deepEqual(calls,['a']);
  await load('a');assert.deepEqual(calls,['a']);
});
test('One unavailable model cannot prevent another from loading',async()=>{
  const load=createArchitectureAssetLoader(async key=>{if(key==='a')throw Error('Unavailable');return key;},['a','b']);
  await assert.rejects(load('a'));assert.equal(await load('b'),'b');
});
test('A failed model can be deliberately retried',async()=>{
  let attempts=0;const load=createArchitectureAssetLoader(async()=>{if(++attempts===1)throw Error('Offline');return 'Ready';},['a']);
  await assert.rejects(load('a'));assert.equal(await load('a'),'Ready');assert.equal(attempts,2);
});
test('Unknown model assets are never requested',async()=>{
  let called=false;const load=createArchitectureAssetLoader(()=>{called=true;},['a']);
  await assert.rejects(load('../app.py'));await assert.rejects(load('__proto__'));assert.equal(called,false);
});
test('Back-forward cache preserves live graphics resources',()=>{
  assert.equal(shouldDisposeArchitecturePage({persisted:true}),false);
  assert.equal(shouldDisposeArchitecturePage({persisted:false}),true);
});
