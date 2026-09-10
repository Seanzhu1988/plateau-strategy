# The polish ledger

[SEAN 2026-08-30: "can you create a routine for corner repair or trimming, I
believe the website needs alot of those, i also want you to work on perfecting
3D models little at the time, if we do any work everyday we can move a
mountain."]

One small pass a day, written down so the next day knows what happened. The
daily task is `site-polish-daily`. Two jobs each run, in this order:

1. **Corner repair.** Find and fix things that are visually wrong: crooked,
   overflowing, oversized, misaligned, clipped on a phone, a button that does
   not look like a button, a label that promises the wrong thing. Fix two or
   three properly, not ten badly.
2. **One 3D increment.** Take the top item off the 3D backlog below, build it,
   verify it by looking, move it to done.

## The rules that do not change

- Verify by LOOKING, in a browser, before claiming anything is fixed. The
  giant logo, the crooked map and the oversized tab were all found by eye and
  none of them by reading code.
- Sean's own words stay verbatim wherever he supplied copy.
- No long dashes anywhere.
- Never `git push --force`. If a push is rejected, rebase onto origin/main;
  the other session writes to the same branch.
- The task COMMITS but does not push. Sean pushes. Leave the commit list in
  the day's entry.
- Measure before believing: an element that "looks fine" can be 1,224 pixels
  tall on someone else's screen.

## 3D backlog, worked one at a time

- [x] The idle spin ignores `prefers-reduced-motion`. **Done 2026-08-31**,
      same shape the trail uses, but read live each frame so changing the
      setting takes effect without a reload. Proved with a control: two
      bridges mounted side by side, one told to stop animating, and across
      real painted frames only the control turned.
- [x] The bridge's Gothic arches do not read at the current scale.
      **Done 2026-09-01** with the second camera rather than thicker profiles,
      because the profile was never the problem: at the whole-span framing one
      opening is about SIX pixels across on a 1000px box. That number was
      derived from the camera constants (33.75 ft x 0.115 units per foot x 2.6
      zoom x sin 0.62 = 5.9 viewBox units) and then confirmed independently
      against the rendered SVG, which measures one half-arc at 3.0px. At the
      tower camera the same opening is 35px across and 123px tall. Thickening
      a line inside a six pixel hole would only have made it a solid smudge.
- [x] The bridge labels sit on top of the deck. **Done 2026-09-02** with an
      ink skyline: the box is cut into 240 columns and every piece of
      STRUCTURE that gets drawn records how high and how low it reaches in
      each one, deliberately not the flat ground and water planes, which a
      word reads perfectly well against. A label moves to the nearer clear
      edge of that ink and a leader is drawn back to its dot; the dot never
      moves. Measured at 1100px against the pre-change file at the same
      camera angle, in viewBox units of text sitting on the drawing: bridge
      39.0 to 0.0, Empire State 28.4 to 0.0 (its 'Fifth Avenue' pair had the
      same defect and was not on the list). A lift is only taken if it lands
      inside the box and on no other label. Where there is nowhere to go, at
      the tower framing and on a phone, the label keeps exactly the position
      the old code gave it and is haloed instead.
- [x] Vertical drag: turn is horizontal only, so nobody can look down on the
      Empire State or up from street level. **Done 2026-09-03.** One aim()
      takes yaw and pitch together, so a diagonal drag costs one draw and not
      two, and a horizontal drag is byte for byte the old behaviour (measured:
      dragging 100px sideways moves yaw 0.60 and pitch exactly 0). The floor
      is -0.14 everywhere, a shallow worm's eye, and it was measured rather
      than picked: at that angle nothing on either model leaves its box. The
      ceiling is per view, because the drawings run out of room at different
      angles and the bounding box was read against the 720 x 620 viewBox at
      every fiftieth of a radian: the span leaves the top of its box at 0.46
      so it stops at 0.44, the tower is nine times zoomed so it stops at 0.30,
      and the Empire State holds to 0.75, far enough to look down on the
      setbacks and the roof. No label leaves its box at any tilt in any of the
      three framings, checked at seven angles. On a touch screen .lm-stage is
      touch-action: pan-y, which is left alone on purpose: the browser keeps
      every vertical gesture, so a finger still scrolls past the model rather
      than being caught by it, and tilt there is a mouse, trackpad or stylus
      gesture.
- [x] Open it up, the way the Met's model does: the Empire State splitting to
      show the two observatory decks inside. **Done 2026-09-04.** It splits at
      the two heights this model already named, 1,050 and 1,224 ft, so the
      lower mass stands still, the piece between the decks rises 150 ft and
      the mast and antenna rise 300, leaving each deck in clear air on top of
      the piece it belongs to. Both floors are drawn in the promenade
      blue-grey, not limestone, because a floor the colour of the wall reads
      as the top of a box; the 86th gets a parapet ring, the 102nd a glass
      one, which is the only difference a visitor is actually choosing
      between. Two things had to be measured rather than guessed. The
      drawing grows 300 ft when it opens, so the whole model is scaled by
      tip / (tip + two lifts), which holds the antenna on the same line at
      any openness: measured across 105 angles, the full turn by five tilts
      from the -0.14 floor to the 0.75 ceiling, not one label leaves the
      720 x 620 box, worst 331.7 to 589.2 across and 112.5 to 615 down. And
      a floor is invisible edge-on: at the opening pitch of 0.22 a 128 by 96
      ft deck projects five units tall in a 620 unit box, so the eye rises to
      0.55 with the tower, as a floor and never a ceiling, so a reader who
      already tilted higher keeps their angle. Closed is proved unchanged
      rather than assumed: the model drawn from the old file and from the new
      one are the same 15,341 bytes of SVG, byte for byte.
- [x] Phone framing: both models are drawn for a wide screen. **Done
      2026-09-05**, and the answer was not a portrait camera. Measured first:
      the lift built on 2026-09-02 was never firing on a phone, because a
      label block is 2.9458 x fT tall and wants 3.3625 x fT + 4 units of clear
      air, which is 132 units at the phone type size against the 48 the frame
      offers, so fits() refused both directions and all three labels fell back
      to the halo and lay across the deck. The frame now grows by exactly that
      shortfall, above and below, and the eye drops by the same so the drawing
      keeps its place. That alone was worth almost nothing, 88.8 units of text
      on the drawing to 84.0, and it would have been dishonest to ship it as
      the fix: the real constraint is that the three labels are 490, 349 and
      267 units wide in a 980 box and collide with each other, so whoever is
      placed last has nowhere left. Placement now goes WIDEST FIRST, since a
      wide label has the fewest places it can fit. Together: 89.0 units to
      44.3, three labels on the drawing to one, and that one is haloed. Both
      changes are opt-in per scene, which the Empire State paid for: applied
      to everything, widest-first took it from 117.8 to 121.2, so it is gated
      and the tower is byte for byte what it was. Desktop proved unchanged the
      same way, every label and every leader at the identical coordinate at
      1000px. The Empire State needs no portrait camera: it is 1.16:1, gets a
      276px box on a phone against the bridge's 111, and every label of its
      seven that touches the drawing is already haloed.
- [x] The bridge deck is drawn level, which is true, but the roadway actually
      rises toward midspan. **Done 2026-09-06**, and the datum was wrong as
      well as the shape: deckH was 127, the navigational clearance everyone
      quotes, not the roadway height anywhere in particular. The published
      pair is 119 ft 3 in at the towers and 135 ft at the centre, a climb of
      15.75 ft, drawn as a parabola through the two towers and midspan. The
      300 ft approach stubs are held level rather than invented, because no
      figure for the grade down to the anchorages was found. Worth 4.47
      viewBox units of lift in a 340 unit frame at the span camera, over a
      deck 388 units long, and 8.0 units of the climb at the tower camera.
      120 checks, a full turn by five tilts in both framings, no label out of
      its box, and on a phone all five labels land at the identical
      coordinate before and after.
- [x] Empire State: the base is 424 by 187 ft, so from some angles it reads
      as square. Verify the footprint proportion on screen against the number.
      **Done 2026-09-07**, and the sweep is wider than the claim. Measured on
      the page's own projection, not derived: at the default camera, yaw -0.7
      and pitch 0.22, the base draws 98.9 by 37.3 viewBox units, 2.65 to 1
      against a true 2.267. Through a full turn at that pitch the drawn ratio
      runs 10.39 to 1 along the short face down to 0.495 to 1 along the long
      one, passing through 1.000 at yaw 249 degrees and by symmetry at 69, 111
      and 291. The honest number is drawn at exactly four angles of 360: 45,
      135, 225 and 315. A closed-form check of the same projection puts square
      at 68.9 degrees, agreeing with the measurement to a quarter degree, so
      two routes agree. The base is no sliver either, 98.9 units of a 720 box
      and 17.9 tall. None of it is an error: a 424 by 187 ft building
      foreshortens exactly like that, and faking it would break the page's own
      promise that every dimension is real. The defect beside it was that the
      page never stated the plan, all four fact cards being heights, so a
      reader stopped at a foreshortened angle had nothing to correct them. A
      fifth card carries the footprint and the know block explains the swing,
      in the same voice the bridge uses for its six-pixel arches.
- [x] Draw the footprint on the model, not only on a card. **Done 2026-09-08**,
      and the drawing was the easy half. Two dimension runs lie in the ground
      plane, 30 ft off the wall each measures, with a tick at each end and a
      witness line back to the corner, so they foreshorten by exactly the
      amount the wall beside them does: that is the whole point, and it is why
      a card could not do it. Each run is built on the side the eye is on,
      because lines in this renderer carry no depth test at all and are painted
      after every face, so a run left on the far side is drawn straight through
      the limestone. Which side is near is arithmetic, not taste: a ground
      point's depth is (x sin yaw + y cos yaw) cos pitch, so the long run
      follows the sign of cos yaw and the short run the sign of sin yaw.
      Three things had to be measured, and two of them were my own defects.
      First, the label engine LIFTS a block off the drawing to the nearer clear
      edge, which is right for a label that names a thing and wrong for a
      figure that measures one: "187 ft" was carried from the pavement to y 75,
      beside "1,454 ft to the tip", 285 units above the run it belongs to. So a
      mark may now be pinned, and a pinned label keeps the place its point
      gives it. Second, pinning alone put text on text: 39 overlapping label
      pairs across a full turn by three tilts against none before, 32 of them a
      dimension figure written across "Fifth Avenue", because the pavement is
      the one place the engine's step-down search cannot use. A pinned label
      now tries its own line, then one up, then one down, then two of each, and
      if none is clear it is NOT DRAWN, which is this page's own rule from the
      phone framing: absent beats shoved. Third, `r: 0` did not remove the dot,
      because `m.r || 4` reads a deliberate zero as "not given"; the bridge
      form file had already met this and worked around it with `r: 0.01`.
      The sweep, on the rendered SVG: a full turn by five tilts from the -0.14
      floor to the 0.75 ceiling, open and closed, 1,076 and 1,074 label blocks,
      **no label outside the 720 by 620 box and no text on text**, against 840
      and 0 before. Ten figures of 480 are dropped rather than shoved. My
      "appending the two marks last cannot disturb the four already placed" was
      WRONG and the measurement caught it: the runs join the ink skyline, which
      moved the Fifth Avenue block up to 20.7 units at some angles. At the
      phone framing the three overlapping pairs are **identical with and
      without the footprint**, so this adds none there; they are a pre-existing
      defect of that framing, noted below.
- [x] The Empire State setback widths are the only numbers in either model with
      no stated source. **Done 2026-09-09**, and the finding is that one width
      is real and the rest are not. The 60 ft setback above the 5th story is
      published and takes 424 to 304, which is the table's first entry. The
      same rule on the 187 ft face gives 67 against the 172 drawn, and 67 is
      impossible on the page's own 28 ft window-to-core figure, so the depth
      column is unsourced from its first entry down. Above floor 21 nothing is
      published, and the widths falling 36, 36, 36 then 28, 28 give away that
      they were constructed. Named indicative at the table, in the header and
      on the page. Executable code proved identical, 646 lines either side.
      NOT done, and left as its own item below: redrawing them. `nyc-3d.js` carries a steps table, 304, 268, 232, 196,
      168 and 140 ft at floors 21, 25, 30, 72, 81 and 85, while baseW and baseD
      trace to the published 424 by 187 and every height traces to a published
      figure. The page promises every dimension is the real one, so either
      find the published plan widths and cite them in the comment beside the
      table, or say in the comment that the massing steps are indicative, the
      way the window bands and the parapet heights already do.

## Also on the list

- [ ] **The Empire State setback depths are the fat side of plausible, and
      redrawing them is a separate job from admitting it.** Measured
      2026-09-09: the model draws 172 ft at the first setback where the
      published 60 ft a side would give 67, and the page's own quoted 28 ft
      window-to-core limit suggests a real plate nearer 116. Correcting the
      column would narrow the silhouette, so it needs a cited plan width per
      setback first, and then the full label sweep the other geometry changes
      got, a turn by five tilts open and closed. Do not do it from arithmetic
      alone: the whole point of the 09-09 entry is that a plausible-looking
      number with no source is what got us here.
      **Searched 2026-09-10 and BLOCKED on sources.** The published record
      carries exactly one setback width, the 60 ft above the 5th story that
      is already in the table, and nothing at all above floor 21. Leasing
      material publishes RENTABLE square feet per floor, not plan dimensions,
      and NYC rentable is grossed up over usable by an unstated loss factor,
      which is why the 78th reads 23,186 sq ft against a drawn gross of
      19,824: the number can neither confirm nor disprove a width. The
      original Shreve, Lamb and Harmon drawings are in Columbia's Avery
      archive and are not online. So this stays open, and what it needs is an
      archive visit or a published plan, not another search.

- [ ] **Yiki's Chinese trail overview runs 6:26 against Jason's 5:09**, and
      the page calls both a five minute narration. Measured by
      `script_lengths.py`: `freedom-trail-zh.txt` is 1,468 characters, 386
      seconds, against a long-tier band of 969 to 1,311. The English is 797
      words, 309 seconds, inside its band. So it is the Chinese that drifted,
      by about 157 characters. Left alone deliberately on 2026-08-31: the
      commit that made this file rewrote it "from translationese into a
      person talking", and trimming a narrator's voice in a hurry is how that
      work gets undone. Do it as a deliberate edit, or decide the label
      should not promise five minutes.

- [ ] **The map is 83% full and cannot take many more rooms.** `map_lint.js`
      now catches overlaps, strays and crowding, and fixed the two collisions
      that were already there. But the real ceiling is coming: the schematic
      is 760 wide and the rooms sit where they really sit, so new galleries
      cannot simply be packed in. When the lint reports above 88%, widen the
      sheet rather than shrinking rooms.


- [ ] **38 composed strings across the visitor pages still bypass the
      translator** (was reported as 29; the linter itself was blind to
      single-quoted strings containing HTML attributes, which is nearly every
      innerHTML line, and now is not), found by `i18n_untranslated.py` after the Freedom Trail
      bug. Worst first, because these are the flagship free tools:
      trip-planner (6), universal-gallery, destination-book, booking,
      landing-page, articles, discovery, factor-clock, favorite-place,
      footprint, agent, renter, guide-studio, deck. Each is the same repair:
      route it through psxFmt so the pattern translates and the values drop
      in, then add the pattern to i18n_extra.py in all four languages. A few
      per pass. Run the detector to see the list shrink.


- [ ] The gallery's "not found" signal is weak, and now we can see it. A
      deliberately nonsense query, "a painting that does not exist anywhere",
      came back with sixteen results, because Wikidata answers almost anything
      loosely. So record_gallery_miss almost never fires and the "asked for and
      not found" list stays empty while real demand hides inside the hits. Fix:
      judge a search answered only when the top result is a strong match
      (exact item number, or a title that actually contains the query), and
      record the rest as unanswered.

- [x] **Label pairs overlap on the Empire State at the phone framing.**
      **Done 2026-09-10**, and two of the three reported pairs never existed.
      Measured on the rendered SVG, a full turn by nine tilts at a 276 px
      stage, 5,561 label blocks: ONE collision, "open air, 1,050 ft, the one
      people mean" across "the entrance and the line", identical closed and
      open, every instance at the 0.75 tilt ceiling, no "Fifth Avenue" pair
      and nothing outside the box. Nor is it simply a narrow stage: at the
      ceiling the count runs 14, 6, 0, 0, 4, 8, 2 at widths 260, 276, 290,
      321, 340, 375, 420 and zero from 500 up, non-monotonic in type size
      against the box, so no width gate and no single ceiling answers it.
      The fix suggested here, giving a named label the pinned figures' local
      search, was built and measured WORSE, 6 pairs to 60: an upward step
      takes the one clear line a later label had, that label then finds
      nothing and falls back onto an earlier one. Reverted; nyc-3d.js is byte
      for byte what it was. What works is two marks in the other order. The
      86th block is 471 units wide against Fifth Avenue's 301 and must choose
      first, which is the bridge's own roomForLabels rule bought without the
      flag that also grows the frame. After, at the ceiling: 340 goes 4 to 0,
      375 8 to 0, 420 2 to 0, 276 6 to 1, 260 14 to 9, and at the two widths
      this page really produces, 266 at a 320px viewport and 321 at 375, the
      full turn by nine tilts is ZERO overlaps and zero outside the box,
      closed and open. Label positions are identical at 1000, 321 and 266 on
      a normalised sweep that ignores paint order, and dropped dimension
      figures are unchanged at 18, 62 and 80 of 240.

- [ ] The 3D models' own labels (Manhattan tower, the promenade, 86th floor,
      and as of 2026-09-01 also "the pointed arch" and its note, so this debt
      grew by two rather than shrank)
      are drawn inside the SVG by nyc-3d.js, so build_i18n never sees them and
      they stay English on a translated page. Adding them to i18n_extra.py is
      easy; the care needed is that the models re-render on every animation
      frame, so a naive fix makes the translator re-walk the DOM sixty times a
      second. Translate the labels at draw time instead.
