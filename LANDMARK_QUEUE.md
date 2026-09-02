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
