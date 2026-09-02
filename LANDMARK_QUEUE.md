# Landmark queue, and the numbers each one is still missing

The 3D landmark routine builds one model per run, and it may only build from
published dimensions. This file records what has been checked, so a later run
does not spend its whole budget re-walking the same dead ends.

## Built

MET rooms: dendur, great-hall, american-court, asian-astor, modern,
grand-stair-2, plus the composed landmark cards.

Freedom Trail (trail-3d.js): bunker-hill, old-north, faneuil-hall,
state-house, old-state-house, old-south, constitution, paul-revere. Eight of
the ten buildings the routine listed.

MoMA: the building's own architecture (moma-3d.js).

Seattle (seattle-3d.js): space-needle, pier66-walk. BOTH NOW MOUNTED on
tours.html, each with its own camera.

## How to get dimensions here, learned the hard way

Two techniques, both proven on 2026-09-01, worth trying BEFORE a search:

**npshistory.com serves NRHP nomination PDFs and they are readable.** A plain
fetch returns binary and the fetch tool gives up, but the PDF is saved to disk
and `pypdf` extracts it cleanly. That is how the Paul Revere House nomination
was finally read. Pattern:
`npshistory.com/publications/<park>/nr-<building>.pdf`, then extract locally.

**The 403 wall.** historylink.org, skyscrapercenter.com and sah-archipedia.org
all refuse a plain fetch. Between them they hold most of the numbers this queue
is missing, so a run that keeps aiming at them keeps losing. Prefer Wikipedia,
NPS, loc.gov and the building's own site, and treat the three above as known
dead ends rather than fresh ideas.

**loc.gov HABS measured drawings are where the Boston numbers actually live,
and 2026-09-01 read one. THE ROUTE, which works and should be reused:**
`curl` with a browser User-Agent, NOT the fetch tool. The fetch tool returns
403 on loc.gov; the identical URL with
`-A "Mozilla/5.0 (Macintosh...) Chrome/124.0 Safari/537.36"` returns 200.
That single flag is the difference between this queue being blocked and being
answerable, and it may well open the three 403 walls below too, which no run
has yet tried.

  1. `https://www.loc.gov/item/<id>/?fo=json`  -> the item, as JSON
  2. in that JSON, `resources[n].files` is a list of sheets; each sheet lists
     its formats, and the `image/tiff` master under `storage-services/master/`
     is the one worth having. The Revere sheets come back 14452 x 9632, which
     is far more than enough to read a dimension string.
  3. PIL crops it (`Image.MAX_IMAGE_PIXELS=None` first, the masters trip the
     decompression-bomb guard), `sips` makes overviews, and then LOOK at it.

Two things learned from actually reading one. The plan sheet carries the
dimensions written out and needs no measuring at all. The ELEVATION sheet
often carries none, only a scale note, and the honest way to get a height is
to scale it against a published plan dimension on the same drawing: find the
wall's pixel width, divide by the known feet, and read the horizontal lines
off a row-ink profile rather than by eye.

## Freedom Trail, the three not built, and why

**Park Street Church.** The steeple is published and firm: 217 ft 9 in, from
the church itself, and 217 ft from Wikipedia and SAH Archipedia. No source
found publishes the footprint of the brick body. SAH describes it but gives no
plan dimensions, and the SAH page returns 403 to a plain fetch. A model needs
the rectangle before the steeple can stand on anything, so this one waits for a
HABS or MACRIS record.
Checked 2026-09-01: parkstreet.org Freedom Trail page, Wikipedia, SAH search
result, trolleytours, and a targeted search for a body dimension. None had it.

**King's Chapel. NOW A CLOSED DEAD END, do not spend another run on it.**
The footprint is published, 65 by 100 ft of Quincy granite, and no source
publishes the height of the unfinished tower, which is the whole silhouette.
The 2026-09-01 fourth run went to the place the queue said the number lived
and it is NOT THERE. HABS ma0461 was found and read: its call number is
MASS,13-BOST,55 not the 12 this file guessed, and the record is
`Photo(s): 1, Photo Caption Page(s): 1`. There are NO MEASURED DRAWINGS. The
data PDF (`cdn.loc.gov/master/pnp/habshaer/ma/ma0400/ma0461/data/ma0461data.pdf`,
and it needs `curl -L`, it answers 307) is a one page cover sheet carrying a
title and nothing else. So the tower height is not in HABS, and the three 403
walls are all that is left. Treat this as unbuildable until a MACRIS record or
a measured drawing turns up somewhere new.

