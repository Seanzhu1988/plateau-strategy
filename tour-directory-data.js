/* Public directory data adapter. The seed catalog remains read-only;
 * reviewed manifest photographs are supplied independently of 3D models.
 * No audio availability is inferred from a file name or language.
 */
export const CITY_NAMES = {
  dc: "Washington, DC", boston: "Boston", nyc: "New York",
  cambridge: "Cambridge, MA", "new-haven": "New Haven", princeton: "Princeton",
  philadelphia: "Philadelphia", providence: "Providence", hanover: "Hanover, NH",
  ithaca: "Ithaca", keystone: "Keystone, SD"
};

const CITY_ORDER = ["dc", "boston", "nyc", "cambridge", "new-haven", "princeton", "philadelphia", "providence", "hanover", "ithaca", "keystone"];
const BOSTON_MODELS = {
  "Massachusetts State House": "state-house", "Park Street Church": "park-street",
  "Old South Meeting House": "old-south", "Old State House": "old-state-house",
  "Faneuil Hall": "faneuil-hall", "Paul Revere House": "paul-revere",
  "Old North Church": "old-north", "USS Constitution": "constitution",
  "Bunker Hill Monument": "bunker-hill"
};
const DC_MODELS = new Set(["capitol", "loc", "botanic", "indian", "airspace", "gallery", "hirshhorn", "castle", "natural", "american", "nmaahc", "whitehouse", "eeob", "monument", "wwii", "vietnam", "lincoln", "korean", "mlk", "fdr", "jefferson"]);

// The catalog mixes destination views with collection objects. Select only
// destination-view candidates, with no unrelated-photo fallback on failure.
const NO_DESTINATION_PHOTO = new Set(["National Gallery of Art", "Boston Latin School site", "Boston Massacre Site"]);
// Do not turn a mixed legacy array into a slideshow of paintings, collection
// fragments or unrelated sites. Reviewed manifest arrays supersede this list.
const CATALOG_PHOTO_INDEXES = {
  "Massachusetts State House": [0], "Park Street Church": [0, 1, 3],
  "King's Chapel": [0, 2, 3], "Old State House": [0, 3],
  "Faneuil Hall": [0, 1, 2], "USS Constitution": [0],
  "Bunker Hill Monument": [0, 2, 3],
  "National Museum of Natural History": [3],
  "National Museum of African American History and Culture": [1, 2, 3],
  "Vietnam Veterans Memorial": [1, 2, 3]
};

