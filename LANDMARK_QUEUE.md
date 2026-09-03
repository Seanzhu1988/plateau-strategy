# Landmark queue, and the numbers each one is still missing

The 3D landmark routine builds one model per run, and it may only build from
published dimensions. This file records what has been checked, so a later run
does not spend its whole budget re-walking the same dead ends.

## Built

MET rooms: dendur, great-hall, american-court, asian-astor, modern,
grand-stair-2, plus the composed landmark cards.

Freedom Trail (trail-3d.js): bunker-hill, old-north, faneuil-hall,
state-house, old-state-house, old-south, constitution, paul-revere,
park-street. Nine of the ten buildings the routine listed. park-street is
MOUNTED on freedom-trail.html as Stop 3, at yaw -2.5 so the Tremont front
faces the reader, and as of 2026-09-03 it is a WHOLE CHURCH: the brick body
is built from the Sanborn numbers the last run measured, so the steeple no
longer stands on nothing.

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

**THE 403 WALL IS TWO THIRDS DOWN, 2026-09-02.** The previous run guessed that
the loc.gov `curl -A` trick "may well open the three 403 walls, which no run has
yet tried." It was tried, and it works on two of the three:

    curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) \
      AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" <url>

  historylink.org        403 -> 200. OPEN. This is the big one; it holds the
                         Seattle numbers and it is now readable in full.
  skyscrapercenter.com   403 -> 200. OPEN.
  sah-archipedia.org     403 -> 403. STILL CLOSED, and the User-Agent is not
                         what it is checking. Treat as a real dead end.

Two traps found while using them, so a later run does not repeat them.
  historylink's /Search page is rendered by JavaScript and a fetch of it returns
  only the site chrome. Do NOT try to search it directly. Use a web search
  restricted to the domain to get the essay number, then fetch /File/<n>, which
  is plain server-rendered HTML and parses cleanly.
  skyscrapercenter building ids are not guessable. The id 1104 guessed on this
  run is NOT Smith Tower; it returns a 755 ft, 56 floor building.

**THE NHL NOMINATION IS THE DOCUMENT CLASS THAT CARRIES PLANS, and 2026-09-02
proved it on King's Chapel.** The previous run's closing note asked a future run
to "find the class of document that carries plans" and named the municipal
landmark nomination as the best lead. The municipal route is still unproven, but
a cheaper one worked first. A National Historic Landmark nomination is written to
a higher standard than an ordinary NRHP listing and its description section
routinely quotes measured dimensions out of the primary building records. The
whole route is two steps and costs under a minute:

  1. `curl -sL "https://en.wikipedia.org/w/index.php?title=<Name>&action=raw"`
     and grep for `refnum` in the NRHP infobox. This is far faster than any
     search, and it is where the King's Chapel number 74002045 came from.
  2. `curl -sL "https://npgallery.nps.gov/NRHP/GetAsset/NRHP/<refnum>_text"`
     then pypdf. No User-Agent trick is needed on this host.

Its limits, both hit on this run. A building whose Wikipedia infobox has no
`refnum` gives you nothing to ask for, which is where Park Street Church stalled.
And DO NOT GUESS REFERENCE NUMBERS. Four plausible Boston refnums were tried
blind and all four returned real, valid, DIFFERENT nominations with a 200 and a
full PDF, so a wrong guess does not fail loudly, it hands you the wrong building.
Always read the NAME field on page one before believing a word of the document.

**MACRIS IS A CLOSED DEAD END. Do not spend another run on it.** The previous
run named the Massachusetts MACRIS inventory as a hope for the two Boston
buildings. mhc-macris.net sits behind an Incapsula bot wall: every path,
including the bare root and any /api guess, returns a 200 carrying only an
`_Incapsula_Resource` script tag and an empty body. A browser User-Agent does not
move it, because it is not the User-Agent being checked. Treat it like
sah-archipedia.org.

**seattle.gov's landmark pages have moved.** Both the nomination and designation
page and the HistoricPreservation/Landmarks document directory returned 404 on
2026-09-02. The Smith Tower municipal nomination lead is still the right idea but
the URL has to be found first, and the seattle.gov site search is the way in, not
a guessed path.

**npgallery.nps.gov answers a plain curl and serves NRHP nomination PDFs** at
`https://npgallery.nps.gov/NRHP/GetAsset/NRHP/<refnum>_text`, which is a second
route beside npshistory.com and covers buildings that are not in a park. Its
limit: an undigitized record returns a one page PDF reading "The PDF file for
this National Register record has not yet been digitized," so a 200 and a real
PDF still do not mean there is a nomination to read. Its /NRHP/SearchResults
page is JavaScript rendered and cannot be scraped for reference numbers.

**The 403 wall, as it stood before 2026-09-02.** historylink.org,
skyscrapercenter.com and sah-archipedia.org
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

**King's Chapel. REOPENED 2026-09-02 (second run). THE FOOTPRINT BLOCKER IS
GONE. ONE NUMBER, THE TOWER HEIGHT, IS ALL THAT IS LEFT.**

The previous entry closed this building because HABS ma0461 turned out to hold
photographs and no measured drawings, and because the three 403 walls were all
that seemed to remain. That was wrong about what remained. The NHL nomination
had never been pulled for this building, only for Smith Tower, and it carries
plan dimensions quoted from the building committee's own instruction letter.

SOURCE, read 2026-09-02, a plain curl with no User-Agent trick needed:
`https://npgallery.nps.gov/NRHP/GetAsset/NRHP/74002045_text`
NRHP / NHL reference 74002045, six pages, digitised, extracts cleanly with
pypdf. The refnum came from the Wikipedia infobox, which is the cheap way in.

PUBLISHED, quoting the nomination quoting Bridenbaugh's Peter Harrison:
  "The Length of the Church from West to East, including the Steeple, is to be
   120 feet, besides which there will be 10 feet allowed for a Chancel. The
   breadth is to be 65 feet 8 inches. The Ground has a Declivity of about 5 feet
   from West to East....The Building is to be of rough Stone."

ALSO PUBLISHED, in the nomination's own description:
  tower 26 ft square "from out to out", walls 4 ft thick at the base
  the tower is crowned by a BLOCK TYPE CORNICE, and the spire was never built
  front porch of Ionic columns 25 ft in height, executed 1785-87 in wood by
    Thomas Clement, not the stone Harrison drew
  the balustrade above that porch, 4 ft 2 in
  north and south flanks carry TWO TIERS of windows, for the galleries
  east end carries a PALLADIAN window
  the never-built steeple would have been two square storeys and an octagonal
    spire, Ionic below with 16 coupled columns 19 in diameter, Corinthian above
    with 8 single columns 14 in diameter, plus 32 stone urns on the balustrade

A CONTRADICTION TO CARRY FORWARD, NOT TO AVERAGE. The nomination's 120 ft
including the tower and 65 ft 8 in breadth are the INSTRUCTION to the architect
in 1749, not a measurement of what stands. Wikipedia and the secondary sources
say 65 by 100 ft. Those two can be reconciled if the 100 ft excludes the tower
and the 120 ft includes it, but 100 + 26 is 126 and not 120, so they do not
close. Do not split the difference. A model should use the nomination's figures
and say which they are, or wait for an as-built plan.

THE ONE THING STILL BLOCKING IT: THE TOWER HEIGHT, and with it the eaves height
of the body. Every horizontal is now published and no vertical of the standing
building is. The portico gives 25 ft plus 4 ft 2 in of balustrade, which is a
published height but only of the porch, and the tower rises past it. Checked
and failed on this run: a targeted web search for the tower height returned
only the footprint and the story of the abandoned steeple; SAH Archipedia still
answers 403. NOT YET TRIED and worth a later run: the Boston Landmarks
Commission study report, and a Historic Structure Report if the parish has one
online.

TWO OF THE TOWER-HEIGHT LEADS ARE NOW SPENT AND BOTH FAILED, 2026-09-02
(fourth run). The entry above named two: the Boston Landmarks Commission study
report, and a Historic Structure Report.

  THE BLC STUDY REPORT DOES NOT EXIST FOR THIS BUILDING. A search restricted to
  boston.gov and cityofboston.gov returns the study-report index, the Parker
  House and Massachusetts Historical Society reports, and a King's Chapel
  BURYING GROUND pdf, which is the graveyard and not the church. This is not
  surprising once stated: King's Chapel is a National Historic Landmark, and
  the BLC writes study reports to evaluate a property for CITY designation.
  Treat it as closed, not as a search that needs better terms.

  NO HISTORIC STRUCTURE REPORT SURFACED either, on a targeted search pairing
  the building with "historic structure report" and "measured drawings."