- [ ] Japanese is a long way behind the others (654 entries against 1,747).
      It lives in its own file, i18n_ja.json. One page per day.
- [ ] Pages still below 80% in the main four: universal-gallery 75%,
      articles 75%. Small gaps, quick wins.

## Done

### 2026-09-10
Checkers first: map sound at 83% full, 35 composed strings, 161 scripts with
the one deliberately deferred Chinese overview out of band. All three
unchanged after the day's work.
Trimmed: the trip planner's six map controls were bare glyphs painted
straight onto the map tiles. The page writes them as a 34px white chip with
a soft shadow; modern.css strips background, radius and shadow off every
button with !important, and the exception block that exists for icon
controls, whose own comment promises they "keep their own shape", only ever
took the underline off and gave the padding back. Nothing gave the shape
back. Measured before: background rgba(0,0,0,0), border 0, radius 0, shadow
none, against Leaflet's zoom control at the same x with rgb(255,255,255) and
a 2px radius, and Leaflet keeps its box only because those are <a> and the
rule reaches <button>. After: all six at rgba(255,255,255,0.96), radius 9px,
shadow 0 2px 8px, 34 wide, 44 tall on a phone and 34 on a desktop. Scoped to
this one container: .itin-tools writes background:none itself and means it,
verified unchanged. The follow control's lit state went the same way and had
been dead longer, the page painting it #1b4d8f without !important, so
"follow my position" looked identical on and off; proved pre-existing by
deleting today's rule from the live sheet, then fixed at the same weight.
Also swept and clean: every internal link on every page resolves against the
360 routes, and /trip-planner, /moma and /tours show no overflow, no clipped
text and no sideways scroll at 375.
3D: closed the phone-framing label item, and the finding is that the fix it
proposed makes things five times worse. Numbers in the item above and in the
commit. The setback-depth item was searched and is BLOCKED on sources: one
width is published, nothing above floor 21 is, leasing square footage is
rentable and grossed up so it cannot settle a dimension, and the original
drawings are in an archive that is not online. Recorded there rather than
guessed at.
Two lessons worth keeping. A CSS transition frozen in a hidden browser pane
outranks even an inline !important, because transitions sit above important
author styles in the cascade and rAF is paused while the pane is not shown,
so any colour read off a transitioned property there is the OLD value: three
separate measurements said black-on-navy until transitions were disabled.
And in this pane the viewport emulation is lost on every navigate, which
once produced a header reading 1,144 defects with every link at a negative
x, all of it an artifact of clientWidth 0. Re-apply the size after every
navigate, and abort a sweep that sees a viewport under 300.
Commits: "The trip planner's six map controls were bare glyphs on the map
tiles" and "Empire State: the last text-on-text goes, and the obvious fix
was wrong".
Note: the branch was 5 behind and 6 ahead of origin/main and was NOT rebased,
because another session has seven uncommitted files in this worktree. None
of them overlaps the four files upstream touched.

