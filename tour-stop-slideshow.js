/* Reusable, manual-only stop photographs. No fetching, audio, or publication.
 * mountStopSlideshow(host, normalizedPhotos, {name, language?, showRightsNote?}) owns host's
 * children until destroy(). Import the accompanying CSS once per page.
 */
const MOUNTS = new WeakMap();
// Historical seed arrays mix destination photographs with other subjects.
// These exclusions affect legacy fallback only, never reviewed photo_details.
const NO_LEGACY_STOP_PHOTOS = new Set(["National Gallery of Art", "Boston Latin School site", "Boston Massacre Site"]);
const LEGACY_STOP_PHOTO_INDEXES = {
  "Massachusetts State House": [0], "Park Street Church": [0, 1, 3],
  "King's Chapel": [0, 2, 3], "Old State House": [0, 3],
  "Faneuil Hall": [0, 1, 2], "USS Constitution": [0],
  "Bunker Hill Monument": [0, 2, 3], "National Museum of Natural History": [3],
  "National Museum of African American History and Culture": [1, 2, 3],
  "Vietnam Veterans Memorial": [1, 2, 3]
};

function safeURL(value, source = false) {
  if (typeof value !== "string" || !value.trim()) return "";
  const raw = value.trim();
  if (/[\u0000-\u001f\\]/.test(raw) || /\.svg(?:[?#]|$)/i.test(raw)) return "";
  // Stale catalogues must not resurrect retired visitor photographs. Decode
  // repeated URL encoding before checking the normalized path, not just src.
  try {
    let decoded = raw;
    for (let i = 0; i < 8; i++) { const next = decodeURIComponent(decoded); if (next === decoded) break; decoded = next; }
    if (decodeURIComponent(decoded) !== decoded) return "";
    if (/[\u0000-\u001f]/.test(decoded) || /\.svg(?:[?#]|$)/i.test(decoded)) return "";
    const candidate = decoded.replace(/\\/g, "/").replace(/^\/+/g, "/");
    const pathname = new URL(candidate, "https://slideshow.invalid").pathname.replace(/\/+/g, "/");
    if (/(?:^|\/)(?:api\/gallery\/photos|gallery_photos)(?:\/|$)/i.test(pathname)) return "";
  } catch { return ""; }
  if (!source && /^\/(?!\/)/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    return !url.username && !url.password && url.protocol === "https:" ? url.href : "";
  } catch { return ""; }
}

// The API's reviewed metadata wins. On older catalogues, keep the matching
// Destination Book entry first and fall back only to this exact stop.
export function stopPhotosFor(stop, entry = null) {
  function normalize(raw) {
    const photo = typeof raw === "string" ? { src: raw } : raw;
    let src = safeURL(photo?.src); if (!src) return null;
    let sourceUrl = safeURL(photo.sourceUrl || photo.source, true);
    try {
      const url = new URL(src);
      if (url.hostname === "commons.wikimedia.org" && url.pathname.includes("Special:FilePath/")) {
        const file = decodeURIComponent(url.pathname.split("Special:FilePath/")[1]);
        sourceUrl ||= `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;
        url.searchParams.set("width", "960"); src = url.href;
      } else if (url.hostname === "upload.wikimedia.org") {
        const parts = url.pathname.split("/");
        const file = decodeURIComponent(url.pathname.includes("/thumb/") ? parts.at(-2) : parts.at(-1));
        sourceUrl ||= `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;
      }
    } catch {}
    return { ...photo, src, sourceUrl, licenseUrl: safeURL(photo.licenseUrl, true), rightsNote: String(photo.rightsNote || ""), alt: String(photo.alt || stop?.name || ""), caption: String(photo.caption || stop?.name || ""), credit: String(photo.credit || "") };
  }
  function unique(raw) {
    const seen = new Set();
    return raw.map(normalize).filter(photo => { if (!photo || seen.has(photo.src)) return false; seen.add(photo.src); return true; });
  }
  const reviewed = unique(Array.isArray(stop?.photo_details) ? stop.photo_details : []);
  if (reviewed.length) return reviewed;
  const raw = Array.isArray(stop?.photos) ? stop.photos : [];
  const selected = LEGACY_STOP_PHOTO_INDEXES[stop?.name];
  const legacy = NO_LEGACY_STOP_PHOTOS.has(stop?.name) ? [] : [stop?.photo, ...(selected ? selected.map(i => raw[i]) : raw)];
  return unique([entry?.photo, ...(Array.isArray(entry?.photos) ? entry.photos : []), ...legacy]);
}

export function mountStopSlideshow(host, photos, { name = "This stop", language = "en", showRightsNote = false } = {}) {
  if (!host || typeof host.replaceChildren !== "function") throw new TypeError("A slideshow host element is required");
  MOUNTS.get(host)?.destroy();
  const doc = host.ownerDocument || document;
  const zh = String(language).toLowerCase().startsWith("zh");
  const words = zh ? { photos: "照片", prev: "上一张照片", next: "下一张照片", source: "照片来源", loading: "正在加载照片…", empty: "这个站点暂时没有照片。", failed: "照片暂时无法加载。", position: (n, total) => `第 ${n} 张，共 ${total} 张` }
    : { photos: "Photographs", prev: "Previous photograph", next: "Next photograph", source: "Photo source", loading: "Loading photograph…", empty: "A photograph of this stop is not available yet.", failed: "The photographs could not load.", position: (n, total) => `Photo ${n} of ${total}` };
  const seen = new Set();
  const items = (Array.isArray(photos) ? photos : []).flatMap(photo => {
    const src = safeURL(photo?.src);
    if (!src || seen.has(src)) return [];
    seen.add(src);
    return [{ src, alt: String(photo.alt || name), caption: String(photo.caption || name), credit: String(photo.credit || ""), sourceUrl: safeURL(photo.sourceUrl, true), license: String(photo.license || ""), licenseUrl: safeURL(photo.licenseUrl, true), rightsNote: String(photo.rightsNote || "") }];
  });
  const make = (tag, cls, text) => {
    const el = doc.createElement(tag); if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text; return el;
  };
  const root = make("figure", "stop-slideshow");
  root.setAttribute("role", "group"); root.setAttribute("aria-label", `${name}: ${words.photos}`);
  const frame = make("div", "stop-slideshow-frame"); frame.tabIndex = 0;
  frame.setAttribute("aria-label", `${name}: ${words.photos}`);
  const imageHost = make("div", "stop-slideshow-image");
  const status = make("p", "stop-slideshow-status"); status.setAttribute("role", "status");
  frame.append(imageHost, status);
  const caption = make("figcaption", "stop-slideshow-caption");
  const text = make("p", "stop-slideshow-description"), attribution = make("div", "stop-slideshow-attribution");
  caption.append(text, attribution);
  const controls = make("div", "stop-slideshow-controls");
  const prev = make("button", "stop-slideshow-prev", "‹"), next = make("button", "stop-slideshow-next", "›");
  prev.type = next.type = "button";
  prev.setAttribute("aria-label", words.prev); next.setAttribute("aria-label", words.next);
  const counter = make("span", "stop-slideshow-counter"); counter.setAttribute("aria-live", "polite"); counter.setAttribute("aria-atomic", "true");
  controls.append(prev, counter, next); root.append(frame, controls, caption); host.replaceChildren(root);

  let destroyed = false, generation = 0, current = -1, activeImage = null, start = null;
  const failed = new Set(), listeners = [];
  const listen = (el, event, callback, options) => { el.addEventListener(event, callback, options); listeners.push(() => el.removeEventListener(event, callback, options)); };
  const available = () => items.map((_, i) => i).filter(i => !failed.has(i));
  function clearImage() {
    if (activeImage) { activeImage.onload = activeImage.onerror = null; activeImage.removeAttribute("src"); }
    activeImage = null; imageHost.replaceChildren();
  }
  function empty() {
    ++generation; clearImage(); frame.classList.add("is-empty");
    status.textContent = items.length ? words.failed : words.empty;
    status.hidden = false; controls.hidden = true; caption.hidden = true;
  }
  function show(index) {
    if (destroyed) return;
    const options = available();
    if (!options.length) { empty(); return; }
    current = options.includes(index) ? index : options[0];
    const item = items[current], token = ++generation;
    clearImage(); frame.classList.remove("is-empty"); caption.hidden = false;
    status.textContent = words.loading; status.hidden = false;
    counter.textContent = words.position(options.indexOf(current) + 1, options.length);
    controls.hidden = options.length < 2;
    text.textContent = item.caption;
    attribution.replaceChildren();
    if (item.credit) attribution.append(make("span", "stop-slideshow-credit", item.credit));
    if (item.license) {
      const license = make(item.licenseUrl ? "a" : "span", "stop-slideshow-license", item.license);
      if (item.licenseUrl) { license.href = item.licenseUrl; license.target = "_blank"; license.rel = "noopener noreferrer"; }
      attribution.append(license);
    }
    if (showRightsNote && item.rightsNote) attribution.append(make("span", "stop-slideshow-rights", item.rightsNote));
    if (item.sourceUrl) {
      const source = make("a", "stop-slideshow-source", words.source);
      source.href = item.sourceUrl; source.target = "_blank"; source.rel = "noopener noreferrer"; attribution.append(source);
    }
    const img = make("img"); activeImage = img;
    img.alt = item.alt; img.loading = "lazy"; img.decoding = "async"; img.draggable = false; img.referrerPolicy = "no-referrer";
    img.onload = () => { if (!destroyed && token === generation) status.hidden = true; };
    img.onerror = () => {
      if (destroyed || token !== generation) return;
      failed.add(current);
      const remaining = available(), following = remaining.find(i => i > current);
      show(following ?? remaining[0]);
    };
    imageHost.append(img); img.src = item.src;
  }
  function move(delta) {
    if (destroyed) return;
    const options = available(); if (options.length < 2) return;
    const index = options.indexOf(current);
    show(options[(index + delta + options.length) % options.length]);
  }
  listen(prev, "click", () => move(-1)); listen(next, "click", () => move(1));
  listen(root, "keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      if (available().length < 2) return;
      event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  listen(frame, "pointerdown", event => {
    if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) { start = null; return; }
    start = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }, { passive: true });
  listen(frame, "pointerup", event => {
    const first = start; start = null;
    if (!first || first.id !== event.pointerId) return;
    const dx = event.clientX - first.x, dy = event.clientY - first.y;
    if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
  }, { passive: true });
  listen(frame, "pointercancel", () => { start = null; }, { passive: true });
  const api = { destroy() {
    if (destroyed) return;
    destroyed = true; ++generation; start = null; listeners.forEach(remove => remove()); clearImage();
    root.remove(); if (MOUNTS.get(host) === api) MOUNTS.delete(host);
  } };
  MOUNTS.set(host, api); show(0); return api;
}