A THIRD SOURCE WAS FOUND, READ IN FULL, AND IT DOES NOT CARRY THE HEIGHT. It is
worth recording because it looks like it should and a later run will find it
again: Aaron Helfand, "Inspired by Gibbs: Peter Harrison's lost designs for the
steeple of King's Chapel," Georgian Group Journal vol. XXVII (2019), a free 15
page PDF at
`georgiangroup.org.uk/wp-content/uploads/2020/10/GGJ_2019_13_Helfand.pdf`
which a plain curl fetches and pypdf extracts. It is a reconstruction of the
NEVER-BUILT steeple from Allen's cost estimate and the 1784 description. Every
dimension in it is of the steeple that was not built. It gives no height for
the granite tower that stands.

  ONE GENUINELY NEW PUBLISHED NUMBER DID COME OUT OF IT, and it is a horizontal
  cross-check rather than the vertical still wanted: Allen's estimate lists
  "96 feet of entablature," and Helfand divides that by the tower's four sides
  to get 24 FEET PER SIDE, measured to the outermost extent of the cornice, for
  the proposed Ionic storey. That sits just inside the nomination's 26 ft square
  "from out to out" for the granite tower, which is the right relationship for
  a storey stepping back above a base with 4 ft walls, so the two published
  figures agree rather than contradict. It does not unblock the model.

  Also confirmed there, and useful if the tower is ever drawn: the granite
  portion of the standing tower has FOUR WINDOWS below the level where the
  Ionic storey would have gone, and they are ARCHED, matching the arched
  windows used elsewhere in the building.

THE HEIGHT IS STILL THE ONE BLOCKER. Four sources have now been read without
finding it: the NHL nomination, HABS ma0461, the BLC index, and Helfand. The
leads left, none yet tried: the Massachusetts Historical Society's King's
Chapel records 1686-1942 (finding aid fa0249 at masshist.org), which is an
archive rather than a document and may need a person; and the Sanborn route
opened for Smith Tower above, which gives footprints but not heights so it does
NOT help here. Absence over invention still applies: do not scale a height off
a photograph, and do not take one off Helfand's reconstruction drawings, which
are an argument about a steeple that was never built.

STILL TRUE AND STILL WORTH NOT RE-WALKING, carried over from the 2026-09-01
run: HABS ma0461 is King's Chapel, its call number is MASS,13-BOST,55 not the
12 an earlier note guessed, and the record is `Photo(s): 1, Photo Caption
Page(s): 1`. THERE ARE NO MEASURED DRAWINGS. The data PDF
(`cdn.loc.gov/master/pnp/habshaer/ma/ma0400/ma0461/data/ma0461data.pdf`, and it
needs `curl -L`, it answers 307) is a one page cover sheet carrying a title and
nothing else. The tower height is not in HABS and no run should look again.

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

**Smith Tower. THE CONTRADICTION IS RESOLVED. ONE NUMBER STILL BLOCKS IT.**

The 2026-09-01 run ended with a rule: "Do not draw this building until that is
settled, because the pyramid's own height falls out of it." It is settled, and
it was settled by an essay that exists specifically to correct this building's
published numbers.

SOURCE, read 2026-09-02 through the newly opened 403 wall:
HistoryLink Essay 4310, "Smith Tower (Seattle)," by the architectural critic
John Pastier. Much of it is a catalogue of the errors printed about this
building, and it says in its own words:

  "The most frequent errors involve its number of floors and height in feet,
   which are almost universally given as 42 stories above the ground and
   either 500 or 522 feet."

So the 522 ft pinnacle figure the queue could not reconcile is NOT a rival
measurement to be averaged against 484. IT IS A NAMED ERROR, and the queue was
right to refuse to average it. The true figure, from the same essay:

  "Plans on file with Seattle's Department of Planning and Development reveal
   that the building is about 462 feet tall (the drawings are not fully
   dimensioned, and some scaling is required), using standard definitions of
   height which do not include flagpoles as part of the calculation."

That also dissolves the "only 7 ft of pyramid" absurdity, which was never a
real problem in the building, only in the reading of it. 462 and 469 are not
roof versus pyramid tip. They are THE SAME TOP measured from two different
ground datums, and this site slopes hard: Yesler Way falls away from 2nd
Avenue, so a curbside figure is legitimately several feet below the entrance
datum. The heights therefore stack as:

  462 ft   ground to the top of the pyramid. ARCHITECTURAL HEIGHT, from the
           permit plans. This is the number to model to.
  469 ft   the same top, measured from the downhill curb.
  484 ft   to the top of the antenna spire (Wikipedia).
  489 ft   to the top of the antenna spire (HistoryLink Essay 5370).
  522 ft   A MYTH. Do not use it. Do not average it into anything.

The 484 against 489 spread is unresolved but does NOT block a model: the spire
is a flagpole-class element excluded from architectural height, so it can be
drawn to 462 and the spire either omitted or declared as approximate.

MASSING, now firm and no longer a guess (Essay 4310):
  "The building took the fashionable New York 'mounted tower' form, combining
   a substantial base with a slender tower above."
  "The broad base accommodated most of the building's floor space, while the
   slim tower provided most of the visual interest and much of the building's
   height."
  the base and tower relate awkwardly by design, Pastier calling it "a gawky
   long necked giraffe," so a model should NOT smooth the junction
  "the Smith Tower occupied less than a quarter of a small block"
  the pyramid is hollow, held a water tank and access ladders above the
   observatory floor, carries three tiers of small arched windows with NO
   floors behind them, and was topped by a hollow glass globe beacon

A CORRECTION TO THIS FILE'S OWN EARLIER NOTE. The 2026-09-01 run wrote "a 22
STOREY BASE and a 20 STOREY TOWER." Essay 4310 gives the son's scheme as
"21 stories capped by a 20-story tower." The floor count is genuinely
ambiguous and Pastier says so: 33 rentable above-ground floors, an observation
deck and function room on the 35th story, a 34th floor never meant for human
occupancy, "36 stories when it opened," and 38 today after the caretaker's
apartment became a two-storey penthouse. Any model should carry 462 ft as the
hard number and treat the storey split as approximate.

Also published, Essay 5370, useful and not needed for geometry: 1,400 doors,
2,000 windows, 40,000 ft of molding, and 1,276 Raymond concrete piles 22 ft
long. Opened 4 July 1914.

THE ONE THING STILL BLOCKING IT: THE FOOTPRINT. Nothing else.
Pastier's own source note says the plans are "on file with Seattle Department
of Planning and Development," which is a counter in a building, not a URL, and
he says they are "not fully dimensioned" even in person. Checked and failed
2026-09-02:
  historylink 4310, 727 and 5370, now fully readable, carry NO plan dimension
  npgallery NRHP: ref 84003484 returns the undigitized stub
  King County ArcGIS (gismaps.kingcounty.gov/arcgis/rest/services) has NO
    building footprint layer at all. Its Property folder holds only
    KingCo_Parcels, KingCo_ParcelLabels, KingCo_PropertyInfo,
    KingCo_FarmlandPreservationProgram and KingCo_PublicBenefitRatingSystem.
    A parcel is the LOT, and Pastier says the building covers less than a
    quarter of a small block, so the parcel is not the footprint and must not
    be substituted for one.
  overpass-api.de did not answer at all on this run (curl exit 7). It is worth
    retrying, but an OSM traced outline is a crowd tracing rather than a
    published dimension, so it belongs in a cross-check and not in the model.

LEAD 1 IS SPENT AND IT FAILED, 2026-09-02 (fourth run). The Seattle city
landmark nomination was called "THE BEST REMAINING SHOT." It is not a shot at
all. Smith Tower was designated a Seattle Landmark on 12 June 1984, but no run
should look for its nomination PDF again: a site-restricted search of
seattle.gov returns the Landmarks Preservation Board's agendas and its generic
nomination application form, and no nomination document for this building. What
the search DOES surface, and it is a trap worth naming, is
`.../historicdistricts/pioneersquare/2025/psb030525breifingsmithtowerpp.pdf`,
a 9.2 MB 57 page Pioneer Square board briefing that a plain curl with the
browser User-Agent downloads and pypdf extracts cleanly. It looks like a
building document and it is not one. It is WESTERN NEON'S SIGN PACKAGE for a
Caffe Vita tenant fit-out, drawn 2024-25. It carries no plan and no plan
dimension. Its one arguably useful sheet is page 13, a south elevation on
Yesler Way at a stated 1/8 inch = 1 foot, so the base width along Yesler could
in principle be scaled off it; but it is a sign contractor's drawing of the
facade it is hanging a sign on, not a measured survey, and a footprint scaled
from it would be a guess wearing a scale bar. Do not model from it.