### 2026-09-09
Trimmed: the Share button on /book was drawn **325 by 25** in a 375 px header,
a 13:1 pill with the glyph parked at the far left, against **33 by 44** on
/universal-gallery. Cause was not the header, which is a row with
align-items: center and the button at flex-grow 0; it was booking.html's own
inline `button { width: 100% }`, written for its big blue submit and inherited
by an injected button that never named a width. Ids outrank a bare tag
selector, so `#psxShare` now sets `width: auto !important; flex: 0 0 auto`,
which defends all three injected buttons against any page that adds such a
rule later. That fixed the shape and left it orphaned at the far LEFT on its
own wrapped line, because plantShare falls back to `(right || head)` and
booking.html has no `.right` group, so a direct header child now takes
`margin-left: auto` and returns to the one place a reader looks. Measured
after: /book **33 x 25 at x 322**, right edge 355, against /walks x 314 and
/universal-gallery x 314; at 1280 px /book is 81 x 32 ending at 1260 against
/tours and /rent-a-tesla at 82 x 32. Controls unchanged on every other page,
same width, same height, same x. Also swept: all 55 internal links resolve
against the 360 routes, and the geometric sweep found no overflow, no clipped
text and no sideways scroll on /tips, /walks, /destination-book, /landmarks at
375 and 1280.
3D: closed the setback-source item, and the answer is one number real and the
rest not. The floors are published and so is exactly one width: the setback
above the 5th story is 60 ft deep on all sides, which takes the 424 ft face to
424 - 120 = 304, and 304 is the first entry in the table, so it is real. The
same rule on the 187 ft face gives 67 while the model draws 172; neither is
citable, and 67 cannot be right because the page's own quoted limit of about
28 ft from window to core puts a floor plate nearer 116. Above floor 21 nothing
is published, and the table's own shape convicts it: the widths fall **36 ft a
step** from 304 to 196 then **28 ft a step** to 140, and the depths fall 12,
12, 16, 14, 14. Real setbacks follow lot lines and a zoning envelope and do not
land on a repeating decrement. So they are named INDICATIVE MASSING at the
table, and the two places that promised otherwise were corrected: the file
header's "EVERY DIMENSION HERE IS REAL" now carries the one stated exception,
and the page's lede and its honest paragraph now tell a reader which numbers
were drawn to look right rather than measured. The drawing is untouched and it
was proved rather than assumed: strip every comment and string-safe scan both
versions and the executable content is **646 lines before and 646 after,
identical**.
Checkers after: map sound at 83%, 35 composed strings and 127 scripts with 3
out of band, all three unchanged, no regression.
Commits: "The Share button was 325 px wide on /book, and the cause was the
page's own button rule" and "Empire State setbacks: one width is published,
the rest are indicative, and the file now says so".

