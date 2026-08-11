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