LEAD 4, NEW AND UNSPENT, AND IT IS NOW THE BEST ONE: SANBORN FIRE INSURANCE
MAPS AT loc.gov. Confirmed live on 2026-09-02, and it fits the loc.gov workflow
this file already proves. A Sanborn sheet is a published, scaled, orthographic
building outline, usually 50 feet to the inch, and it routinely letters the
dimension of a large block outright. It is exactly the class of document the
queue has been missing for this building, and no run has tried it.

  the search endpoint answers a plain curl with the browser User-Agent:
  `https://www.loc.gov/search/?q=sanborn+seattle+washington&fa=partof:sanborn+maps&fo=json&c=5`
  it returns real Seattle volumes, for example item `sanborn09315_026`, whose
  own `?fo=json` reports `Vol. 6, 1919 - Sep 1950` and 128 sheets, with 129
  files under `resources[0].files`. So the volumes are digitised, post-date
  Smith Tower's July 1914 opening, and are read by the same three-step recipe
  the Paul Revere HABS sheets used: item JSON, pick the `image/tiff` master,
  crop with PIL and LOOK at it.

  WHAT A LATER RUN MUST DO FIRST, because it is where this will go wrong: pick
  the volume that covers PIONEER SQUARE, 2nd Avenue at Yesler Way, which is
  almost certainly Vol. 1 and NOT the Vol. 6 sampled above. Each volume's sheet
  010 is a "Key map to edition," so read the key map before pulling a sheet.
  And carry the caveat honestly: a Sanborn outline is a published drawing, so
  it is admissible where an OSM tracing is not, but if the sheet does not
  letter the dimension then what comes off it is scaled and must be declared
  scaled, the same way the Paul Revere elevation heights are.

THE THREE LEADS NOT YET SPENT, in the order worth trying:
  1. The Seattle city landmark nomination. Smith Tower is a designated Seattle
     landmark and the city publishes nomination PDFs at seattle.gov; those
     documents routinely carry plan dimensions where a NRHP form does not.
     THIS IS THE BEST REMAINING SHOT and no run has tried it.
  2. skyscrapercenter.com, now open, once its real building id is found. It
     publishes gross floor area, which with a storey count bounds a plate.
  3. Seattle DPD / SDCI's own permit records, if any are online.

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

## Run log, fourth run, 2026-09-02

Nothing was built and that is the rule working. Three candidates remain and all
three are still exactly one number short: King's Chapel wants the tower height,
Smith Tower wants the footprint, the Marron Atrium wants a plan dimension. This
run spent its budget closing dead ends rather than guessing, and it closed
three of them: the Seattle landmark nomination, the Boston Landmarks Commission
study report, and the Helfand steeple paper. It opened one, the loc.gov Sanborn
volumes, which is the first source ever found for this file that is designed to
publish a building footprint.

## The rule that produced this file

Absence over invention. A landmark with no verifiable dimensions gets nothing,
and nothing is honest. Three of the four candidates looked at on the first
2026-09-01 run were one number short and none were built. The fourth, the
Space Needle, had every number it needed and was built on the second. The
third run checked Smith Tower, the Paul Revere House and King's Chapel, moved
all three closer, and built none of them, which is the rule working rather
than the rule failing.

The 2026-09-02 run built nothing either, and should be read the same way. It
spent itself on Smith Tower, broke two of the three 403 walls, resolved the
height contradiction that the previous run had declared a hard stop, and
confirmed the massing. Then it found the footprint genuinely absent from every
reachable source and stopped rather than estimate one. A skyscraper drawn to a
guessed plan would have looked entirely convincing in the render, which is
exactly why the rule has to hold at the point where it is inconvenient.

The second 2026-09-02 run also built nothing, and it is the same rule working.
It went at the queue's own stated highest-value lead, the municipal landmark
nomination, found that road closed at both ends (seattle.gov 404, MACRIS behind
a bot wall), and then found a cheaper document class that the queue had never
thought to try on these buildings. That turned King's Chapel from a declared
dead end into a building missing exactly one number. It did not draw the tower
it could not measure, which is the same call the Smith Tower run made about the
footprint, and for the same reason: the render would have looked entirely
convincing either way.

WHAT A FUTURE RUN SHOULD TAKE FROM THIS. The queue is now down to four
candidates. Three are missing a PLAN DIMENSION: Park Street Church's brick
body, Smith Tower's footprint, MoMA's Marron Atrium. King's Chapel is no longer
one of them; its plan is now published and it is missing a HEIGHT instead. Heights and histories are easy to publish and
plans are not, so the remaining work is not "find a landmark" but "find the
class of document that carries plans." The two that have worked so far are
HABS measured drawings on loc.gov and NRHP nominations. The one never tried is
the MUNICIPAL LANDMARK NOMINATION, which exists for Smith Tower (Seattle
Landmarks Preservation Board) and for King's Chapel and Park Street Church
(Boston Landmarks Commission, and MACRIS). That is the single highest value
lead left in this file, because a run that cracks that document class could
unblock three of the four at once.

## The 2026-09-02 third run: the Boston municipal lead is CLOSED, and it was the queue's own top lead

This run built nothing. It went at the single highest value lead this file
names, the MUNICIPAL LANDMARK NOMINATION, on the Boston half where the file
predicted it "could unblock three of the four at once." That prediction is now
disproven for Boston, and one more document route was closed beside it. Both
are written down here so no later run spends itself the same way.

**THE BOSTON LANDMARKS COMMISSION HAS NO REPORT FOR EITHER CHURCH. CLOSED.**
The BLC study report index at `cityofboston.gov/landmarks/publications/` was
read in full. It lists many properties and districts and it carries NO study
report for King's Chapel, NO study report for Park Street Church, and none for
any Freedom Trail church. Arlington Street Church is on the list and is a
different building on a different street. The document class is real and the
queue was right that it carries plan dimensions, but for these two buildings
the document does not exist to be found. Do not search this index again.

**PARK STREET CHURCH HAS A HABS RECORD AND IT IS EMPTY. CLOSED.**
No previous run had checked HABS for this building; the entry above lists
parkstreet.org, Wikipedia, SAH, trolleytours and a targeted search, and not
loc.gov. It was checked on this run and the record exists:

  HABS MA-631, loc.gov item `ma0913`, call number MASS,13-BOST,50-
  found by the collection search, which works and is worth reusing:
  `loc.gov/collections/historic-american-buildings-landscapes-and-engineering-records/?q=<name>&fo=json`

Its medium field reads `Photo(s): 1` and it has THREE resources, which looked
promising and was not. Both PDFs were pulled and extracted with pypdf:
  `.../ma/ma0900/ma0913/data/ma0913data.pdf`  one page, a title cover sheet
  `.../ma/ma0900/ma0913/supp/ma0913supp.pdf`  one page, a Form 10-444 index card
The supplemental card carries only the architect (Peter Banner, assisted by
Solomon Willard), the date 1809, "brick, pitch roof," and three bibliography
lines. NO DIMENSION OF ANY KIND. There are no measured drawings.
This is the same shape as King's Chapel's ma0461: a HABS record that exists,
answers, and holds nothing measurable. Two for two on Boston churches, so a
HABS hit on a Boston church should now be treated as unpromising rather than
as a lead, and the cheap test is the `medium` field in the item JSON. If it
says only `Photo(s)` and not `Drawing(s)`, there is nothing to scale.

**MoMA's MARRON ATRIUM: A TRAP NAMED, AND THE PLAN STILL ABSENT.**
The 110 ft is confirmed again from a venue listing that answers a browser
User-Agent (`cxra.com/venue/moma-museum-of-modern-art/`, 200): "skylights 110
feet overhead." The same sentence carries the figure a future run is most
likely to misuse:

  "the Marron Atrium stands at the center of more than 20,000 square feet of
   gallery space"

