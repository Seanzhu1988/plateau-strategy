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

- [ ] The idle spin ignores `prefers-reduced-motion`. Anyone who asked their
      device to stop animation still gets a turning building. The trail page
      already respects it; the models must too.
- [ ] The bridge's Gothic arches do not read at the current scale. Either a
      second "at the tower" camera, or thicker arch profiles.
- [ ] The bridge labels sit on top of the deck. Lift them clear.
- [ ] Vertical drag: turn is horizontal only, so nobody can look down on the
      Empire State or up from street level.
- [ ] Open it up, the way the Met's model does: the Empire State splitting to
      show the two observatory decks inside.
- [ ] Phone framing: both models are drawn for a wide screen. Check at 375px
      and give each a portrait camera if it needs one.
- [ ] The bridge deck is drawn level, which is true, but the roadway actually
      rises toward midspan. Small correction, real.
- [ ] Empire State: the base is 424 by 187 ft, so from some angles it reads
      as square. Verify the footprint proportion on screen against the number.

## Also on the list

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

- [ ] The 3D models' own labels (Manhattan tower, the promenade, 86th floor)
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
