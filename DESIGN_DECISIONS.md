# Website design decisions — settled 2026-08-07

Written down so none of this gets re-argued. Each line is a decision the owner
made or confirmed, with the reason it stuck.

---

## Colour

**Navy `#1f3a5f`** is the brand colour. It came from the LLC logo — navy serif
type on cream, carrying the tagline now on the hero. The registered identity
leads and the website follows, not the reverse. A generated palette lost to the
company's own, which is the right outcome.

**Cream `#f7f4ea` lives inside the mark and nowhere else.** The ground is white.
Washed backgrounds were tried and rejected — *"washed backgrounds look cheap"* —
and white is what finally made the type legible.

11.48:1 on white, so nothing in the palette is ever marginal.

**Rejected on the way here, so nobody tries them again:** cream grounds (cheap),
black fills (buried the words), rose gold (owner's request, then superseded by
his own logo), the four per-business hues (four hues plus a brand colour is five
colours arguing). The `[data-arm]` block is the one place to restore per-business
tints if ever wanted.

## Controls

**A control is a word with a rule under it.** No fills behind words, anywhere.
This was the owner's judgement three separate times and it is the single
strongest rule on the site:

> "It's basically blocking the whole word."

A solid block behind a short label buries it — at button size the fill is most of
what the eye receives and the text is a hole punched in it. Contrast has nothing
to do with it: white on navy measures 11.48:1 and was still wrong.

**Primary vs secondary is weight, not width.** 2px navy rule and near-black ink
for the primary; 1px grey rule and muted ink for the secondary. Equal weight on a
longer phrase makes the secondary dominate.

**Focus is an inset bar, never a box.** A ring is still a rectangle around a word.
Focus paints an inset shadow along the bottom edge, which works on controls that
have no border of their own and shifts no layout.

**Filled controls that survive, because the colour is information:**
road-trip legend dots (they key to map pins), trip-planner stop dots (green or dim
by drive time), and the Starting-point pin whose red means "waiting for your
location". Everything else is unfilled.

## Logo

The existing mesa mark, recoloured — same circle, same two mesas, same ridge
line, same summit dot, identical coordinates. Five redesigns were drawn and all
five rejected; the owner was right that the shape was never the problem. Flat
navy, because the supplied logo is flat. Blue original kept at
`logo-options/plateau-logo.blue.bak.svg`.

The wordmark is black. That needed **two** properties, not one — paper.css paints
it with `-webkit-text-fill-color` as well as `color`, and text-fill wins at paint
time.

## Copy

Hero: **"Your professional business companion"**, sentence case to match every
other headline. Translated in all five languages — the i18n gate fails on any
page string without an entry, so a headline change is never a one-line change.

The "closed loop, not a funnel" section was cut. It asserted a compounding
flywheel the business cannot yet evidence, sitting directly above cards that are
careful to name each arm's real stage.

---

## Four bugs that survived many passes, and why

Worth keeping because they share one shape: **the failure was silent.**

1. **The Sections strip.** The current tab had `background` and `color` both
   `rgb(150,69,51)` — the label was not dark, it was *invisible*. Reported as the
   same fault four times while colour was repainted around it.

2. **Audits that only saw the default state.** That strip is `display:none` until
   clicked, so every element inside was skipped and the audit cheerfully reported
   "all 20 pages pass" four times running. **The audit now clicks strips and menus
   open before measuring, and names any label within 1.6:1 of its own background.**

3. **My own heavyweight selectors.** A `:not()` chain in this file kept silently
   outranking later fixes — four separate times, including one containing an `id`,
   which scores as an id and outranks anything. Fixes in `modern.css` now carry
   the shared chain deliberately.

4. **The trip-planner search.** It sent `viewbox=-74.5313,89.8107,-74.5313,-89.0895`
   — zero width — Nominatim answered 400, `.json()` threw, the catch swallowed it,
   and pressing Add looked like a no-op. Guarded, and failures now raise.

**And a measurement trap:** `:focus` styles do not render while the window is
unfocused, so programmatic `.focus()` in a background pane reports nothing no
matter what the CSS says. Focus states need a real Tab press in a focused window.

---

## Working alongside the parallel session