- **2026-08-30 · the styles book.** The Brooklyn Bridge towers are Gothic
  Revival and their openings had been drawn as triangles. A Gothic arch is
  two-centred: two circular arcs struck from centres on the far side of the
  springing line. Built `STYLES.md` and `styles-3d.js` so the rule is written
  once for every model that follows, then rebuilt the bridge on it. Against
  the straight line it replaced the true arc bulges 4.36 ft. Added the
  spandrel (without it a pointed opening is a rectangle with a line on it)
  and radiating voussoir joints. Tower height corrected 278 to 276.5 ft.
  Caught in the screenshot: the first spandrel had its outline out of order
  and bricked up all four openings while every number in the file was right.


### 2026-08-30
Trimmed: the front page's second rental card was still bright and linked while
its twin was greyed, so the page advertised a product under reconstruction;
both now match and the page carries zero live rental links. The film button
promised "3 minutes" over a 73 second film.
3D: built the two New York models and caught two of my own defects by looking,
towers drawn as two posts rather than three piers with two arches, and a
header logo rendering 1,224 pixels tall that pushed both models off screen.
Translation: found why the globe kept looking broken, see below.

### 2026-08-31
Trimmed: the Brooklyn Bridge told a visitor two different tower heights. The
model's own label said 278 ft while the fact card beneath it and the geometry
in the file both said 276.5; the label was the only thing left over from
before yesterday's correction. Then the models' labels, which were unreadable
on a phone and measurably so: 3.9 CSS pixels for a name and 3.4 for the note
under it on a 375px screen, with dots 1.3 pixels across, because the text was
sized in viewBox units and the viewBox is squeezed to 321px there. They are
now sized against the box's real width, 12.5 and 10.9 pixels at any screen
size, dots 4.2. Making them readable made them collide and run off the edge,
which the first screenshot caught, so they also gained an edge flip, a clamp
that keeps a label inside the box, and a stagger that drops a label a line
when it would land on one already placed. Measured after: every label on both
models sits inside its box at 375px, none overlapping. Desktop is untouched,
12.3 units against the old 12, no flips.
3D: the idle spin now respects prefers-reduced-motion, the top backlog item.
Caught in my own fix by measuring, not by reading it: label size is worked out
at draw time and nothing redrew on resize, so a window that changed width kept
labels sized for the old one. Fixed with a ResizeObserver, since the idle turn
cannot be relied on to do it, it does not run for a reader who stopped
animation, nor once someone has taken hold, nor while the tab is in the
background.
Checkers: map sound, 83% full. i18n 37, unchanged, none attempted today.
Script lengths 1 out of band, recorded above rather than rushed.
Commits: one, because all three changes live in nyc-3d.js and I staged the
whole file, "The bridge stops telling two different tower heights, its labels
become readable on a phone, and the models hold still for anyone who asked".
Note: four files in this worktree (destination-book.html, destinations.json,
landmark_stories.json, landmarks.html) were another session's uncommitted work
and were left untouched. Nothing was rebased for the same reason; origin/main
was one commit ahead at the time.

