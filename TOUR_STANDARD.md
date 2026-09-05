# How to build a tour, anywhere

[SEAN 2026-09-05: "gather all the experience you have gained from modeling,
writing and mapping etc. I want you to use the same experience to routinely
create similar tours across the world."]

This is the method behind the Freedom Trail and the National Mall, written down
so the next one does not relearn it. Everything here was paid for once already,
most of it by shipping something broken and finding out afterwards.

Read `MODEL_STANDARD.md` beside this. That one governs a single building. This
one governs a whole tour.

---

## What a finished tour is

Not a page. Six things, and a tour is done when all six are true:

1. **A route.** Ordered stops with real coordinates, real walking distances and
   honest times, including how long a visitor actually spends inside each one.
2. **A model per stop**, built to `MODEL_STANDARD.md` from published dimensions.
3. **A story per stop**, in all five languages, written as a guide speaks.
4. **A recording per stop**, made from a script, in the site voice.
5. **A page** that carries all of it and can be reached from the site.
6. **A way in.** A sitemap entry, a site-index entry, and a link on a page a
   visitor already reads.
7. **Its artifacts in the Universal Gallery**, if any stop is a museum.

Seven is not decoration. A tour that scores six out of seven reaches nobody, and
this site has shipped that twice: `/tours` existed for months linked from
nowhere, and eighteen Mall models were served by a route no page called.

---

## The order of work, and why

**Route first, always.** Every other piece hangs off the stop list, and the stop
list is the only part that needs a human judgment about what is worth seeing.
Get the coordinates right at this stage, because models, maps and audio all key
off them.

**Then stories, then audio.** A recording is made FROM a story. Nine of the
eighteen Mall stops are silent today for exactly one reason: no story exists to
record. Writing the story is the bottleneck, not the voice.

**Models last, and continuously.** They are the most expensive piece, about
1.7M subagent tokens each at full standard, and a tour is usable before they
land because every stop falls back to honest massing. Never block a tour on them.

---

## The route

- Coordinates from a real source, never estimated. Wikidata `P625` is usually
  enough and is checkable.
- Walk the order the way a person actually walks it, not the order of
  importance. The Mall runs Capitol to Jefferson because that is the line of
  the ground.
- **Say when a distance is estimated.** The Mall's 3.86 miles are straight lines
  between stops because the routing service failed, and the page says so in
  plain words. A routed distance and a straight-line distance can differ by a
  third. Never present one as the other.
- Time inside a stop is a separate number from time walking, and visitors care
  more about the first. Both go on the page.

## The stories

- One voice: a good guide standing there, telling you the thing you cannot get
  from a sign. Second person. Concrete. No brochure language.
- Three lengths, and the visitor chooses: short 30 seconds, mid 2 minutes,
  long 5 minutes. Roughly 78, 310 and 775 English words.
- **Five languages or none.** The story routine picks entries with no `story_en`,
  so writing English alone marks the entry finished forever and it is never
  revisited. This has cost real work twice.
- Facts get the same treatment as dimensions: if it is not published, it does
  not go in. A licensed guide's page is a liability when it is wrong.

## The audio

- The recording is made from `guide_scripts.json`, **not** from the book story.
  They are different texts. A stop can have a story and still be silent, which
  is exactly what the Botanic Garden was until someone noticed.
- A script runs at least **450 words**, about three minutes. The pipeline refuses
  anything shorter rather than recording a stub.
- Numbers are written as words, because a reader has to say them.
- `voice_guides.py --only <slug>` records one stop on its own budget. It costs
  real money on Sean's ElevenLabs account, so it is his call every time.
- After recording, **set the `audio` field on the book entry.** The pipeline says
  so in its own closing line, and without it the Destination Book and the Trip
  Planner still think the stop is silent.
- A page must never discover recordings by probing for them. See the traps.

## The artifacts

[SEAN 2026-09-05: "any museum or artifact related, put in the universal gallery
so people can easily search those artifact", "please take those into your job
flow".]

Every stop that is a museum owes its objects to `/universal-gallery`. This is
not optional polish.

I wrote here an hour ago that the search reaches the Met and the Art Institute
and nothing else. That was wrong, and testing it found out: it also reaches
MoMA, Wikidata, and through them the Getty, Museum Folkwang, the Science Museum
and the Smithsonian. A search for the Hope Diamond does return the Hope Diamond.

The real gap is different and worse. It returns the museum's **catalogue line**.
Nine of the eighteen National Mall stops are museums and the gallery holds not
one written piece about any object in them, so a visitor searching the Wright
Flyer gets a photograph of Orville Wright and two windows by Frank Lloyd Wright,
because the actual aircraft has nobody's writing attached to it.

What goes in is not a catalogue line. The museum already publishes those and
anyone can get them. **What a visitor cannot get anywhere else is somebody
telling them what to notice in the two minutes they are standing there**, which
is why the written piece is the product and the facts are arranged around it.

One entry in `gallery_items.json` under `items`, keyed `<museum>:<item number>`:

    "si-air:A19540209000": {
      "title":       "1903 Wright Flyer",
      "artist":      "Wilbur and Orville Wright",
      "date":        "1903",
      "museum":      "National Air and Space Museum",
      "city":        "Washington",
      "item_number": "A19540209000",
      "where":       "The Wright Brothers gallery, second floor",
      "script":      "gallery_scripts/wright-flyer.txt",
      "teaser":      "One sentence that makes someone walk over."
    }

and the writing itself in `gallery_scripts/<slug>.txt`, in the same voice as the
stories: second person, spoken, concrete, no brochure language.

**Pick three to six objects per museum, not everything.** A gallery of two
hundred entries nobody wrote properly is worth less than six a visitor actually
stands in front of. Choose the objects a guide would walk someone to.

## The map

- Leaflet, already vendored. Muted tiles, a bold route line, quiet dots at the
  stops, no numbered pins, because the numbers are already in the list beside it.
- Call `invalidateSize()` after layout and **before** `fitBounds`. A map created
  in a grid cell that has not settled will paint tiles for a width it no longer
  has and leave the rest grey.
- The map and the model are twins. Selecting a stop in either moves both, and
  neither is decoration for the other.

## The page

[SEAN 2026-09-05: "DC tour built was excellent lets align most of the builds
approach with it and we will do more adjust later".]

**`national-mall.html` is the reference implementation.** New tours are built to
its shape rather than invented, and the older pages are brought toward it as
they are touched, not in one sweep. Its shape:

- The model opens on the first stop, not the whole route. A two mile route at
  true scale is an honest picture and an unreadable one, and the map beside it
  already shows where the walk goes.
- **A way back that cannot be missed.** This site shipped a model with no exit
  once. Every drill-down needs a visible way out.
- Stops list, map, model, story, photo, player, all reading the same selection.
- Distances, times and gaps stated plainly, including what is missing.

---

## The traps, all paid for

**A finished thing is not a shipped thing.** Three times in two days: eighteen
Mall forms served by a route no page loaded, five rebuilt trail and New York
buildings the same, and a tours page linked from nowhere. The cure is that a
page **asks** what exists (`/api/forms/<family>`, `/api/dc-forms`) instead of
naming files by hand. A routine that finishes a building every three hours will
outrun anyone's memory to edit markup.

**Verify the whole chain, not the piece you changed.** The tours booking form
posted to `/api/tour-inquiry` for months and no such endpoint existed. The form
was fine. The page was fine. The enquiries were lost.

**Never probe for files.** Asking for eleven recordings that do not exist means
eleven 404s on every visit, and an expected error teaches everyone to ignore
errors. It cost an hour of this audit: twelve console errors, eleven of them
by design, hiding the one that was not. Read a manifest.

**Clear every piece of per-stop state on every path.** Wrong-building and
wrong-audio bugs both came from state surviving a selection change. The player
was hidden in two places and stopped in one, so the guide kept talking with the
controls gone.

**Stopping audio takes pause, detach and load.** Removing the source leaves the
media attached and Safari keeps playing it.

**A save before metadata deletes what it is restoring.** Position memory must
refuse to write while `readyState < 1`, or loading a track wipes the place it
was about to return to.

**A new visitor page blocks the language build** until every line is translated.
Budget the translation with the page, not after it. And version the packs: the
engine builds the pack URL in script, so the HTML asset rewriter never sees it
and a rebuilt pack reaches nobody who has visited before.

**Look at the picture.** Face counts and bounding boxes have passed a floor
painted over a whole room, a glass wall covering a temple, a tree growing on a
roof, and one building drawn under another building's name.

---

## Choosing the next city

Rank on what Sean can actually sell, not on fame:

1. **A city he guides in.** Seattle before Rome, always.
2. **A walkable spine.** A tour needs a line, not a scatter. The Mall has an
   axis, the Freedom Trail has a painted line on the pavement.
3. **Published dimensions.** A city whose landmarks nobody has measured cannot
   be modelled to the standard, and guessing is forbidden.
4. **Existing book entries.** Stories and coordinates already written are most
   of the work.

On that ranking the queue after Boston and Washington is Seattle, then New York,
where the book is deepest.

---

## Cost, honestly

A full-standard building is about 1.7M subagent tokens. A tour of eighteen stops
modelled to standard is therefore roughly 30M, which is not a single sitting.
That is why the order of work puts route, stories and audio first: they are
cheap, they make the tour usable, and the models improve it afterwards without
anyone waiting.

Never run two model workflows at once. A run that dies in review leaves builds
on disk and no verdicts, and a result with zero verdicts reads as a pass unless
someone checks.
