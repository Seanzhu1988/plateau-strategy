import { ARCHITECTURE_STORIES } from "./architecture-stories.js";
import { buildDirectoryData, citiesFor, cityName, searchTours, minutes, cleanCopy } from "./tour-directory-preview-data.js";

const state = { tours: [], query: "", city: "dc", tourId: "national-mall", stop: 1, branding: {} };
const $ = id => document.getElementById(id);
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function link(label, href, className = "text-action") {
  const a = element("a", className, label); a.href = href; return a;
}
function brandedTitle(tour, className) {
  const wrapper = element("span", className), brand = state.branding[tour.school];
  if (brand?.logoUrl) {
    const img = element("img", "school-logo"); img.src = brand.logoUrl; img.alt = brand.logoAlt || `${brand.name} logo`;
    img.width = 42; img.height = 42; img.loading = "lazy"; img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => img.remove(), { once: true });
    wrapper.append(img);
  }
  const name = element("span", "tour-title-text");
  name.append(element("span", "tour-name", tour.name));
  const animal = mascot(tour); if (animal) name.append(animal);
  wrapper.append(name);
  return wrapper;
}
function mascot(tour) {
  const brand = state.branding[tour.school];
  if (!brand) return null;
  const row = element("span", "school-mascot");
  if (brand.mascotImageUrl) {
    const img = element("img", "mascot-image"); img.src = brand.mascotImageUrl;
    img.alt = brand.mascotImageAlt || brand.mascotName || "School mascot";
    img.width = 48; img.height = 48; img.loading = "lazy"; img.referrerPolicy = "no-referrer";
    img.addEventListener("error", () => img.remove(), { once: true }); row.append(img);
  }
  row.append(element("span", "", cleanCopy(brand.mascotName || brand.mascotNote || ""))); return row;
}
function chooseCity(city) {
  state.city = city; state.tourId = null; state.stop = 1; render();
}
function renderCities() {
  const codes = citiesFor(state.tours), nav = $("city-list"), select = $("city-select");
  nav.replaceChildren(); select.replaceChildren();
  for (const code of ["all", ...codes]) {
    const name = code === "all" ? "All cities" : cityName(code);
    const button = element("button", "city-choice", name); button.type = "button";
    button.setAttribute("aria-pressed", String(code === state.city)); button.dataset.city = code;
    button.onclick = () => chooseCity(code); nav.append(button);
    const option = element("option", "", name); option.value = code; option.selected = code === state.city; select.append(option);
  }
}
function pickResult(results) {
  let picked = results.find(r => r.tour.id === state.tourId);
  if (!picked) { picked = results[0]; state.tourId = picked?.tour.id || null; state.stop = picked?.matchedStops[0] || picked?.tour.stops[0]?.n || 1; }
  return picked;
}
function render() {
  renderCities();
  const results = searchTours(state.tours, state.query, state.city), picked = pickResult(results);
  $("city-title").textContent = state.city === "all" ? "All cities" : cityName(state.city);
  $("result-count").textContent = `${results.length} ${results.length === 1 ? "walk" : "walks"}`;
  $("clear-search").hidden = !state.query;
  const list = $("tour-list"); list.replaceChildren();
  for (const result of results) {
    const t = result.tour, button = element("button", "tour-choice"); button.type = "button";
    button.dataset.tour = t.id; button.setAttribute("aria-pressed", String(t.id === state.tourId));
    button.append(brandedTitle(t, "tour-choice-name"));
    const meta = element("span", "tour-choice-meta");
    if (state.city === "all") meta.append(element("span", "", t.cityLabel));
    meta.append(element("span", "", `${t.stops.length} stops`), element("span", "", `${minutes(t.walkMinutes)} walking estimate`));
    button.append(meta);
    if (state.query && !result.allMatch && result.matchedStops.length) {
      const first = t.stops.find(s => s.n === result.matchedStops[0]);
      button.append(element("span", "tour-choice-match", `Includes stop ${first.n}: ${first.name}`));
    }
    button.onclick = () => { state.tourId = t.id; state.stop = result.matchedStops[0] || t.stops[0].n; render(); $("tour-title").scrollIntoView({ block: "start" }); };
    list.append(button);
  }
  $("empty-state").hidden = results.length !== 0;
  $("tour-detail").hidden = !picked;
  if (picked) renderTour(picked.tour);
}
function renderTour(tour) {
  $("tour-city").textContent = tour.cityLabel;
  $("tour-title").replaceChildren(brandedTitle(tour, "detail-title"));
  $("open-tour").href = tour.url;
  $("tour-summary").textContent = `Start at ${tour.stops[0].name} and follow the route to ${tour.stops.at(-1).name}. Choose any stop below for a closer look.`;
  $("stop-count").textContent = String(tour.stops.length); $("walking-time").textContent = minutes(tour.walkMinutes);
  const list = $("stop-list"); list.replaceChildren();
  for (const stop of tour.stops) {
    const item = element("li", "stop-item"), button = element("button", "stop-toggle");
    const panelId = `stop-panel-${tour.id}-${stop.n}`;
    item.id = `directory-stop-${stop.n}`; button.type = "button"; button.dataset.stop = String(stop.n);
    button.setAttribute("aria-expanded", String(stop.n === state.stop)); button.setAttribute("aria-controls", panelId);
    button.append(element("span", "stop-number", String(stop.n)), element("span", "stop-name", stop.name), element("span", "stop-symbol", stop.n === state.stop ? "−" : "+"));
    button.querySelector(".stop-symbol").setAttribute("aria-hidden", "true");
    const panel = element("div", "stop-panel"); panel.id = panelId; panel.hidden = stop.n !== state.stop;
    item.append(button, panel); list.append(item);
    if (!panel.hidden) fillStopPanel(panel, tour, stop);
    button.onclick = () => {
      const wasOpen = Number(state.stop) === stop.n;
      state.stop = wasOpen ? null : stop.n;
      // Keep the user's focused button and route order stable. Only the one
      // selected destination loads an image, with no audio element or API.
      list.querySelectorAll(".stop-toggle").forEach(b => {
        const active = Number(b.dataset.stop) === state.stop;
        b.setAttribute("aria-expanded", String(active)); b.querySelector(".stop-symbol").textContent = active ? "−" : "+";
        const body = document.getElementById(b.getAttribute("aria-controls")); body.hidden = !active;
        if (!active) body.replaceChildren();
      });
      if (!wasOpen) fillStopPanel(panel, tour, stop);
    };
  }
}
function fillStopPanel(panel, tour, stop) {
  panel.replaceChildren();
  if (stop.photo) {
    const figure = element("figure", "stop-figure"), img = element("img");
    img.alt = stop.photo.alt; img.decoding = "async"; img.referrerPolicy = "no-referrer";
    const caption = element("figcaption"); caption.append(element("span", "", stop.name));
    const credit = link(stop.photo.label, stop.photo.source, ""); credit.target = "_blank"; credit.rel = "noopener"; caption.append(credit);
    figure.append(img, caption); panel.append(figure);
    img.addEventListener("error", () => {
      img.remove();
      figure.prepend(element("p", "stop-photo-note", "The photograph could not load. You can still read the story or open its source."));
    }, { once: true });
    img.src = stop.photo.src;
  } else panel.append(element("p", "stop-photo-note", "A photograph of this stop is not available yet."));
  const story = element("div", "stop-story"), sceneStory = stop.model && ARCHITECTURE_STORIES[stop.model.key];
  for (const paragraph of sceneStory?.en.paragraphs || [stop.description || "Open the tour to explore this destination."]) story.append(element("p", "", paragraph));
  panel.append(story);
  const actions = element("div", "stop-actions");
  if (stop.model) actions.append(link(stop.model.label, stop.model.href));
  else actions.append(element("span", "model-note", "3D model not available yet"));
  if (tour.id === "freedom-trail") actions.append(link("Open this stop in the tour", `${tour.url}#ft-stop-${stop.n}`));
  else actions.append(link("Open tour", tour.url));
  panel.append(actions);
  const brand = state.branding[tour.school];
  if (brand && stop.n === tour.stops[0].n) {
    const sourceDetails = element("details", "school-sources");
    sourceDetails.append(element("summary", "", "About the school mark and mascot"));
    if (brand.mascotNote) sourceDetails.append(element("p", "", cleanCopy(brand.mascotNote)));
    for (const source of brand.sources || []) { const a = link(cleanCopy(source.label), source.url); a.target = "_blank"; a.rel = "noopener"; sourceDetails.append(a); }
    panel.append(sourceDetails);
  }
}
async function load() {
  $("load-error").hidden = true; $("load-state").hidden = false;
  try {
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 12000);
    let response;
    try { response = await fetch("/api/trails", { signal: controller.signal, cache: "no-store" }); }
    finally { clearTimeout(timeout); }
    if (!response.ok) throw new Error("Catalog unavailable");
    const payload = await response.json(); state.tours = buildDirectoryData(payload);
    if (!state.tours.length) throw new Error("Catalog empty");
    if (!citiesFor(state.tours).includes(state.city) && state.city !== "all") state.city = "all";
    $("load-state").hidden = true; render();
  } catch {
    $("load-state").hidden = true; $("load-error").hidden = false; $("tour-detail").hidden = true;
    $("tour-list").replaceChildren(); $("result-count").textContent = "";
  }
}
async function boot() {
  const params = new URLSearchParams(location.search);
  state.query = cleanCopy(params.get("q")); $("search-input").value = state.query;
  state.city = params.get("city") || (state.query || params.has("tour") ? "all" : "dc");
  state.tourId = params.get("tour") || "national-mall"; state.stop = Number(params.get("stop")) || 1;
  $("directory-search").onsubmit = event => event.preventDefault();
  $("search-input").oninput = event => {
    state.query = event.target.value; state.city = "all"; state.tourId = null; state.stop = 1; render();
  };
  const reset = () => { state.query = ""; state.city = "all"; state.tourId = null; $("search-input").value = ""; render(); $("search-input").focus(); };
  $("clear-search").onclick = reset; $("reset-search").onclick = reset;
  $("city-select").onchange = event => chooseCity(event.target.value);
  $("retry-load").onclick = load;
  // Branding is supplemental. A mark fetch can never block the tour list.
  import("./ivy-branding.js").then(module => { state.branding = module.IVY_BRANDING || {}; if (state.tours.length) render(); }).catch(() => {});
  await load();
}
if (typeof document !== "undefined") boot();
