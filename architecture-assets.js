// Only the selected Boston form needs to load. Failed requests are removed
// from the cache so a deliberate retry can recover without reloading the page.
export function createArchitectureAssetLoader(loadOne, supportedKeys) {
  const keys=new Set(supportedKeys),loads=new Map();
  return function ensure(key) {
    if(!keys.has(key))return Promise.reject(new Error('Unknown landmark asset'));
    if(loads.has(key))return loads.get(key);
    const promise=Promise.resolve().then(()=>loadOne(key)).catch(error=>{loads.delete(key);throw error;});
    loads.set(key,promise);return promise;
  };
}

export function shouldDisposeArchitecturePage(event) {
  return !event.persisted;
}
