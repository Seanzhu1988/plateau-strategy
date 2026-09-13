export function architectureViewURL(href, model, view) {
  const url = new URL(href);
  url.searchParams.set('model', model);
  url.searchParams.set('view', view);
  return url.pathname + url.search + url.hash;
}

export function architectureLanguage(value) {
  return /^zh(?:-|$)/i.test(String(value || '')) ? 'zh' : 'en';
}