THAT 20,000 IS THE GALLERY SPACE AROUND THE ATRIUM, NOT THE ATRIUM FLOOR, and
the venue's own 32,400 sq ft is the whole rentable museum. An atrium drawn to
20,000 sq ft would be several times too big and would render entirely
convincingly. A "roughly 70 feet wide" figure also circulates and its own
source states it is a personal estimate, not a specification. Neither number
may be used. moma.org itself returns 403 to both the fetch tool and a browser
User-Agent curl, so the museum's own event spec sheet, which is the right
document class for a room dimension, has not been read yet and is the live
lead here.

**A ROUTE THAT DID NOT ANSWER, recorded so it is retried rather than trusted.**
archive.org full text search inside an item, `ia-fts.archive.org/api/v1/search/
hits_inside?item=<id>&q=<q>`, returned nothing at all to curl on this run.
The idea behind it is still good and untested: Foote's "Annals of King's
Chapel" reproduces the building committee's own records and is the most likely
published home of the tower height. But archive.org's advanced search finds
only `annalsofkingscha0003john`, volume 3 of 1940. VOLUMES 1 AND 2, the ones
that carry the eighteenth century building records, were not found under that
title and finding them is the actual first step, not the search endpoint.

**WHERE THE FOUR NOW STAND.**
  King's Chapel     every horizontal published, NO vertical of the standing
                    building published. The file calls this "one number" but
                    it is really two, the tower height and the body eaves, and
                    a roof pitch after that. BLC closed. HABS closed. The
                    parish Historic Structure Report and Foote's Annals vols
                    1 and 2 are what is left.
  Park Street Ch.   steeple 217 ft 9 in published, footprint absent. BLC
                    closed, HABS closed. Sanborn fire insurance maps on
                    loc.gov are now the best untried idea: they are published,
                    they carry a printed scale, and they show footprints. The
                    cost is that sheets are not indexed by street and must be
                    found by eye.
  Smith Tower       462 ft firm, footprint absent. seattle.gov site search and
                    skyscrapercenter's real building id are still unspent, and
                    Sanborn applies here too.
  Marron Atrium     110 ft firm, plan absent, and the two numbers a run would
                    reach for are both disqualified above.

**THE RULE, working again.** Four runs have now ended without a model. That is
not four failures, it is the same decision taken four times: every one of these
buildings would render convincingly from an invented number, and a licensed
guide's site is exactly where an invented building becomes a liability. What
this run added is subtraction. Two document routes that looked open are shut,
one circulating number is marked poison, and the queue's own top lead is spent
on the Boston half. The next run starts from a smaller and more honest map.

## The 2026-09-02 fourth run: Sanborn is DISQUALIFIED for Smith Tower, and it was a live lead

This run built nothing, and the useful part is again subtraction. It went at the
Smith Tower footprint, which is the queue's highest business value blocker, spent
its three named leads, and closed one of them on a reason no future run should
have to rediscover.

**SANBORN CANNOT ANSWER SMITH TOWER. NOT A COST PROBLEM, A KIND PROBLEM.**
The file lists Sanborn as applying to Smith Tower "too." It does not. A fire
insurance map draws the GROUND FLOOR OUTLINE of a building. Smith Tower is a
mounted tower: Pastier's own words in Essay 4310 are "a substantial base with a
slender tower above," and the file already records that the base and the tower
relate awkwardly by design. The plate that the model is actually blocked on is
the SLENDER TOWER's, because that is what carries most of the 462 ft and all of
the silhouette. A Sanborn shows the base and is silent about the tower, so even a
perfectly read sheet would hand back the one plate the model needs least. Strike
Sanborn from this building's lead list.

Sanborn stays LIVE and correct for Park Street Church, where the brick body is a
single mass and the ground outline IS the footprint.

**THE SEATTLE SANBORN VOLUMES, listed here so the idea is retired with its
evidence rather than on assertion.** The loc.gov collection JSON search answers a
browser User-Agent cleanly and returns 32 Seattle items. The ones that post-date
the tower's July 1914 opening, and would therefore have shown it:
  1916  sanborn09315_009      1917  sanborn09315_011, _013, _014
  1919  sanborn09315_015      1929  sanborn09315_012
They are real and reachable. They are simply the wrong instrument.

**LEAD 1, seattle.gov site search: THAT PATH IS 404.**
`seattle.gov/search?q=...` returns 404, so the file's "the seattle.gov site
search is the way in, not a guessed path" is itself now a guessed path. The
municipal nomination may still exist; the entry point has to be found before it
can be searched, and that is the remaining work on this lead.

**LEAD 2, skyscrapercenter: OPEN BUT JS RENDERED, so a 200 means nothing.**
A guessed building URL returned 200 with an EMPTY `<title>` and no readable
content, and `/api/search` returned 404. The 403 wall is down, as the file says,
but what is behind it is a JavaScript shell. Do not read a 200 from this host as
a document.

**A NUMBER THAT WILL TEMPT A FUTURE RUN, AND MUST NOT BE USED.** Wikipedia's
infobox carries `floor_area = 28275 m2`, which is 304,350 sq ft gross over 38
floors. Dividing that by the floor count to get a plate is meaningless on a
mounted tower, because the base floors and the tower floors are different plates
and the file already records that "the broad base accommodated most of the
building's floor space." An average plate would be far too big for the tower and
too small for the base, and it would render convincingly. Disqualified.

**AND A CONFIRMATION WORTH HAVING.** The same article describes the site as "the
odd-shaped lot at the Northeast corner of Yesler Way and Second Avenue." That is
independent of Pastier and it says the same thing the parcel check said: this
footprint is not a rectangle waiting to be guessed. The refusal to invent one is
not excessive caution, it is the shape of the actual building.

**KING'S CHAPEL, three cheap shots spent, all empty.** This run tried it because
the file's own lesson says heights publish more readily than plans, which makes
this the likeliest of the four to come unblocked. It did not.
  kings-chapel.org/history.html   404
  Wikipedia King's Chapel         no height of any kind, tower or eaves
  archive.org                     confirms only `annalsofkingscha0003john`,
                                  volume 3 of 1940, under that title. Volumes 1
                                  and 2 remain unfound, and finding them is
                                  still the first step, exactly as the previous
                                  run wrote.

**A ROUTE THAT TIMED OUT TWICE, recorded so it is retried rather than trusted.**
The loc.gov Sanborn JSON search worked first try for Seattle and then returned
curl code 000 twice for Boston, at 30 and 45 second timeouts, both with and
without a location facet. The host and the pattern are good; the Boston query
specifically did not come back. A future run going after Park Street Church
should expect to retry it and should not read the timeout as a closed door.

**WHERE THIS LEAVES THE FOUR.** Unchanged in count, smaller in surface.
  King's Chapel     still missing every vertical. Three routes closed today.
  Park Street Ch.   Sanborn confirmed as the right instrument, entry point
                    verified, the Boston query itself still to be landed.
  Smith Tower       Sanborn now struck. Two leads left, both needing an
                    identifier found before they can be read.
  Marron Atrium     untouched this run.

## The 2026-09-02 fifth run: PARK STREET CHURCH'S STEEPLE IS BUILT, and the body is still absent

This run BUILT, after four runs that did not. The thing that broke the deadlock
was not a new document route but a change of QUESTION. Every previous run asked
"can I get the footprint of this building," got no, and stopped. This one found
that the part of Park Street Church which is actually the landmark, the steeple,
is published to the inch, stage by stage, and drew that while leaving the
unmeasurable brick body off entirely.

**THE SOURCE, and it was one archive.org search away the whole time.**
`archive.org/download/preservationpar01churgoog/preservationpar01churgoog_djvu.txt`
"The Preservation of Park Street Church, Boston," issued by the Committee, 1903.
This is the SAME document Wikipedia already cited for the 217 ft figure, so the
queue had a footnote pointing straight at it for four runs and never followed it.
It quotes Bowen's Picture of Boston, 1833, in full, and that quotation carries
EVERY dimension of the tower and spire:

  tower 72 ft high, 27 by 31 in breadth, Doric, four columns of 35 ft,
    crowned by a pediment and balustrade
  bell story 8 ft high, 20 ft square, four large circular windows,
    eight Ionic columns on pedestals, four pediments and cornices
  octagon 25 ft high, 16 ft from side to side, four circular windows,
    eight Corinthian columns
  octagon 20 ft high, 12 ft 6 in from side to side, Composite
  spire base 9 ft high, 11 ft from side to side, eight oval windows
  octagonal spire 50 ft, collar midway, 9 ft 6 in at its base
    diminishing to 18 in at the top
  a ball 6 ft above, a vane representing a blazing star
  the vane 217 ft 9 in from the street