### 2026-09-01
Trimmed: two things, both found by looking and then pinned with a number.
Three mastheads (walks, site-map, driver) carried /icon-192.png as their logo,
which loads cleanly and is a thin empty ring: drawn to a canvas it is 0.8%
non-white pixels against the real mark's 80.2%. Forty other pages carry
/plateau-logo.svg and now these do too. Second, the destination book's
masthead at 375px: the nav will not shrink and the header will not wrap, so
min-width:0 took the wordmark down to a ZERO WIDTH BOX, and a zero width box
with visible overflow still PAINTS, so "Home" sat on top of "Solution".
Measured: box 0px, text 57px, four lines, header 93px. The home page already
had the cure (its .logo-text clips), so that was the control and the same rule
now covers every masthead. After: no brand box taller than one line on any
page checked, destination book 93px to 75px, book 93 to 85, articles 78 to 75,
no page's scrollWidth moved off 375, desktop provably untouched.
3D: the top backlog item, the arches. A second camera rather than thicker
profiles, and the numbers above say why. Three defects in my own work, each
caught by looking rather than by reading: cables painted over the front of the
tower because lines are drawn after faces and are not depth sorted, so only
the near half is drawn now; the far tower and four hundred stays were being
computed off-canvas sixty times a second; and the height label was cut off by
the top edge, so it moved from 26 ft above the parapet to 2, and the view
carries two labels rather than three because on a phone the third simply
stacked on the masonry. Control for the whole change: the span view still
renders byte for byte what it rendered before, 124,502 characters, identical,
proved by running the pre-change file and the new one side by side.
Learned, worth keeping: the buttons needed !important. TWO sheets flatten a
plain button, modern.css to a word with a rule under it and paper.css to a
near black slab, and only modern.css exempts .chip. An id-prefixed selector
alone loses to both, which the ledger's own rule did not say.
Checkers: map sound, 83% full. i18n 39, up two from 37 because another session
added strings, none attempted and none added by me. Script lengths 1 out of
band, the same Chinese overview, left alone again on purpose.
Commits: "Three mastheads stop showing an empty circle, and a wordmark with no
room stops painting over the nav" and "The Brooklyn Bridge gets a second
camera, so its Gothic arches are something you can actually see".
Note: destinations.json is another session's uncommitted work and was left
untouched. Nothing needed rebasing; the branch was 4 ahead of origin/main and
0 behind at the start and stayed that way.

### 2026-09-02
Trimmed: two, both measured before and after. The masthead's nav strip wanted
466px in a 335px row at 375px and scrolled, but its scrollbar is hidden on
purpose, so THREE items sat past the right edge with nothing on screen saying
so, including Book a Ride, the one link on this site that earns money. The
strip wraps now. Each link still refuses to break inside itself, so the old
"Book / a / Ride" down a 35px column cannot come back; a wrap happens between
links, never inside one. Swept sixteen pages: fourteen unchanged, trip planner
three hidden to none, walks one to none, no page's scrollWidth off 375, and
desktop still one row at 1200px. It costs 47px of masthead on the two pages
that were hiding something. Second, the trip planner's second form row used a
bare 1fr, which is minmax(AUTO,1fr), and the native date input's min-content is
165px, so that row came out 165/136 and ran 23px past the grid's own right edge
while the State and County row above sat at 139/139. Now 139.31/139.31 ending
at 332, flush, and a field left alone on the last row takes the whole row, which
is what stopped Traffic reading "Auto (by time of da": 152px of text with 248px
of room now, against 98.
3D: the top backlog item, the labels on the deck, done with an ink skyline plus
leaders, and a halo for the labels that have nowhere to go. Numbers above.
Two defects in my own work, both caught by measuring rather than reading: the
first lift put a bridge label clean off the bottom edge on a phone because the
block height ignored the note's descender and the four units above the title,
twenty units at phone type sizes; and the checker itself identified leaders by
their opacity, and the Empire State draws 64 glass edges at that same opacity,
so it was quietly deleting them from the ink map. Leaders carry a class now.
Also worth keeping: requestAnimationFrame does not fire while the browser pane
is hidden, so a verification loop that waits on it hangs, and the models stand
still, which makes a clean before/after at one camera angle but is not a test
of the spin.
Checkers: map sound, 83% full. i18n 39, unchanged, none attempted. Script
lengths 1 out of band, the same Chinese overview, left alone again on purpose.
Links: all 54 internal hrefs across sixteen pages answer 200.
Commits: "The masthead stops hiding Book a Ride behind an invisible scrollbar,
and the trip planner's form rows line up" and "The model labels get out of the
drawing, and the ones with nowhere to go get a halo".
Note: destinations.json is another session's uncommitted work and was left
untouched, verified by checksum across the rebase. The branch was 1 ahead and 2
behind origin/main at the start and was rebased with --autostash.

