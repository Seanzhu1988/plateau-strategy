/* Private prototype data adapter. Source catalog remains read-only.
 * Coverage checked 2026-09-12 with architecture_reference_review:
 * 12 individual routes, 1 collection excluded; 84 Ivy stops have no images
 * or models. No audio availability is inferred from a file name or language.
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
const PHOTO_INDEX = {
  "National Museum of Natural History": 3,
  "National Museum of African American History and Culture": 1,
  "Vietnam Veterans Memorial": 1
};
const NO_DESTINATION_PHOTO = new Set(["National Gallery of Art", "Boston Latin School site", "Boston Massacre Site"]);

export function cleanCopy(value) { return String(value || "").replace(/[\u2013\u2014]/g, ",").replace(/\s+,/g, ",").trim(); }
export function fold(value) { return cleanCopy(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
export function cityName(code) { return CITY_NAMES[code] || cleanCopy(code).split("-").map(w => w ? w[0].toUpperCase() + w.slice(1) : "").join(" "); }
export function minutes(value) {
  if (!Number.isFinite(value) || value < 0) return "Not listed";
  const n = Math.round(value), hours = Math.floor(n / 60), rest = n % 60;
  return hours ? `${hours} hr${rest ? ` ${rest} min` : ""}` : `${n} min`;
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
export function photoFor(stop) {
  if (NO_DESTINATION_PHOTO.has(stop.name)) return null;
  const raw = stop.photos?.[PHOTO_INDEX[stop.name] || 0];
  if (typeof raw !== "string") return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || !["commons.wikimedia.org", "upload.wikimedia.org"].includes(url.hostname)) return null;
    let source;
    if (url.hostname === "commons.wikimedia.org" && url.pathname.includes("Special:FilePath/")) {
      const file = decodeURIComponent(url.pathname.split("Special:FilePath/")[1]);
      source = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;
      url.searchParams.set("width", "960");
    } else if (url.hostname === "upload.wikimedia.org") {
      const parts = url.pathname.split("/");
      const file = decodeURIComponent(url.pathname.includes("/thumb/") ? parts.at(-2) : parts.at(-1));
      source = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;
    } else return null;
    return { src: url.href, source, label: "Photo information", alt: cleanCopy(stop.name) };
  } catch { return null; }
}
export function buildDirectoryData(payload) {
  const ids = new Set();
  return (Array.isArray(payload?.trails) ? payload.trails : []).filter(t => {
    if (!/^[a-z0-9-]+$/.test(t.id || "") || ids.has(t.id) || !Array.isArray(t.stops) || !t.stops.length) return false;
    ids.add(t.id); return true;
  }).map(t => ({
    id: t.id, city: t.city || "other", cityLabel: cityName(t.city || "other"), name: cleanCopy(t.name),
    school: t.id.startsWith("ivy-") ? t.id.slice(4) : null,
    walkMinutes: Number.isFinite(t.walk_min_total) ? t.walk_min_total : null,
    url: tourURL(t.id),
    stops: t.stops.map((s, index) => ({
      // Preserve source order and number. Never sort by a guessed audio suffix.
      n: Number.isFinite(Number(s.n)) ? Number(s.n) : index + 1,
      name: cleanCopy(s.name), description: cleanCopy(s.desc),
      bookSlug: typeof s.book_slug === "string" ? s.book_slug : null,
      photo: photoFor(s), model: modelFor(t.id, s)
    }))
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