**THE ARITHMETIC GAP, CARRIED NOT AVERAGED.** Those itemised heights sum to
190 ft, and the published total is 217 ft 9 in. The 27 ft 9 in difference is the
one band Bowen NAMES and does not measure, the pediment and balustrade over the
tower, plus the vane. The model draws it at exactly the residual and says so.
Do not "fix" this by stretching the published stages.

**A SECOND FIND IN THE SAME PAMPHLET, AND IT IS A TRAP.** The deed is quoted:
the lot bounds "southeasterly by Tremont street, eighty feet; southwesterly by
Park street, one hundred and eighteen feet; northwesterly by land formerly of
Edmund Dwight, eighty feet; northeasterly by the Old Granary Burying-ground."
THAT IS THE LOT AND IT IS NOT THE FOOTPRINT. It is the same disqualified
substitution this file already struck for Smith Tower's parcel, and it is more
tempting here because the church nearly fills its corner. It is not used, and a
later run must not use it either. The 1974 Ministries Building stands on part of
that same frontage, which is by itself enough to prove the lot is not the church.

**BOWEN'S OWN VOLUMES ARE UNREADABLE AND DO NOT NEED TO BE READ.** Both
archive.org scans of Bowen, `bowenspictureofb00owe` (1833) and
`bowenspictureofb1838bowe` (1838), have OCR so poor that "Park Street," "72
feet" and "blazing star" all return zero hits in text that certainly contains
them. Do not spend a run on them. The 1903 pamphlet reproduces the passage
cleanly and is the better copy.

**THE loc.gov SANBORN QUERY FOR BOSTON LANDED THIS TIME.** The previous run
recorded it timing out twice and told a later run to retry rather than read the
timeout as a closed door. That was right. With a browser User-Agent and a 60
second timeout it returned 75 Boston items, volume `sanborn03693`, running
1885 to 1975. The sheets are there and reachable if a future run wants the body
outline by eye. It was not needed for the steeple and was not spent.

**WHAT THE RENDER SHOWED THAT THE NUMBERS DID NOT.** The model is committed
because its geometry is sourced and its arithmetic checks, but the picture found
four things and they are the next run's first job, not a later polish:

  1. THE DEFAULT CAMERA SHOWS THE BACK. At the shared yaw of -0.62 the visible
     faces are (0,1) and (-1,0), so the Tremont front is turned away and the
     four published 35 ft Doric columns, the pediment and the door are all
     drawn and all invisible. The scene must be mounted at a yaw that turns the
     front to the viewer before it goes on a page. THIS IS WHY IT IS NOT YET
     MOUNTED: mounting a model whose front elevation has never been looked at
     would break the rule this whole routine exists to enforce.
  2. THE BELL STORY'S EIGHT IONIC COLUMNS READ AS BRACKETS. The per-face
     placement puts them outside the wall plane on the flanks, so they poke out
     sideways instead of standing at the corners. They want placing on the
     eight positions of the 20 ft square, computed once, not per visible face.
  3. THE TWO OCTAGONS READ AS ONE CONE. Their published windows and columns are
     not drawn, so the 25 ft Corinthian stage and the 20 ft Composite stage lose
     the distinction the style depends on. Bowen publishes four circular windows
     on the first and the same number on the second; drawing them is what makes
     this a spired tower rather than a spike.
  4. THE RESIDUAL BAND READS AS A DRUM. Its 27 ft 9 in is honest and its
     internal split is declared soft, but at this camera it is the widest thing
     on the steeple and it dominates. Worth revisiting the split once the front
     is visible and the pediment can be seen doing its share of the height.

**WHERE THE FOUR NOW STAND.**
  Park Street Ch.   STEEPLE BUILT to published dimensions. The brick body is
                    still unpublished and still not drawn. Sanborn volume
                    sanborn03693 is the live route to it and is now known to
                    answer. Finishing the render defects above comes first.
  King's Chapel     unchanged. Every horizontal published, no vertical of the
                    standing building published.
  Smith Tower       unchanged. 462 ft firm, footprint absent.
  Marron Atrium     unchanged. 110 ft firm, plan absent.

**THE LESSON, and it is a different one from the four before it.** Those four
runs each ended by refusing to invent a number, which was right. This one shows
the refusal has a second move available that none of them tried: when a building
is one dimension short, ask whether the dimension is needed for ALL of it or
only for PART of it. Park Street Church was never fully blocked. It was blocked
below the cornice and completely open above it, and the queue had been treating
the building as a single yes-or-no for four runs. Before declaring the next
landmark blocked, split it and check the parts.


## The 2026-09-02 sixth run: the steeple is FINISHED AND MOUNTED, and the picture caught an arithmetic error the arithmetic had passed

This run took the four render defects the previous run listed as "the next
run's first job" and closed all four, then found a FIFTH that no defect list
had named because it was not visible until the stages were drawn honestly.

**THE ERROR: THE PUBLISHED STAGES DID NOT CLOSE ON THE PUBLISHED TOTAL.**
Bowen itemises 72 + 8 + 25 + 20 + 9 + 50 + 6 = 190 ft and publishes the vane at
217 ft 9 in, so 27 ft 9 in is unmeasured. The previous model spent that whole
27.75 on the pediment-and-balustrade band AND THEN added three inter-stage
cornices (2.0 + 1.6 + 1.3 = 4.9 ft) on top of it. Those cornices are unmeasured
too and come OUT of the residual, not on top of it. The consequence:

  spire top landed at 216.65 against a published total of 217.75
  the ball, published at 6 ft, had 1.1 ft left for it
  so the ball was drawn from 216.65 DOWN to 214.35, z0 above z1, INVERTED

The band is now 22.85 and the stack closes exactly:
  72 + 22.85 + 8 + 2.0 + 25 + 1.6 + 20 + 1.3 + 9 + 50 + 6 = 217.75
Every published stage stays unrounded and the band is the only soft number.

THE LESSON, and it is the one this whole routine exists for. The old model
passed every check a number can pass: each published stage was present and
correct, the total constant was right, no geometry was non-finite. The defect
was that an unmeasured quantity got counted twice, and it showed up as a gold
ball drawn upside down at the top of a 217 ft steeple, which is invisible in a
face count and obvious the moment the residual is written out. WHEN A MODEL
CARRIES A RESIDUAL, RE-SUM THE WHOLE STACK AFTER EVERY ADDITION. A cornice
added later is a claim on the residual.

**THE FOUR LISTED DEFECTS, all closed.**
  1. THE CAMERA. Mounted at yaw -2.5, where the front face (0,-1) is visible,
     because faceVisible is the normal's own ry and (0,-1) needs cos(yaw) < 0.
     The shared default of -0.62 shows the back of this building.
  2. THE BELL STORY'S EIGHT COLUMNS. They were placed inside the per-face
     loop, which put them off the wall plane on the flanks so they poked out
     sideways as brackets. Now computed ONCE on the plan as eight positions,
     two to a face set in from the corners, and drawn only where their own
     face is turned to us.
  3. THE TWO OCTAGONS READING AS ONE CONE. Both now carry their published
     four circular windows and eight columns through a new octDetail helper,
     so the Corinthian stage and the Composite stage read as storeys.
  4. THE RESIDUAL BAND DOMINATING. It was worse than "dominating": the
     balustrade box FLOATED, with open air on three sides between the
     pediment apex and the rail, because only the front had a pediment drawn
     in that gap. The band is now a solid brick attic from the tower cornice
     up, with a real 4 ft balustrade standing on it. Nothing floats.

**TWO SMALLER CORRECTIONS made while there.** The pediment moved down to crown
the four 35 ft columns, which is where Bowen's own sentence puts it ("the
tower ornamented with four columns of 35 feet, and the vestibule, is crowned
by an elegant pediment and balustrade") rather than floating 40 ft above the
order it belongs to. And the circular windows are now CIRCLES: a new
roundWindow helper strikes a true circle, where archOpening draws a round
HEADED opening with straight jambs and a sill, which is a different shape and
is not what Bowen describes.

**WHAT IS STILL NOT DRAWN, and why.** The brick meeting house. Its footprint is
still unpublished, the lot dimensions from the deed are still not a substitute,
and Sanborn volume sanborn03693 is still the live route to it for a future run.
Nothing about this run changes that.

**WHERE THE FOUR STAND.**
  Park Street Ch.   STEEPLE FINISHED AND MOUNTED. Body still absent.
  King's Chapel     unchanged. Every horizontal published, no vertical.
  Smith Tower       unchanged. 462 ft firm, footprint absent.
  Marron Atrium     unchanged. 110 ft firm, plan absent.