### 2026-09-03
Trimmed: two, and the second turned out to be one defect wearing nine faces.
First, the tours page's "Which tour" menu cut its own prices off at 375px:
the widest option wanted 331px of text in a box with 238px of room before the
chevron, so a customer choosing a tour read "Cruise Terminal Walking Tour:
$75/" with the arrow sitting on the "p". The labels are now 174 to 227px and
whole. Worth recording: the first check used the select's scrollWidth, which
CAPS at clientWidth and reported a clean 281/281 for strings that did not fit
at all, so the real measurement is the text drawn to a canvas in the select's
own font.
Second, the masthead wordmark. It was the only thing in the row allowed to
shrink and the nav refuses to, so on nine pages it had been squeezed to a
stub or to nothing: the destination book 2px, which paints as a stray vertical
stroke between the mark and "Home", the home page and trips 0px, booking 79,
articles 114, driver, renter, agent 189 and partners 183, every one cut
mid-word. The row wraps now, so the nav drops to its own line when it cannot
share one and does not move at all on the eight pages where everything already
fits. All nine read 194px and whole; measured across 22 pages, no page's
scrollWidth moved off 375 and no masthead element sits outside the viewport.
It costs 36px of masthead on seven of them, 49 on booking, and the trip
planner is 3px shorter. Underneath the home page's 0px was a separate bug: the
mobile rule sized `header .logo` to 30px square, and every .logo on this site
is a DIV wrapping the mark and the wordmark together, so it was squeezing the
wordmark inside it to zero. It is `img.logo` now. The home page nests its own
row, so it wraps one level down; wrapping the outer header there stranded the
share button on a third line, 143px against 112px measured.
Rejected with numbers rather than by taste: hiding the wordmark on phones
costs no height and looked right on the destination book, but the Met and MoMA
carry a wordmark and no image at all, so hiding it leaves those mastheads
empty. That is what decided it.
3D: the top backlog item, vertical drag. Numbers above.
Caught in my own work: shortening the tour labels orphaned their four
translations, and build_i18n refused to write the packs until every visible
visitor line had one, which is the gate doing its job. Writing the new ones
then found a defect I had not gone looking for: measured in the select's font,
the Spanish labels came out at 256 and 254px and the Korean "Not sure yet" at
279, all over the same 238px budget, the Korean one from before today. Every
option in every language now fits, verified live by switching the page to
Spanish and measuring what rendered.
Checkers: map sound, 83% full. i18n 39, unchanged, none attempted and none
added. Script lengths 1 out of band, the same Chinese overview, left alone
again on purpose. The four language packs were diffed key by key against HEAD:
five added, four removed, one changed, all mine, no drift from the other
session.
Commits: "The tour menu stops cutting off its own prices, and a wordmark with
no room stops being a stray stroke", "The models tilt as well as turn, with
the floor and every ceiling measured against the box" and "The four packs
learn the shortened tour labels and the new turn line".
Note: destinations.json is another session's uncommitted work and was left
untouched; its checksum changed twice during the pass, so that session was
writing while this one ran. The branch was 1 ahead of origin/main and 0 behind
at the start and needed no rebase.

### 2026-09-04
Trimmed: two, and both were numbers that contradicted themselves.
On the Freedom Trail the banner said "44 min of walking ... about 6 hr 14 min
altogether" while the summary six rows below it said 43 min and 6 hr 13, on
the same screen. The banner read trail.walk_min_total, a total stored beside
the legs rather than added up from them, and it had drifted: the sixteen legs
sum to 43 and the stored number said 44. The National Mall's stored total is
79 against legs of 79, which is what settled which of the two was wrong. Both
lines are now added from the same legs, skipping the first stop's the way the
summary already did, so they cannot disagree again whatever the file says.
Checked that the Downtown half still moves only the summary: 11 stops, 17 min,
banner still 43.
On /tips every one of the 26 summaries ended without its full stop, because
the first sentence was taken with split(".") and the separator went with it,
so each one read as an unfinished fragment. Three were also cut at exactly 150
characters and two of those mid-word, one ending "and it tells you what t".
The stop goes back on, and a summary too long for the line now stops on a
whole word with an ellipsis. Measured after: 26 of 26 end in punctuation,
3 end in an ellipsis, none mid-word.
3D: the top backlog item, the Empire State opening up. Numbers above.
Caught in my own work, twice. The new chips and their sentence were English
in every language, and lengthening the existing turn line would have orphaned
its four translations, so the original sentence is left exactly as it was and
the new one stands on its own. Adding them found that build_i18n has been
REFUSING to write any pack at all, blocked by one untranslated visitor line,
"The whole walk, all sixteen", which is in HEAD and is nobody's work today. It
is translated now and the packs write again. Diffed key by key against HEAD:
four added in each of the four languages, none removed, none changed, all
mine, no drift from the other session.
Also worth writing down: a fix can look broken because the page is cached.
The asset stamp is the newest .js mtime and is right, but the HTML carrying it
was served from the browser's own cache, so the page kept loading the previous
script and the camera work appeared to do nothing. A query string on the page
URL settles it.
Checkers: map sound, 83% full. i18n 39 composed strings, unchanged, none
added. Script lengths 1 out of band, the same Chinese overview, left alone
again on purpose.
Commits: "The trail stops printing two different walking times on one screen,
and a tip summary stops ending mid-word", "The Empire State opens at its two
observatory floors" and "Four packs learn the opened tower, and start writing
again".
Note: the branch was level with origin/main at the start and needed no rebase.

