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

## Done

(nothing yet, the ledger starts today)