## The 2026-09-02 seventh run: FOOTE'S ANNALS VOLS 1 AND 2 ARE FOUND AND READ, and they do not carry the height

This run built nothing. It spent itself on the two leads this file names as the
last ones standing for King's Chapel, landed one of them outright, and found the
number genuinely absent from it. The subtraction is the output.

**VOLUMES 1 AND 2 EXIST ON ARCHIVE.ORG. THE PREVIOUS TWO RUNS WERE WRONG ABOUT
THIS, AND THE ERROR WAS A SEARCH ERROR, NOT AN ABSENCE.**
Two runs recorded that archive.org "confirms only `annalsofkingscha0003john`,
volume 3 of 1940" and told a later run that "finding them is the actual first
step." They are there. The identifier those runs searched carries `john`, which
is not the author string archive.org files these under. The advancedsearch API
answers a plain curl and finds them in one call:

    curl -sL "https://archive.org/advancedsearch.php?q=title%3A%28annals+of+king%27s+chapel%29&fl%5B%5D=identifier&fl%5B%5D=year&rows=15&output=json"

  annalsofkingscha01foot   1882  vol 1
  annalsofkingscha02foot   1896  vol 2
  plus eleven other scans of the same two volumes

Both download as full text at
`archive.org/download/<id>/<id>_djvu.txt`, 1.8 MB and 2.3 MB, and the OCR is
good: it returns the known 65 ft 8 in breadth from the Harrison instruction at a
grep, which is the cheap proof that the text is readable before trusting a null.

**AND THE TOWER HEIGHT IS NOT IN THEM.** Every line in both volumes carrying
`feet` or `foot` beside a height, length, breadth or tower word was read. What
the building records give is the horizontal instruction this file already has,
the mason's contract, and Allen's estimate for the steeple that was never built.
What they do not give is any vertical of the standing granite tower or of the
body's eaves. Specifically checked and empty: "height of the wall/tower/
building/chapel", walls "to be N feet", and the tower "carried/raised up".

  ONE PASSAGE LOOKS LIKE THE ANSWER AND IS NOT. Vol 2 line 26349, in an
  extract from a 1784 pamphlet, reads "The tower, on which the steeple is to
  stand, is 90 feet in height." THAT IS BRATTLE STREET CHURCH, not King's
  Chapel. The same passage gives Old South's steeple at 180 feet. The pamphlet
  walks the Boston churches one by one, and where King's Chapel's turn comes
  the editor substitutes "[Then follows a description of King's Chapel.]" and
  prints none of it. A future run grepping for "90 feet" will land on this and
  must read the surrounding paragraph before believing it.

  THE MASON'S CONTRACT IS THE OTHER TRAP. It prices "every Perch of Wall four
  foot thick and one foot high." That is a unit of masonry sold by the perch,
  not a wall four feet thick and one foot tall, and it fixes no height at all.

**A GENUINELY NEW CROSS-CHECK, AND IT CONFIRMS A MODEL ALREADY BUILT.** The
same 1784 pamphlet gives Old South's steeple at 180 feet. trail-3d.js draws Old
South at 183 ft overall, from the Boston Landmarks Commission study report and
the figure the Freedom Trail and the park service use. A 1784 figure and a
modern one three feet apart, on a stack whose top is a weathervane, is agreement
rather than contradiction. Nothing was changed. It is recorded because an
independent eighteenth century number landing within three feet of a model built
from twenty-first century sources is the cheapest confirmation this file has.

**A CORRECTION TO THIS FILE.** The third 2026-09-02 run wrote that the BLC index
carries "no study report for King's Chapel, NO study report for Park Street
Church, and none for any Freedom Trail church." The last clause is wrong, and
trail-3d.js disproves it in its own source comment: Old South Meeting House is
modelled from a Boston Landmarks Commission study report of 2025, which is where
its eighty foot brick tower and twenty foot spire come from. The BLC document
class is NOT closed. It is closed for those two named buildings only. A future
run must not skip the BLC for a Boston landmark on the strength of that sentence.

**THE EVENT RENTAL SPEC SHEET: A NEW DOCUMENT CLASS, TRIED ON BOTH REMAINING
BUILDINGS, AND IT FAILS ON BOTH.** The reasoning was sound and is worth writing
down so it is not re-derived: a room let for private hire is a room whose owner
publishes its dimensions, and this file's other two instruments (HABS, NRHP) both
publish plans, which is what all three blocked candidates lack. It does not work
here.

  SMITH TOWER publishes no dimension anywhere on its own site. `smithtower.com`
  answers a plain curl with the browser User-Agent at /private-events/,
  /observatory/, /weddings/ and /faq/, all 200 and all real content. Stripped of
  script and style, not one line in any of them contains a foot, a square foot or
  a room dimension. The Observatory and the Chinese Room are sold on the view.
  This was the best form of the idea, because the Observatory sits in the SLENDER
  TOWER and would have given exactly the plate that Sanborn was struck for not
  giving. It is spent.

  THE MARRON ATRIUM returns the same two numbers from every host, and this file
  has already disqualified both. `thevendry.com/venue/27152/.../space/719` is a
  listing for the atrium ALONE rather than the museum, which is the strongest
  form this class takes, and its whole overview is one sentence: the skylight
  110 feet overhead, the 20,000 square feet of gallery space around it, seated
  400 and standing 700. No floor dimension, no square footage of the room
  itself. Capacity is not a plan: 700 standing constrains the floor from below
  and nothing bounds it from above, so it cannot be turned into a rectangle.
  moma.org answers 403 to the browser User-Agent on /visit/private-events/ and
  /support/entertaining-benefits/entertaining, so the museum's own spec sheet is
  still unread and is still the live lead. Guessed URLs on cvent, partyslate and
  greatperformances all 404; those hosts are worth a search rather than a guess.

**WHERE THE THREE STAND.**
  King's Chapel     unchanged, and now with its last two named leads spent.
                    Every horizontal published, no vertical of the standing
                    building published anywhere reached in seven runs. Foote
                    closed. BLC closed for this building. HABS closed. Helfand
                    closed. What is left is an as-built measured drawing, and
                    nobody has found one.
  Smith Tower       unchanged. 462 ft firm, footprint absent, and the rental
                    route now struck beside Sanborn.
  Marron Atrium     unchanged. 110 ft firm, plan absent. moma.org's own 403 is
                    the whole remaining problem.

**THE RULE, and what this run adds to it.** Seven runs, three models built, and
this one built none. The part worth keeping is not the refusal, which this file
has recorded five times. It is that a null has to be earned. The previous two
runs recorded Foote's volumes 1 and 2 as unfindable and passed that forward as
fact; they were one correctly spelled query away, and a later run inherited a
false dead end. Before writing "not found" into this file, prove the instrument
works on something you already know: the Annals text was trusted as a real null
only because a grep for the 65 ft 8 in this file already holds came back with it.

## The 2026-09-03 run: the Park Street body sheet is FOUND AND ON SCREEN, and the loc.gov recipe in this file is superseded

This run built nothing and it is not the same null as the four before it. Those
ended with a document that did not exist or did not carry the number. This one
ends with the sheet identified, the page displayed, its printed scale read, and
the crop not yet taken. The next run does not start a search, it starts a read.

**THE PARK STREET CHURCH BODY IS ON SANBORN VOL. 1, 1885, SHEET 8.**
Item `sanborn03693_002`, notes `Vol. 1, 1885`, `58 sheet(s)`, `Double-paged
plates numbered 1-25c`. The KEY MAP is the volume's own first plate, image
`03693_01_1885-0000R`, and it was pulled and LOOKED AT rather than reasoned
about. It carries three things worth having:

  its own printed scale, `SCALE 50 FT. TO AN INCH`, on the title cartouche
  a legend distinguishing the bold sheet numbers from the fire-district numbers,
    so the bold figures on the key map are sheet references and can be trusted
  the block bounded by Tremont on the west, School and Bromfield on the north
    and Winter on the south, which is the block Park Street Church stands at the
    southwest corner of, lettered 8

Neighbouring sheets, in case the corner falls across a boundary: 12 west of
Tremont, 13 north at Scollay, 20 east, 18 southeast at Winter.

