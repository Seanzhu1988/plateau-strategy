# Discovery Sources — the full sweep

Sean's ask, 2026-08-20: keep the site discovering new places the way
Xiaohongshu's crowd does — on a routine, from as much online data as we can
lawfully use. This file is the sweep that answered it. Every claim marked
**probed** was tested live on 2026-08-20 with real requests and real counts;
everything else says plainly that it was not.

The scout that consumes tier 1 lives in `discovery.py`; the owner's review
queue is `/discovery`. Nothing reaches the public Destination Book without
the owner's tap, through `/api/destinations/add`.

## Tier 1 — live now, no keys (all probed)

| Source | What it gives | Probe result | License |
|---|---|---|---|
| **Overpass API** (OpenStreetMap) | POIs **newly added or edited** in the last 30 days — the truest "someone just mapped a new place" signal there is | 14 named finds in Manhattan in one 30-day window, incl. two museums; 2-3s/query | ODbL — credit OSM |
| **Wikipedia geosearch** | notable places with coordinates around city anchors | 20-30 articles per anchor, 0.4s, fields title/lat/lon/pageid | facts not copyrightable; we take names + coords only |
| **Wikivoyage listings** | see/do listings with name, lat/long, official URL | 20 structured listings on one Midtown page (Greenacre Park, Paley Park…) | CC BY-SA — we take the **pointer**, never their prose |
| **NYC Open Data** (Socrata) | the city's own POI file, with `created_date` — the city tells us what is new | 200 OK, newest-first works; no coords in this dataset → leads | public domain |
| **DC Open Data** (ArcGIS) | the city's museum roll with geometry | 200 OK, NAME/ADDRESS/WEB_URL + lat/lon | public domain |
| **Reddit search.rss** | what r/AskNYC, r/nyc, r/washingtondc call a hidden gem this month | Atom works with a descriptive UA; sparse (1 hit/mo on one query) but real | leads only: titles + links |
| **Atlas Obscura RSS** | `/feeds/places` — new write-ups of unusual places | 18 items, live | leads only: titles + links; the writing is theirs |

## Tier 2 — free keys unlock more (5 minutes of signup, Sean)

| Source | Key | Probe result | What it adds |
|---|---|---|---|
| **National Park Service API** | free at developer.nps.gov | 403 without key (confirmed wall) | every NPS place + event in Gateway NRA (NYC) and National Capital parks (DC); wired in `discovery.py`, activates the moment `NPS_API_KEY` is in the env |
| **Smithsonian Open Access** | free data.gov key | DEMO_KEY returned **1,964,792** objects | DC museum depth: objects, exhibitions |
| Eventbrite / Ticketmaster Discovery | free tiers exist | **not probed** | events as time-limited POIs — a "what's on near your walk" layer |

## Tier 3 — the enormous data (bulk, a monthly job, not a live API)

| Dataset | Scale | Probe result | How we'd use it |
|---|---|---|---|
| **Overture Maps `places`** | ~50M+ POIs, monthly releases | releases catalog live (STAC; the old releases.json froze 2026-07-22) | download one month's NYC/DC extract with DuckDB, diff against the previous month → *every* new business/venue in the city. This is the true "enormous collecting" lever; it needs a small offline job, not the Flask host |
| **Foursquare OS Places** | ~100M POIs | Hugging Face dataset live, **Apache-2.0** license | same monthly-diff pattern; Apache license is the friendliest in the field |

## Learn-only — the Xiaohongshu question, answered honestly

**Xiaohongshu (小红书 / RED) has no public API**, and scraping it would
violate its terms and Chinese data-export law. We do not touch it. What we
take is its *mechanic*: real people pinning fresh spots, and the app making
saving/reposting effortless. Our lawful equivalents, some already built:
community adds from the Trip Planner (live), traveler-proposed corridors with
owner approval (live), and this scout. The gap worth building next is the
**public "post a spot" card** — one photo, one line, one pin, owner-approved
into the book — which is Xiaohongshu's loop with our honesty rules.

The rest of the landscape, verdict by verdict: Instagram and TikTok location
data — no lawful API for this use since 2018, learn-only. Google Maps —
ToS forbids storing places data, learn-only. Yelp Fusion — free key but
results may not be stored beyond a cache, so it can rank but not fill the
book. TripAdvisor — paid partner API. AllTrails, Wanderlog — no public API.
Foursquare — covered above via its open dataset. Atlas Obscura — RSS leads,
already in tier 1. (Verdicts from current developer terms; not re-probed
where no endpoint exists to probe.)

## The rules the scout lives by

One polite User-Agent with a contact address. ~0.7s between calls. Per-run
cap 60, per-source cap 15, source order rotates so nobody starves, the queue
prunes its fattest source first (a blind prune once deleted a whole source's
finds while a flood survived — caught in testing, 2026-08-20). Hotels are
lodging, not discoveries. Leads carry title + link only. And nothing is
public until the owner says so.