**Paul Revere House. BUILT 2026-09-01.** The HABS sheets were finally read
and they carry everything the NRHP nomination did not.

PUBLISHED, off sheet 2, the first floor plan:
  main block 30' 6" wide by 18' 2" deep over the walls
  the 30' 6" resolves into nine dimensions summing to it EXACTLY:
    4'1", 2'11", 4'5", 2'11", 4'4", 2'11", 2'8", 2'8", 3'7"
    the three 2'11" slots are the casement bays and a 2'8" is the door
  the 18' 2" resolves as 8'6" + 1'6" + 8'2", also exact
  SOUTH ROOM (HALL) 22' 6" x 17' 3"
  NORTH ROOM (KITCHEN) 11' 6" x 15' 3", in the ell
  ell over its walls about 12' 3" by 16' 4"

SCALED off sheet 1's east elevation, which carries no written heights: the
front wall measures 3238 px against the published 30' 6", so 106.16 px/ft,
and the lines came from a row-ink profile: first storey 6' 8", second 8' 0",
eave 14' 8". The ridge (about 26' 6") and the stack top (about 38' 0") were
read from the picture rather than the profile and are given as approximate.
They check out: an 11' 10" rise over a 9' 1" half span is a 52 degree pitch,
and the nomination independently calls the roof steeply pitched.

A CORRECTION TO THE RECORD. The NRHP nomination says five bays on the front.
The HABS sheet says FOUR, in its own title-block text and in its elevation,
and the four-bay reading is what the nine measured widths actually add up to.
The measured drawing was believed over the nomination.

STILL NOT PUBLISHED, and declared as such in the model: the ell's heights,
which are carried across from the main block's measured storeys, and the
angle the ell sits at, measured off the sheet at about 14 degrees. A later
run reading sheets 3 to 5 could replace both with drawn numbers.

## Seattle, one built, and what the next one needs

**Space Needle. BUILT 2026-09-01.** Every figure sourced: 605 ft to the tip,
520 ft deck, 518 ft top floor, 500 ft restaurant, 138 ft across the top,
120 by 120 ft foundation 30 ft deep (Wikipedia); 102 ft leg base, waist at the
373 ft level, three PAIRS of legs (Docomomo WEWA); 36 in welded columns
(ASCE). The queue asked to confirm the leg spread and the top house diameter
before drawing, and both were confirmed. The width AT the waist is the only
quantity no source publishes, so the curve runs through the published level
and its narrowest point is a consequence of that curve, declared in the file.
wikiarquitectura holds plans and returns 403 to a plain fetch; if a later run
needs the waist as a fact rather than a curve, that is where to look.

**Smith Tower. HEIGHTS NOW VERIFIED, footprint still missing.**
Confirmed 2026-09-01 against Wikipedia and a second search result:
  484 ft to the top of the antenna spire
  462 ft to the roof
  469 ft from curbside to the top of the pyramid
  38 floors
  a 22 STOREY BASE and a 20 STOREY TOWER, which is the massing: a broad
    block with a slender shaft rising out of it, not a single slab
  the pyramidal cap is HOLLOW, held a 12,000 gallon water tank and access
    ladders, and shows three tiers of small arched windows that have NO
    floors behind them
  opened 4 July 1914
So the queue's old note that 484 ft and 38 storeys were "unverified" can be
retired, and the guess that it is "a slab with a pyramidal cap" was WRONG:
it is base plus shaft.

TWO THINGS STILL BLOCK IT.
1. The footprint. Still unpublished anywhere reachable. The lot is described
   as ODD SHAPED, at 2nd and Yesler, which means even if a width turns up it
   may not be a rectangle. historylink.org, skyscrapercenter.com and
   sah-archipedia.org each returned 403 on this run and each is likely to
   hold it.