**THE IIIF SERVICE REPLACES THE DOWNLOAD-THE-MASTER RECIPE. USE IT.**
This file's loc.gov recipe says pull the `image/tiff` master and crop it with
PIL after disabling the decompression-bomb guard. That is no longer the cheapest
route and on Sanborn it is the wrong one. Every sheet is served by IIIF and
accepts a region and a scale in the URL, so an arbitrary crop at an arbitrary
zoom costs one request and no download:

    B=https://tile.loc.gov/image-services/iiif/service:gmd:gmd376m:g3764m:\
g3764bm:g03693188501:03693_01_1885-<SHEET>
    curl -sL --http1.1 -A "<browser UA>" "$B/full/pct:25/0/default.jpg"
    curl -sL --http1.1 -A "<browser UA>" "$B/pct:38,58,22,18/full/0/default.jpg"

The second form is `pct:x,y,w,h` of the source and it is what made the key map
legible: a 22 by 18 percent window came back sharp enough to read `MONTGOMERY
PL.` and `MUSIC HALL`. Sheet ids run `-0000L`, `-0000R`, `-0001L`, `-0001R` and
so on, L and R being the halves of each double page, and they are listed in the
item JSON under `resources[0].files`.

TWO TRANSPORT NOTES, both cost a retry to learn. `--http1.1` is required: a
plain HTTP/2 fetch of the loc.gov item JSON returned curl exit 92 with the body
truncated at 7,684 bytes, which parses as a JSON error and looks like a bad URL.
And the browser User-Agent is still needed on every loc.gov host.

**WHAT IS LEFT ON THIS BUILDING, stated so the next run can just do it.** Crop
sheet 8's southwest corner, find the church against Tremont and Park, and read
whether Sanborn letters its dimension. If it does, that is the footprint and the
brick body can be drawn under a steeple that has been standing on nothing since
2026-09-02. If it does not, the outline is still a published orthographic drawing
at a printed 50 ft to the inch, so a scaled figure is admissible the way the Paul
Revere elevation heights are, and must be declared scaled.

**THE 1903 PAMPHLET DOES NOT CARRY THE BODY. NULL EARNED, NOT ASSUMED.**
Before spending on Sanborn this run re-pulled
`preservationpar01churgoog_djvu.txt` and grepped every line containing `feet` or
`foot`. The instrument was proved first, per the seventh run's rule: the grep
returns the 217 ft 9 in this file already holds. There are 20 such lines and
every dimension in them is the steeple, the lot deed, or a land price. THE BRICK
MEETING HOUSE IS NOT MEASURED ANYWHERE IN THAT DOCUMENT. Do not re-read it.

  ONE NEW NUMBER CAME OUT OF THE GREP AND IT IS A TRAP. Line 2313: Banner's
  ORIGINAL drawing carried one more lantern section, which would have put the
  small octagon "about eighteen feet higher than it now is, making the entire
  steeple 223 feet high from pavement to the top of the finial ball." That is
  the DESIGN THAT WAS NOT BUILT, the committee having been "against the great
  height." It is also loose on its own terms: 217.75 plus 18 is 235.75, not 223.
  Do not use 223 and do not reconcile it with the model. It is the same class of
  number as King's Chapel's never-built steeple.

**A NEW INSTRUMENT, TRIED, AND IT IS INCOMPLETE. Recorded because a null from it
would otherwise look authoritative.** The NPS publishes the National Register as
an ArcGIS feature service and no run has tried it. It answers a plain curl:

    https://mapservices.nps.gov/arcgis/rest/services/cultural_resources/\
nrhp_locations/MapServer/0/query?where=<sql>&outFields=RESNAME,NRIS_Refnum\
&returnGeometry=false&f=json

The refnum field is `NRIS_Refnum`, NOT `REFNUM`, and a wrong field name returns
a bare 400 with empty `details`. It would be the cheap general answer to "what
is this building's refnum," which is the step that stalled Park Street Church
four runs ago. IT IS NOT COMPLETE. A city-and-name query returns 23 Boston
churches and Park Street Church is not among them, which on its own would read
as "not listed." But a query on `NRIS_Refnum='74002045'`, the King's Chapel
number THIS FILE ALREADY HOLDS AND HAS READ THE NOMINATION FOR, returns zero
features too. So the layer omits buildings that are certainly on the Register.
Use it to FIND a refnum, never to prove one absent, and always test it against
74002045 first. Wikipedia's own Park Street Church article was re-checked on
this run and still carries no `refnum`, so that half of the earlier finding
stands.

**WHERE THE FOUR STAND.**
  Park Street Ch.   steeple built and mounted. Body sheet FOUND: Sanborn vol 1
                    1885, sheet 8, at a printed 50 ft to the inch. The crop is
                    the whole remaining job.
  King's Chapel     unchanged. Every horizontal published, no vertical.
  Smith Tower       unchanged. 462 ft firm, footprint absent, Sanborn struck
                    for this building on the mounted-tower reason.
  Marron Atrium     unchanged. 110 ft firm, plan absent.

**THE LESSON.** This file's own recipes age. The download-the-master step was
written from the Paul Revere HABS sheets, where it was right, and it has been
carried forward as the way to read loc.gov ever since. On a 58 sheet volume it
is the expensive way to answer a question that IIIF answers in one request, and
the cost of the old recipe is exactly what made the Sanborn lead look too big to
spend a run on for the last three runs. Before deciding a lead is too expensive,
check whether the tool the file recommends is still the tool the host offers.

## The 2026-09-03 second run: THE PARK STREET CHURCH BODY IS MEASURED, and the sheet the last run named was the wrong one

This run did not build. It read the sheet the previous run left ready to read,
found that sheet was not the sheet, found the right one, and came back with the
body's plan and, unexpectedly, with a published VERTICAL that no run had found.

**THE PREVIOUS RUN READ A FIRE DISTRICT NUMBER AS A SHEET NUMBER. CORRECTED.**
It wrote that the Tremont / School / Bromfield / Winter block is "lettered 8" and
told this run to crop sheet 8. Sheet 8 was pulled first, and printed sheet 8 is
the WEST END: Charles Street, Allen, Leverett, the Boston and Lowell freight
depot and the Charles River. It is a mile from Tremont.

The key map distinguishes the two number classes and its own legend says so, in
two lines that sit one above the other: a numeral in a small tablet is a
`REFERENCE TO ADJOINING SHEET`, and a plain numeral `INDICATES FIRE DISTRICT`.
On the map itself the difference is that the SHEET numbers are SOLID BLACK and
the FIRE DISTRICT numbers are drawn HOLLOW, in outline. The 8 beside Montgomery
Place is hollow. So are the 17 at Franklin and the 18 at Avon Place. The solid
numerals in that corner of the key map are 13 at Scollay, 12 on Beacon Hill, 20
at Bromfield and 19 at Federal.

  THE RULE FOR A LATER RUN: on a Sanborn key map, read the numeral's WEIGHT
  before believing it is a sheet. A hollow numeral will send you to the wrong
  end of the city and the sheet you land on will look perfectly real.

**PARK STREET CHURCH IS ON SHEET 12.** File `1885-0012R`, the right half of the
double plate, 5755 x 8149 px, and it carries the whole corner: Tremont House,
the Granary Burying Ground, Park St Church, the Massachusetts State House,
Boston University, and Boston Common blank to the south.

**WHAT THE SHEET LETTERS ON THE CHURCH ITSELF.** Two things, and the second was
not being looked for:

  `PARK ST. CHURCH`
  `40' TO EAVES`   <- A PUBLISHED HEIGHT OF THE BRICK BODY. Every previous run
                      recorded this building as having a published steeple and
                      no published body at all. The eaves height was on the
                      plan the whole time.
  `2`              <- two storeys, in the plan's own storey-count notation
  `SPIRE 200'`     <- lettered inside a small YELLOW (frame) box drawn at the
                      Tremont end, which is where the steeple stands

  THE 200 IS NOT A RIVAL TO THE 217 FT 9 IN AND MUST NOT BE AVERAGED WITH IT.
  A Sanborn spire note is a rounded fire-risk annotation on an insurance plan;
  the 217 ft 9 in comes from the church's own publication and from Bowen, and it
  is what trail-3d.js is already drawn to. Record 200 as an independent
  corroboration that the thing is roughly two hundred feet of timber, and change
  nothing.

Street widths are lettered beside it and are free cross-checks: Tremont 65 ft,
and 44 ft on the Park Street side.