### 2026-09-05
Trimmed: one, and it was hiding the site's three most-linked museums.
The Destination Book's city filter listed the same city twice: "New York" and
"New-York" side by side, and "Washington DC" beside "Washington-D-C", plus
three chips printing a slug where a city name goes, "Los-Angeles",
"South-Kensington", "Stadtbezirk-Ii-Essen". So tapping New York reached 55 of
57 New York places and Washington DC 38 of 39, and the three it could not
reach were the Met, MoMA and the Smithsonian, which are exactly the museums
the Universal Gallery links to. Root cause: app.py already had a guard for
this, and the guard was comparing the wrong shapes. Its alias table is written
in words ("new york", "washington, d.c.") but discovery.py hands the book a
SLUG, _slug("New York") is "new-york", and no slug is in any tuple, so
_same_chapter never matched and each new spelling opened a rival chapter.
Every separator now collapses to one space before anything is compared, on the
key, the label and the alias alike, so "washington-d-c" and "washington, d.c."
both read as "washington d c". _heal_chapters groups on that normalised name
rather than the raw label, which is what lets it fold DC at all: "Washington
DC" and "Washington-D-C" are two different strings however you case them, and
only the alias table joins them. A label that is exactly key.title() was
written by the machine from the slug and gets its separators taken back out; a
real name never matches that test and is left alone. Verified on a copy before
anything was written: 13 unit checks, 140 entries in and 140 out, the split
folded 55 to 57 and 38 to 39, Toruń and Chicago correctly NOT folded, and a
second pass is a no-op. Chip row 13 to 11, one New York, one Washington DC, no
slug on the page, and the Met and the Smithsonian now render under the right
chip. Caught in my own fix by measuring rather than reading: healing the live
book AFTER the shipped-book merge duplicated three museums, 140 entries became
143, because the merge matches a shipped row to a live one on (city, name) and
the live rows were still under the old key. It heals before the index now, and
a live copy carrying the split was booted on to prove it: 140 in, 140 out,
zero duplicate rows, 12 chapters to 10.
3D: the top backlog item, phone framing. Numbers above.
Caught in my own work three times, each by measuring and not by reading. The
first version of the checker never redrew, so it reported the same ink and the
same 38.2 unit type at 266px and at 846px, which is the 2026-09-02 note about
requestAnimationFrame not firing in a hidden pane wearing a different hat; the
models only move when something asks them to. The second version counted
leaders by the class lm-leader when they carry psx-lead, so it reported zero
lifts at every width when lifts were being taken all along. And restoring a
file from a snapshot I had taken BEFORE a later edit silently threw that edit
away; the grep that caught it is now the habit.
Also worth writing down: an element measured while document.hidden is true has
no layout at all, clientWidth 0, and the model then draws at its 12 unit type
floor. That produced an accidental but real control, since the floor is
exactly where the new frame adds nothing.
Checkers: map sound, 83% full. i18n 40 composed strings, up one from 39
because another session added one, none attempted and none added by me. Script
lengths 1 out of band, the same Chinese overview, left alone again on purpose.
Links: all 11 pages checked answer 200.
Commits: "One city, one chapter: the book stops listing New York twice and
hiding the Met behind the second one" and "The bridge labels get off the deck
on a phone, by growing the frame and letting the widest label choose first".
Note: dc-form-indian.js and gallery_items.json are another session's
uncommitted work and were left untouched, verified by checksum at the start and
at the end. The branch was 1 ahead of origin/main and 0 behind and needed no
rebase.


### 2026-09-06
Trimmed: two, and the first was yesterday's repair coming undone by a second
route. The Destination Book listed "Washington DC" and "Washington-D-C" side
by side again. _heal_chapters folds the split correctly; the shipped-book
merge then undid it in the same breath, because the cities loop at the end
asks only whether a shipped key is missing from the live book and the heal is
exactly what made it missing. The row under the retired key then failed to
match its live twin, which the heal had moved to the canonical key, so it was
appended a second time and the curated fields rode on the duplicate rather
than on the row the page renders. Healing the shipped copy first, in memory
and never on disk, makes both loops speak the same keys. Fixture carrying the
split: 3 entries in and 4 out before, 3 and 3 after. A live disk already
carrying the damage: 11 chapters to 10, 196 entries in and 196 out, nothing
lost, no duplicate rows. On the page at 375px, 22 chips to 21. Ten checks
cover the repo file never being written, a second pass being a no-op, a clean
book keeping every chapter and still gaining its fields, a visitor's own
chapter surviving, and a genuinely new shipped chapter still arriving.
Second: the Trip Planner's State, County and City row. On a phone it is a two
column grid, and the rule that hands a whole row to a lone last field gave it
to City, which needs the least. The two menus that need the most shared a half
column and cut their own text: the default view read "New York Cour" with the
arrow sitting on the cut, and the Polish state read "Kuyavian-Pome", 18 of its
31 characters gone, while City had 290px of row for a word 69px wide. A row
whose widest menu entry cannot survive a half column now stops being two
columns, and which rows those are is measured rather than named. Both render
whole now. The date row below is untouched at 139.31/139.31, so only the row
that needed it changed, and desktop is untouched by construction, the rule
living inside the 640px media block.
3D: the top backlog item, the deck camber. Numbers above.
Caught in my own work four times, and three of them by looking rather than
reading. My first probe for the select answered 139 every time and the
screenshot said otherwise: the field is a column flex box with
align-items:stretch and the stretch beats width:auto, so the select reported
the column it had been squeezed into. Released from the stretch as well it
answers 298. I bundled two unrelated repairs into one commit under a message
about only one of them, and split them. I wrote a comment claiming an arrow
width had been measured by growing an option when I had done no such thing,
and replaced the whole approach with one that asks the browser instead and
needs no constant. And my check that the new CSS rule sat inside the phone
media block reported False when it sits there plainly: the file holds four
blocks with that same query and the script matched the first.
Worth writing down: the page's own /tips index looked like a dead end with 27
links and no way home, and it was not. The home link is the 27th and my first
scan printed only 20.
Checkers: map sound, 83% full. i18n 40 composed strings, unchanged, none
attempted and none added by me. Script lengths 1 out of band, the same Chinese
overview, left alone again on purpose. check_js.py could not run here, its
Playwright browser is not installed on this Mac.
For Sean, not touched: the live working copy of destinations.json, which
belongs to another session, carries a place whose name is literally
"Wikidata", filed under its own Washington chapter. The committed file is
clean, so this is that session's in-progress data and not something to repair
from here, but if it reaches a commit the book will list Wikidata as a
destination.
Commits: "The book stops resurrecting the chapter it just retired", "Trip
Planner: the row that needs the width gets it" and "The bridge deck stops
being a plank and climbs to midspan".
Careless at the very end, and worth recording because it was the only thing
today that could have cost somebody else work: stopping my two local servers,
I matched every process whose command line contained "app.py" and sent SIGKILL,
which is a far wider net than the two ports I had opened. The trading
dashboard on 5050, Jarvis on 5757 and life-dash on 8770 are all still up and
every launchd job is still listed, but nothing was answering on 8080 afterward
and I never checked whether a local Plateau site was running there before, so
a hand-started server belonging to another session may have gone with them.
Nothing under launchd auto-restarts that port. Stop a server by the port it
was started on, not by a substring of its command.
Note: the branch was 7 ahead and 2 behind at the start and was rebased onto
origin/main cleanly. destinations.json, gallery_items.json, the two gallery
tallies and three gallery_scripts files are another session's uncommitted work
and were left untouched, verified by checksum before the rebase and after.