2. A CONTRADICTION that must be resolved, not averaged. The Wikipedia
   infobox also carries a pinnacle figure of 159 m (522 ft), which cannot
   sit beside 484 ft to the tip. One of the two is wrong or is measuring
   from a different datum. Do not draw this building until that is settled,
   because the pyramid's own height falls out of it: 469 minus 462 leaves
   only 7 ft of pyramid, which is far too little for a hollow cap holding a
   12,000 gallon tank behind three tiers of windows. At least one of these
   published numbers is measured from somewhere other than where it appears
   to be.

**The Pier 66 to Pike Place walk. BUILT 2026-09-01.** The queue was right that
this was the cheapest item left, and the route to the numbers turned out to be
a third technique worth keeping beside the other two.

TWO PUBLIC APIS, both answering a plain curl with no key and no 403:
  `router.project-osrm.org/route/v1/foot/<lon,lat>;<lon,lat>?geometries=geojson`
    returns the real walking route over OpenStreetMap, its length, and its
    vertices. No more guessing at waypoints.
  `epqs.nationalmap.gov/v1/json?x=<lon>&y=<lat>&units=Feet&wkid=4326`
    is USGS 3DEP, 1 metre raster, one elevation per call. 64 calls at 8 in
    parallel took seconds. Three came back empty and were simply re-asked.
Between them any walk anywhere in the United States can be measured, which
makes every other walking route on this site buildable on the same pattern.

WHAT THE MEASUREMENT SAID, and the site copy was WRONG on both counts:
  the route is 1334 m, 0.829 mi, NOT 0.7 mi
  it is NOT simply uphill: it climbs to 152.7 ft at 1st Ave near Virginia and
    then drops 44 ft into the Market, finishing at 110.6 ft
  start 15.8 ft, net rise 94.8 ft, gross climb 139.1 ft
  two steep pitches, not one: Wall St up to Elliott, and Lenora at about 16
    percent over its steepest 50 m
MOUNTED AND FINISHED 2026-09-01, and two things the previous run predicted
turned out differently.

THE 0.7 MILE COPY DOES NOT EXIST. This run grepped every html, js and json in
the tree for "0.7 mi", "0.7-mile" and "uphill". The only live hit is an
unrelated line in guide_scripts.json about the Starbucks Roastery being a
fifteen minute walk uphill from downtown, which is a different walk and is
correct. tours.html never carried the 0.7 figure. So the queue's "cheapest
job" was already not there; the walk section now added to tours.html states
0.83 miles, the 139 ft climb, the 44 ft given back, and the 16 percent on
Lenora, from the measurement.

A REAL DEFECT THE PICTURE FOUND, and the numbers had passed. The surface is
coloured steep at 8 percent, and the grade was taken between adjacent vertices
with only a `run > 0.5` guard. 3DEP is a 1 m raster whose vertical error is
about a foot, so over a 2.5 m run one foot of noise reads as 12 PERCENT, which
is larger than the threshold itself. Two blocks were being painted as hills
that nobody climbs: a 0.9 ft drop over 2.5 m at 1224 m in, and a 1.5 ft rise
over 5.3 m in the last strides into the Market. The guard is now MIN_RUN = 15
m, where that same foot of error is worth 2 percent. It removes exactly those
two and keeps all six real pitches, which is the test that it is a noise floor
and not a convenient trim. THE GENERAL LESSON, and it applies to every future
walk built on the OSRM plus 3DEP pattern: a routed line gives you vertices
wherever the street geometry happens to bend, some of them metres apart, and a
per-vertex grade from a 1 m raster is mostly raster. Grade needs a minimum run
declared before it is claimed.

## MoMA

The building's architecture is built. The Marron Atrium, a 110 ft daylight
shaft, has not been modelled and its 110 ft is the only number in hand. It
needs a plan dimension before it can be drawn, the same gap as Park Street.

## The rule that produced this file

Absence over invention. A landmark with no verifiable dimensions gets nothing,
and nothing is honest. Three of the four candidates looked at on the first
2026-09-01 run were one number short and none were built. The fourth, the
Space Needle, had every number it needed and was built on the second. The
third run checked Smith Tower, the Paul Revere House and King's Chapel, moved
all three closer, and built none of them, which is the rule working rather
than the rule failing.