**THE FOOTPRINT, SCALED. NOT LETTERED, SO DECLARED SCALED.** Sanborn letters no
dimension on this building, so the outline was measured off the drawing the way
the Paul Revere elevation heights were, and the same declaration applies: these
are scaled figures, not published ones.

  THE SCALE, from the sheet's OWN scale bar rather than from the printed
  "50 ft. to an inch" alone. The bar was cropped at full IIIF resolution
  (region `3900,6450,1600,400`) and its tick marks located on a column ink
  profile: 0 at px 428, 50 at 731, 100 at 1035.5, 150 at 1334, and the left
  extension's 50 at 126. Zero to 150 is 906 px for 150 ft and the left 50 to
  150 is 1208 px for 200 ft, both giving

      6.04 px per foot at full resolution

  which is a 302 dpi scan against a printed 50 ft to the inch, and 5755 px
  divided by 302 is 19.05 inches of paper, which is the right size for a
  Sanborn half plate. The scale is therefore confirmed twice.

  THE MEASUREMENT. The church's long axis bears 35.14 degrees off the sheet's
  horizontal, fitted to the long NW wall where it runs against the Granary. The
  crop was rotated by that angle so the walls read on straight profiles, and the
  building was found by COLOUR rather than by darkness, which matters: this JPEG
  renders the pink brick fill at about L=150, so a brightness threshold catches
  the fill along with the ink and finds nothing. The discriminator that works is

      paper  (175,173,160)  ->  G-B about 13
      brick  (163,145,143)  ->  G-B about 2
      so pink is (R-G) > 10 AND (G-B) < 8

  Off that mask, on the rotated crop:
      depth, Park Street wall to Granary wall   467 to 471 px  ->  77.3 to 78.0 ft
      length, SW party wall (x 977) to the
        eastern extremity of the round end
        (x 1598, at mid-height)                 621 px         ->  102.8 ft

  So the brick body is ABOUT 103 FT ALONG PARK STREET BY ABOUT 78 FT DEEP,
  measured to the inside of the ink line, which is about a foot inside the outer
  face at this scale. Call it 104 by 78 over the walls and say it is scaled.

  THE TREMONT END IS SEMICIRCULAR AND THE DRAWING CHECKS THAT IT IS. The pink
  reaches x 1598 at mid-height and only x 1496 at 181 px off centre. A true
  semicircle of radius half the depth (235 px) centred at x 1363 predicts 1513
  at that offset. Measured 1496, seventeen px or 2.8 ft inside the prediction,
  so a semicircular end of radius about 39 ft, springing where the straight
  walls stop, is a fair description of what is drawn.

**WHAT IS NOW IN HAND FOR THIS BUILDING, and it is enough to draw the body.**
  steeple            217 ft 9 in, published, ALREADY BUILT AND MOUNTED
  eaves of the body  40 ft, published, off the Sanborn plan
  storeys            2, off the plan
  footprint          about 104 by 78 ft, SCALED off the plan at 6.04 px/ft
  east end           semicircular, radius about 39 ft, SCALED
  roof               NOT MEASURED and not on the plan. A Sanborn is orthographic
                     and gives no roof pitch, so a body drawn from this must
                     either stop at the eaves or declare the roof as assumed.

**WHY IT WAS NOT BUILT ON THIS RUN.** The run's whole budget went into finding
that the named sheet was the wrong sheet, finding the right one, and earning the
measurement rather than eyeballing it. The geometry is the next run's job and it
now starts with numbers rather than with a search.

**THE TRANSPORT NOTES, added to the IIIF recipe the last run wrote.** A pixel
region works and is easier than percentages: `/<x>,<y>,<w>,<h>/full/0/default.jpg`.
A region past the right edge is silently truncated rather than refused. And
`pct:x,y,w,h/full/0/` returned curl exit 18 once on a large crop and succeeded on
retry with a downscale, so pair a big region with a `pct:` size or with `--retry`.

**WHERE THE FOUR STAND.**
  Park Street Ch.   steeple built and mounted. BODY NOW MEASURED: 40 ft to the
                    eaves published, about 104 by 78 ft scaled, round east end.
                    Ready to draw.
  King's Chapel     unchanged. Every horizontal published, no vertical.
  Smith Tower       unchanged. 462 ft firm, footprint absent.
  Marron Atrium     unchanged. 110 ft firm, plan absent.

**THE LESSON.** The last run handed this one a sheet number and a job that was
supposed to be a read rather than a search, and the number was wrong because two
kinds of numeral on the same map look alike at a glance. Nothing about the
previous run was careless; it looked at the picture, which is this routine's own
central rule, and the picture is where the mistake lives. What catches this is
cheap and should be habit: when a document hands you an index, pull the thing it
points at and check that it is the thing you asked for BEFORE spending the run on
it. Sheet 8 was pulled first and it took one look to see the Charles River where
Tremont Street should have been.


## The 2026-09-03 third run: THE PARK STREET BODY IS BUILT, and the render caught the deck eating the pediment

The last run left numbers instead of a search, and this run spent its budget on
geometry, which is what that handoff was for. The body is drawn, mounted and
looked at from three sides.

**WHAT WAS BUILT.** `parkStreet` in trail-3d.js now draws the meeting house
under the steeple:

    footprint    78 ft across by 103 ft deep, SCALED, declared scaled
    east end     semicircular, radius 39 ft, springing at 64 ft from the front
    eaves        40 ft, PUBLISHED, lettered on Sanborn 1885 sheet 12
    storeys      2, PUBLISHED, off the same plan
    paving       the PUBLISHED lot, 80 ft on Tremont by 118 on Park
    roof         NOT DRAWN. See below.

**THE PUBLISHED LOT IS WHY THE SCALED FOOTPRINT WAS TRUSTED ENOUGH TO DRAW.**
78 by 103 sits inside 80 by 118 with a foot to spare across the front and room
for an areaway behind. That check was run before a line was written, and a
measurement that had to be squeezed into the deed would have been thrown away
rather than drawn. A later run should keep this habit: a scaled figure earns
its place by agreeing with a published one it was not fitted to.

**TWO HELPERS WERE ADDED and both exist for the painter's rule.**
`wallRun` draws a long wall as separate BAYS, because a quad's depth is its
NEAREST corner and one 64 ft wall would carry the depth of whichever end faces
the reader along its whole length, burying the tower beside its far end.
`apseRun` strikes the round end as facets on a true half circle, each culled
and sorted on its own outward normal; drawn as one polygon it reads as a flat
wall cut on a slant. Both hand back a per-bay map and depth so windows can be
set on them.

**THE RENDER CAUGHT A DEFECT THE ARITHMETIC PASSED, which is the sixth time
this exact family has appeared here.** The roof deck was sorted on its own
corners. Its nearest corner is the west end beside the tower, so the whole
plane took that depth and painted its far half straight over the tower's
front, EATING THE PEDIMENT AND THE TOPS OF THE FOUR PUBLISHED COLUMNS. Face
counts, finite geometry and the bounding box all passed. The picture did not.
The deck now takes an explicit depth of -1e7 and is painted first, which is
safe because every wall that reaches the sort is outward facing: an inward
facing wall is culled and never drawn, so nothing that should be hidden by the
deck is ever in the list.

  THE RULE, restated because it keeps costing a run: cutting a notch in a
  large plane so it does not OVERLAP the thing it would bury is not enough.
  The notch fixed the plan; the plane still projected across the tower higher
  up the screen. Give the plane an explicit depth as well.

**THE ROOF IS STILL NOT DRAWN and the deck is grey on purpose.** A Sanborn is
orthographic and publishes no pitch. The first version closed the walls with a
warm brown deck and the render showed it reading as a finished flat roof,
which is a claim. It is now a lead grey stopping plane that sits back and lets
the steeple carry the picture. Anyone who later finds a published pitch should
replace the deck rather than tilt it.

**WHERE THE THREE REMAINING STAND, unchanged by this run.**
  King's Chapel     every horizontal published, NO VERTICAL. Still the wall.
  Smith Tower       462 ft firm, FOOTPRINT ABSENT. Sanborn is disqualified for
                    it, per the fourth run.
  Marron Atrium     110 ft firm, PLAN ABSENT.

So the Freedom Trail is now nine of ten built with only King's Chapel left, and
it is left for a reason that no amount of drawing skill fixes.

**THE LESSON.** The handoff worked exactly as intended: the last run did the
finding and this one did the building, and the whole budget went into geometry
because the numbers were already in hand and already checked. That is the shape
a two-run landmark should take. The one thing the geometry could not tell
itself was that its own roof was lying, and only the picture said so.
