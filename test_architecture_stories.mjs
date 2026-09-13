import test from 'node:test';
import assert from 'node:assert/strict';
import {ARCHITECTURE_STORIES} from './architecture-stories.js';
import {BOSTON_LANDMARKS} from './architecture-boston.js';
import {architectureViewURL,architectureLanguage} from './architecture-navigation.js';

test('Every approved model has aligned bilingual visitor stories',()=>{
  for(const key of ['world-trade-center',...Object.keys(BOSTON_LANDMARKS),'peace-fountain']){
    const story=ARCHITECTURE_STORIES[key];assert.ok(story,key);
    for(const lang of ['en','zh']){
      assert.ok(story[lang].title);assert.ok(story[lang].paragraphs.length>=2);
      assert.ok(story[lang].lookFor.length>=2);
      const copy=JSON.stringify(story[lang]);
      assert.doesNotMatch(copy,/[\u2013\u2014]/);
      assert.doesNotMatch(copy,/private realism|invented geometry|procedural|review score|scan or sculpt/i);
    }
    assert.ok(story.sources.length);assert.ok(story.sources.every(s=>s.label&&s.url.startsWith('https://')));
  }
});
test('Camera changes preserve embedding, language, stop and referring context',()=>{
  const result=architectureViewURL('https://example.test/architecture?model=state-house&embed=1&lang=zh&source=freedom-trail&stop=2#story','old-state-house','street');
  const url=new URL(result,'https://example.test');
  assert.equal(url.searchParams.get('model'),'old-state-house');assert.equal(url.searchParams.get('view'),'street');
  assert.equal(url.searchParams.get('embed'),'1');assert.equal(url.searchParams.get('lang'),'zh');
  assert.equal(url.searchParams.get('source'),'freedom-trail');assert.equal(url.hash,'#story');
});
test('Unsupported languages fall back to existing English instead of missing stories',()=>{
  for(const value of ['zh','zh-CN','zh-Hans'])assert.equal(architectureLanguage(value),'zh');
  for(const value of ['en','es','ko',undefined,'__proto__'])assert.equal(architectureLanguage(value),'en');
});