export function cleanCopy(value) { return String(value || "").replace(/[\u2013\u2014]/g, ",").replace(/\s+,/g, ",").trim(); }
export function fold(value) { return cleanCopy(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
export function cityName(code) { return CITY_NAMES[code] || cleanCopy(code).split("-").map(w => w ? w[0].toUpperCase() + w.slice(1) : "").join(" "); }
export function minutes(value) {
  if (!Number.isFinite(value) || value < 0) return "Not listed";
  const n = Math.round(value), hours = Math.floor(n / 60), rest = n % 60;
  return hours ? `${hours} hr${rest ? ` ${rest} min` : ""}` : `${n} min`;
}
export function walkingMinutes(tour) {
  // Match the tour player: start at stop 1 and sum only later incoming legs.
  const legs = (tour.stops || []).slice(1).map(s => s.walk_min_from_prev);
  if (legs.every(n => Number.isFinite(n) && n >= 0)) return legs.reduce((sum, n) => sum + n, 0);
  return Number.isFinite(tour.walk_min_total) && tour.walk_min_total >= 0 ? tour.walk_min_total : null;
}
export function tourURL(id) {
  if (!/^[a-z0-9-]+$/.test(id)) return "/tours";
  return ({ "freedom-trail": "/freedom-trail", "national-mall": "/national-mall" })[id] || `/tour/${id}`;
}
export function modelFor(trailId, stop) {
  if (trailId === "freedom-trail" && Object.hasOwn(BOSTON_MODELS, stop.name)) {
    const key = BOSTON_MODELS[stop.name];
    return { key, label: "View 3D model", href: `/architecture?model=${key}&source=freedom-trail&stop=${Number(stop.n)}` };
  }
  if (trailId === "national-mall" && DC_MODELS.has(stop.model)) {
    return { key: stop.model, label: "Explore 3D in the tour", href: "/national-mall" };
  }
  return null;
}
function safePhotoURL(value, source = false) {
  if (typeof value !== "string" || !value.trim()) return "";
  const raw = value.trim();
  if (/[\u0000-\u001f\\]/.test(raw) || /\.svg(?:[?#]|$)/i.test(raw)) return "";
  try {
    let decoded = raw;
    for (let i = 0; i < 8; i++) { const next = decodeURIComponent(decoded); if (next === decoded) break; decoded = next; }
    if (decodeURIComponent(decoded) !== decoded) return "";
    if (/[\u0000-\u001f]/.test(decoded) || /\.svg(?:[?#]|$)/i.test(decoded)) return "";
    const candidate = decoded.replace(/\\/g, "/").replace(/^\/+/g, "/");
    const pathname = new URL(candidate, "https://directory.invalid").pathname.replace(/\/+/g, "/");
    if (/(?:^|\/)(?:api\/gallery\/photos|gallery_photos)(?:\/|$)/i.test(pathname)) return "";
    if (!source && /^\/(?!\/)/.test(raw)) return raw;
    const url = new URL(raw);
    return !url.username && !url.password && url.protocol === "https:" ? url.href : "";
  } catch { return ""; }
}
function normalizePhoto(raw, name) {
  const photo = typeof raw === "string" ? { src: raw } : raw;
  if (photo?.previewOnly || photo?.needsRightsReview) return null;
  const src = safePhotoURL(photo?.src);
  if (!src) return null;
  try {
    const local = /^\/(?!\/)/.test(src);
    const url = new URL(src, local ? "https://directory.invalid" : undefined);
    let source = safePhotoURL(photo.sourceUrl || photo.source, true);
    if (url.hostname === "commons.wikimedia.org" && url.pathname.includes("Special:FilePath/")) {
      const file = decodeURIComponent(url.pathname.split("Special:FilePath/")[1]);
      source ||= `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;
      url.searchParams.set("width", "960");
    } else if (url.hostname === "upload.wikimedia.org") {
      const parts = url.pathname.split("/");
      const file = decodeURIComponent(url.pathname.includes("/thumb/") ? parts.at(-2) : parts.at(-1));
      source ||= `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;
    }
    return { src: local ? src : url.href, sourceUrl: source, alt: cleanCopy(photo.alt || name), caption: cleanCopy(photo.caption || name), credit: cleanCopy(photo.credit), ...(photo.license ? { license: cleanCopy(photo.license) } : {}), licenseUrl: safePhotoURL(photo.licenseUrl, true) };
  } catch { return null; }
}
function normalizePhotos(raw, name) {
  const seen = new Set();
  return (Array.isArray(raw) ? raw : []).map(photo => normalizePhoto(photo, name)).filter(photo => {
    if (!photo || seen.has(photo.src)) return false;
    seen.add(photo.src); return true;
  });
}
export function photosFor(trailId, stop, manifest) {
  const row = manifest?.version === 1 ? manifest.trails?.[trailId]?.[String(stop.n)] : null;
  // The name check prevents a stale ordinal manifest from attaching a photo
  // to a different destination after any future change in walking order.
  if (row && fold(row.name) === fold(stop.name)) {
    const reviewed = normalizePhotos(row.photos, stop.name);
    if (reviewed.length) return reviewed;
  }
  const details = normalizePhotos(stop.photo_details, stop.name);
  if (details.length) return details;
  if (NO_DESTINATION_PHOTO.has(stop.name)) return [];
  const raw = Array.isArray(stop.photos) ? stop.photos : [];
  const selected = CATALOG_PHOTO_INDEXES[stop.name];
  const candidates = selected ? selected.map(i => raw[i]) : raw;
  return normalizePhotos([stop.photo, ...candidates], stop.name);
}
export function photoFor(stop) {
  const photo = photosFor("", stop, null)[0];
  return photo ? { ...photo, source: photo.sourceUrl, label: "Photo information" } : null;
}
export function buildDirectoryData(payload, manifest = null) {
  const ids = new Set();
  return (Array.isArray(payload?.trails) ? payload.trails : []).filter(t => {
    if (!/^[a-z0-9-]+$/.test(t.id || "") || ids.has(t.id) || !Array.isArray(t.stops) || !t.stops.length) return false;
    ids.add(t.id); return true;
  }).map(t => ({
    id: t.id, city: t.city || "other", cityLabel: cityName(t.city || "other"), name: cleanCopy(t.name),
    school: t.id.startsWith("ivy-") ? t.id.slice(4) : null,
    walkMinutes: walkingMinutes(t),
    url: tourURL(t.id),
    stops: t.stops.map((s, index) => {
      const photos = photosFor(t.id, s, manifest);
      return {
      // Preserve source order and number. Never sort by a guessed audio suffix.
      n: Number.isFinite(Number(s.n)) ? Number(s.n) : index + 1,
      name: cleanCopy(s.name), description: cleanCopy(s.desc),
      bookSlug: typeof s.book_slug === "string" ? s.book_slug : null,
      photos,
      photo: photos[0] ? { ...photos[0], source: photos[0].sourceUrl, label: "Photo information" } : null,
      model: modelFor(t.id, s)
    }; })
  }));
}
export function citiesFor(tours) {
  return [...new Set(tours.map(t => t.city))].sort((a, b) => {
    const left = CITY_ORDER.indexOf(a), right = CITY_ORDER.indexOf(b);
    return (left < 0 ? 100 : left) - (right < 0 ? 100 : right) || cityName(a).localeCompare(cityName(b));
  });
}
export function searchTours(tours, query = "", city = "all") {
  const words = fold(query).split(/\s+/).filter(Boolean);
  return tours.filter(t => city === "all" || t.city === city).map(t => {
    const general = fold(`${t.cityLabel} ${t.city} ${t.name} ${t.school || ""}`);
    const matchedStops = t.stops.filter(s => words.every(w => `${general} ${fold(s.name)}`.includes(w))).map(s => s.n);
    const allMatch = words.every(w => general.includes(w));
    return { tour: t, matchedStops, allMatch };
  }).filter(result => !words.length || result.allMatch || result.matchedStops.length);
}