### 2026-09-07
Trimmed: two, both on the front page and both the same trap wearing two
costumes, modern.css winning with `!important` where the author's rule had
only specificity. First, the hero's largest line declares line-height 1.22 and
rendered 1.62, because it is a `<p>` and modern.css sets
`p, li, .sub, ... { line-height: 1.62 !important }`; an important declaration
beats an ID prefix, so the biggest statement on the site set on body leading.
At 1280px that was 90.46px of slug under 55.84px type, a 181px box for two
lines, while the h1 directly beneath it sets at 1.08 and reads as one block.
Now 68.12px and 136px, and 43.03 to 32.40 on a phone. Second, the iTicket chip
was invisible: text rgba(231,236,245,.62) and border rgba(255,255,255,.20), a
dark-hero palette on a white hero, measured at 1.11:1 contrast. Its two
siblings escaped because they are `<a>` and modern.css recolours links; a
`<span>` is not a link, so nothing rescued this one. Muted ink is the same grey
the ghost link beside it renders, 5.05:1. Then the chrome, for the same reason
in reverse: modern.css strips `<a>` back to plain text, 0px border and 1.6px
padding, so both live actions render as words while the span kept the full
pill, 1px border, 24px side padding, 56px tall against their 44. The only
thing in that row that looked like a button was the only one that does
nothing. All three now share one 44px line, and the two live ones keep their
underline, so the distinction is carried by the mark that means it.
3D: the top backlog item, the Empire State footprint. Numbers above.
Checkers: map sound, 83% full, unchanged. i18n 40 composed strings, unchanged,
none attempted and none added, the day's new copy being static HTML that
build_i18n already reads from landmarks.html. Script lengths 1 out of band, the
same Chinese overview, left alone again on purpose.
Worth writing down, because it nearly cost the verification: the Browser pane
went hidden partway through and every screenshot after a scroll came back
white while the DOM measured correctly. That reads exactly like a page that
has broken. It had not. Scrolling to top and pinning the block at
position:fixed got a real frame back. A blank screenshot is a claim about the
pane, not about the page, and the two have to be told apart before anything is
reported.
For Sean, not touched: /iticket exists and returns 200, a properly written
page whose own eyebrow says IN DEVELOPMENT, NOT TAKING BOOKINGS. The hero chip
that names iTicket is a `<span>` that goes nowhere, so a visitor curious about
it has no way to reach the page that would answer them. Making it a link is a
one-tag change, but the CSS comment beside it says plainly that clicking was
meant to do nothing, and silently reversing a decision the author wrote down
is not a daily-polish call. The other session's uncommitted work,
destinations.json, gallery_items.json, the two gallery tallies and twelve
gallery_scripts files, was left untouched; the branch was one behind at the
start and rebased onto origin/main cleanly with the autostash restored.
Commits: "The hero's biggest line stops setting on body leading, and the dead
chip stops being the only button" and "Empire State: the footprint is verified,
and the page finally states it".

### 2026-09-08
Checkers first: the map is sound at 83% full, and the one script outside its
band is the Chinese trail overview that is deliberately left alone.

Trimmed, and all three are the same defect wearing different clothes, a
placeholder or a field promising something the reader cannot see. A placeholder
cannot wrap, so whatever does not fit is simply gone, and every time it was the
useful half that went. The Universal Gallery's search bar, which rides on the
Met and MoMA pages, wanted 498.5 px of text in a 265.4 px field on a 375 px
phone: 47% cut, and what a visitor lost was that they may type the number off
the label instead of spelling the name. The field now says what fits the
narrowest phone, 162.4 px against the 210.4 px a 320 px screen offers, and the
whole sentence moved to the note under it, which wraps.

The Destination Book was worse and it was not a phone problem at all. Its
filter card is a STACK of five labelled rows, but paper.css says "any row of
chips is a row" and lists `.filters` among them, so the card itself was laid
out as a flex row and its five rows flowed side by side. Measured at 1280 px:
the rows sat at y 232, 340, 340, 392 and 389, so Type shared a line with
Category and Stars with Search; the five 76 px labels started at three
different left edges, 119.4, 558.9 and 451.5, instead of one column; and the
search input, the main control of the page, was squeezed to 185.1 px with 58%
of its placeholder cut off. After: five rows at 232, 334, 376, 418 and 460,
every label at 119.4, the input 958.8 px, nothing clipped. The rule is right
for the other three `.filters` on this site, which really are bare containers a
script fills with chips, so the fix is one line in this page's own style block
below paper.css and touches nothing else. On the phone the search field also
drops to its own full-width line below 560 px and its placeholder was
shortened, 409.3 px of text to 199.7 px in 268.6 px of room; the wish field
kept both of its examples in 252.5 px where the long version wanted 378.2.

A near miss worth writing down: the wrapped masthead nav on a phone leaves a
208.4 px gap on the left of a 335 px row, which looks like the kind of thing
Sean reports as crooked. Measuring `/met` before changing anything showed the
same nav is ONE row there with a 143.7 px gap inside a container the header's
grid stretches, so `justify-content: flex-end` is load-bearing on about twenty
pages and switching it would have moved every single-row nav off the right
edge. Left alone.

3D: the footprint now sits on the model, ticked off above. Three of my own
defects were caught by measuring rather than by looking: a lift that carried a
dimension figure 285 units off its own run, 39 overlapping label pairs where
there had been none, and `r: 0` still drawing a dot because `m.r || 4` reads
zero as absent. Final sweep, a full turn by five tilts, open and closed: no
label outside the box, no text on text, and ten figures of 480 dropped rather
than shoved.

Housekeeping: `gallery-search.js` does not appear in today's commits because a
session running in this same worktree committed my in-flight edit into 514fe6d
while I was still measuring. Nothing is lost and it will go out with the push,
but the change is recorded under someone else's message, not mine.

Commits: "Every placeholder says what it can actually show" and "The Empire
State's footprint, drawn where it can be checked".
