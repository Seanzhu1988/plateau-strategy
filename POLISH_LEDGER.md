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
- [ ] Open it up, the way the Met's model does: the Empire State splitting to
      show the two observatory decks inside.
- [ ] Phone framing: both models are drawn for a wide screen. Check at 375px
      and give each a portrait camera if it needs one. Half of this is now
      done: the labels and dots read at any width (2026-08-31). What is left
      is the drawing itself, the bridge is 2.88:1 so a 375px phone gives it a
      111px tall box, and the three labels have to crowd into that band.
- [ ] The bridge deck is drawn level, which is true, but the roadway actually
      rises toward midspan. Small correction, real.
- [ ] Empire State: the base is 424 by 187 ft, so from some angles it reads
      as square. Verify the footprint proportion on screen against the number.

## Also on the list

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