Both sessions share this folder. When the other one has uncommitted work, **merge
in a throwaway git worktree**, verify the app actually serves, then push. Its
working files are never touched. Never `git add -A` here — that once deleted a
file the other session was working on.

---

## Where the data lives

Everything the site writes — visitors, ideas, professionals, opinions, purchases
— is a JSON file. On Render's free tier those files sit on a disposable
filesystem that is **destroyed on every deploy**, so each push silently reset the
site to zero. Nobody sees an error; the numbers just start again.

The fix is a Starter plan with a persistent disk mounted at `/var/data`, and
`DATA_DIR=/var/data` in the environment. `_data_path()` reads that variable and
seeds each file from the repo copy exactly once, so a fresh disk starts with the
committed content and never overwrites live data afterwards.

**Verify it rather than trust it.** `/api/persistence` (owner-only) reports where
writes actually go, whether that is a mounted disk, and can write a marker and
read it back. The honest test is: write something through the live site, deploy,
and read it again. Configuration that looks right and data that survived a deploy
are different claims.

## The gate, rebuilt (2026-08-11)

The design system kept failing silently in the same shape, five rounds running.
A multi-agent review of the whole surface returned one verdict, and it was not
about CSS: **fix the verifier before touching a single line of style, because
`check_design.py` is what gets trusted to say "done," and it structurally could
not see the bug class it was being trusted about.**

Three things were wrong with it, in ascending order of embarrassment.

**It could not run here.** `CHROME` was hardcoded to
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, a Linux container path
that does not exist on the machine this site is developed on. Not "missed the
findings" — never launched. That is the quietest false pass there is. It now
resolves the container binary if present and Playwright's own otherwise.

**Its route list was hand-typed, and had already drifted.** `/professionals`
went live at `app.py:5412` and was never added, so a page nobody had ever
gated read as part of a clean sweep. Routes are now *derived* — scanned out of
`app.py`, cross-checked against the `.html` files on disk so a file with no
route (`rent-a-tesla.html`, dark until S11) is named rather than invisible. A
list a human must remember to update is the same failure shape as a `:not()`
chain a human must remember to sync.

**It had no assertion for the strongest rule in the system.** "A control is a
word with a rule under it, never a fill behind a word" was stated three times
and measured zero times. Contrast cannot catch it: a solid `#2563eb` pill with
white text passes contrast beautifully. That is exactly how the language
switcher's fill survived four audits on all 23 pages. There is now a FILL
sensor (every control must be transparent unless it carries an explicit
`data-carveout`) and a FOCUS sensor (focus must be an inset bar, never a ring),
and everything a reader can open is opened before measuring.

Two lessons paid for in the same session:

**Measure the delta, not the state.** The focus sensor first flagged the
switcher's permanent drop shadow as a focus ring. It would have sent someone
editing a shadow that was never the bug. It now compares box-shadow before and
after focus — what focus *adds* is the only thing the rule is about.

**Fix the constant before believing the number.** `PALETTE` was written in the
paper era and never updated, so the gate reported the brand navy itself as a
leftover: 1869 "off-palette" hits, nearly all of them the design system obeying
itself. A gate that cries wolf gets ignored, which is its own silent pass. With
the real `modern.css` tokens in the list the number is 7.

### What the rebuilt gate found within a minute of working

A **third** styling authority over one component. The language switcher is
styled in `paper.css`, filtered by `modern.css`'s `:not()` chain, *and* injects
its own `<style>` from `i18n.js`. Rewriting the widget to obey the system made
its word navy while `paper.css`'s `!important` ink fill kept the ground
near-black — navy on black, 1.74:1, a real regression introduced by a real fix.
The gate caught it on the next run. That is the entire argument for building
the verifier first, in one incident.

### Still open

The `:not()`-exemption architecture is judged **not survivable** and is to be
replaced by default-deny plus a small `data-carveout` allowlist: a missed
allowlist entry renders something too plain and is caught by eye, while a missed
denylist entry renders a normal-looking filled button and is caught by nobody.
That inversion is the point. Remaining at last run: 359 fills, 213 focus rings,
2 unrouted files, `/professionals` untagged. The gate is honest about all of
them, which is new.

`jarvis-widget.js` only builds for an owner session, so an anonymous sweep can
never see it — the gate needs a logged-in pass, or that component stays exactly
as invisible as everything else on this list used to be.
