# Palette

What the site uses, and what it could use instead. Kept so a colour decision
is a choice from a list rather than a fresh argument every time.

Contrast figures are measured against the paper background `#faf8f4` and stated
as a WCAG ratio. **4.5:1** is the floor for body text, **3:1** for text at 24px
or 18.7px bold. Everything currently shipping clears its own floor — verified by
rendering all 20 routes and compositing every translucent layer.

---

## What is in use now

| Role | Hex | On paper | Where it appears |
|---|---|---|---|
| Card | `#fffdf9` | — | every card, panel, input |
| Paper — page background | `#faf8f4` | — | every page |
| Panel — hero, footer, table headers | `#f5f1e8` | — | banded sections |
| **Ink** — headings, body, buttons | `#14110c` | 17.8:1 | 37% of all colour used |
| Text — paragraphs | `#4a453d` | 9.4:1 | 13% |
| Muted — captions, labels | `#6b655b` | 6.3:1 | 7% |
| Border — hairlines | `#e6e2da` `#ddd8cd` | — | card and input edges |
| **Accent** — links, icons, figures, section labels | four, below | ≥6.2:1 | 4% |

Ink is near-black but *warm* — pure `#000` on cream reads as a hole. Same reason
the background is not `#fff`: white under a serif headline looks like a login
form, not a page.

### The ladder

Those first three rows are a **ladder**, and that matters more than the
individual values. In OKLCH they are L 0.994 / 0.980 / 0.959, all at hue 84–87
and chroma 0.006–0.013 — one warm stock in three brightnesses. Nothing on the
site may invent a fourth rung.

That rule was written after measuring what was actually painted, which is the
only way this kind of fault is ever found. The card face had been `#ffffff` —
chroma exactly 0.000, 243 elements, 8.9% of every painted pixel — so the one
surface a reader looks at hardest was the one surface that wasn't paper. And
eight status washes carried over from Tailwind's default scales sat on eight
rungs nobody chose: 0.932, 0.947, 0.952, 0.960, 0.970, 0.977, 0.979, 0.987.
Two of them were within 0.003 of the page itself, so a "highlighted" panel was
exactly as bright as the thing it was meant to stand out from.

Every hue in that set was defensible on its own. The palette still read as
wrong, because a palette is a ladder and there wasn't one.

### Washes — a panel that means something

One rung each, and the hue comes from the ink whose meaning the wash shares. A
wash is a diluted version of its own status colour, never a pastel from
somewhere else.

| Meaning | Wash (L 0.959) | Selected (L 0.930) |
|---|---|---|
| Info / neutral highlight | `#e5f3ff` | `#d5eaff` |
| Good / paid / fits | `#e1f8ec` | `#cef2df` |
| Warning / pending | `#ffefdc` | `#fce4c8` |
| Error / needs you | `#ffeae7` | `#ffddd8` |

### Status colours — meaning, not decoration

These are exempt from any palette change. They carry information, and a reader
should never have to learn a custom scheme to know that red is wrong.

| Meaning | Hex | On paper | Used for |
|---|---|---|---|
| Money / live / paid | `#1b5e43` | 10.0:1 | "Operating", paid badges, positive figures |
| Warning / pending | `#8a5a12` | 6.1:1 | "In development", unpaid, research badges |
| Error / cancelled | `#a3302a` | 7.4:1 | failures, cancellations |

---

## The four arms

The company has four businesses, so the site has four accents — one per
business, and the hue **is the name**. Oxblood on a page means real estate and
nothing else, on every page.

| Arm | Hex | On paper | White on it | Covers |
|---|---|---|---|---|
| **Transportation** — and the company itself | `#1b4d8f` | 7.9:1 | 8.4:1 | `/`, `/book`, `/renter`, `/driver`, `/agent`, `/partners`, and the masthead everywhere |
| **Operations platform** | `#1d4c4f` | 9.0:1 | 9.6:1 | `/dispatch`, `/trips`, `/trip-planner`, `/road-trip`, `/destination-book`, `/favorite-place`, `/guide-studio`, `/books`, `/setup` |
| **Real estate** | `#7b2d26` | 8.8:1 | 9.4:1 | the Real Estate view |
| **Finance** — research | `#9c4221` | 6.2:1 | 6.5:1 | `/deflator`, `/factor-clock` |

Blue does double duty as the company's own colour because transportation is
what the company currently *is* — it is the only arm earning, and the front
page says so. Pages belonging to no single arm (`/board`, `/articles`,
`/archive`) use it too, tagged `company`.

### Painting a page

One attribute. `data-arm` on the `<body>` of a standalone page, or on a
`.view` / `.psx-card` inside the landing page:

```html
<body data-arm="operations">
```

Everything inherits through `--psx-accent`. The `[data-arm]` blocks at the end
of `paper.css` are the only place the accent is ever reassigned.

### What the accent is allowed to touch

Section labels, links, figures, icon strokes, focus rings, the mark on the
active section, the rule across the top of a business card, and the one named
call-to-action per view. Nothing else.

That mark is a 2px rule, and which edge it sits on follows the shape of the
list. On a desktop the sections are a rail down the left, so the rule runs
down the left of the label. On a phone the same list is a horizontal bar above
the content, so it goes back to an underline. Same 2px, same arm colour,
whichever edge faces the reader.

### What never takes an arm colour

**The wordmark and the Book a ride button.** They belong to the company, not
to whichever page they are sitting on. A masthead that changes colour as you
browse is not a masthead, and a primary action that is blue on one page and
rust on the next stops being recognisable as the same button.

**Anything that means something.** Green, amber and red carry paid, pending
and failed. Oxblood and sienna sit close enough to the error red that a reader
must never have to decide whether brown-red means "property" or "something
broke" — so arm hues are never a filled badge or an alert. Arm hues say
*where you are*; status colours say *what happened*.

**Plain buttons.** A `<button>` with no primary class renders ink, and should:
one accent call-to-action per view, ink for every form submit under it.

### Honest limit

**Oxblood and sienna are the closest pair.** Side by side on the front page —
the one place all four appear at once — they read as two dark red-browns
before they read as two different arms. Every card also carries its name, and
the arms are never otherwise seen together, so nothing depends on telling them
apart by colour. If it grates, the fix is to swap one of them for evergreen
`#1c4636` or slate `#1d4c4f`; it is one line in `paper.css`.

---

## The map taxonomy — four families, not fourteen hues

The Road Trip Planner finds fourteen kinds of stop, and each one used to have
its own colour. That set had picked itself over several rounds: `kids` and
`scenic` were the *same* hex, `rest` and `sleep` were two steps apart, four
pins wore arm hues on a filled badge — which the rule above forbids — and two
more were the site's body-text greys. Chroma ran from 0.207 on the food pin
down to 0.015 on the ATM pin, a fourteen-fold spread across one legend.

The deeper problem is that fourteen was never possible. Colour separates about
eight categories on a chart's adjacent pairs and about **three to four** when
any two marks can land side by side — which is exactly what a map is. Past
that, adding hues does not add information; it adds noise that looks like
information.

So colour answers a coarser question — *whose problem is this stop?* — and the
glyph on the pin carries the identity, as it always did.

| Family | Hex | Categories |
|---|---|---|
| The car needs something | `#893703` | Fuel, EV charging, Car repair |
| You need something | `#0c7d48` | Food, Coffee |
| Somewhere to stop | `#0267c7` | Rest & services, Toilets, Somewhere to sleep |
| Everything else in the car | `#993793` | Shops, ATM, Pharmacy, Dog walk, Playground, Scenic |

Validated as a set on the cream surface, all pairs: worst CVD ΔE 8.2 (deutan,
target ≥8), worst normal-vision ΔE 19.5 (floor ≥15), every family ≥3:1 on
paper and ≥4.5:1 against the white glyph it carries. Re-run it before changing
any of the four — the numbers are the reason the set is what it is, and the
white-glyph floor is what rules out the brighter, prettier version.

Scenic sits in the plum family rather than the blue one for a reason the
validator cannot see: blue on that map already means *suggested break*, the
one thing the tool actually produces, and two blues in one legend read as a
single category split in half.

---

## The options that were on the table

Kept so the next colour decision is a choice from a list rather than a fresh
argument. Everything below clears AA comfortably, so this is a question of what
the business should feel like, not what is legible.

| Option | Hex | On paper | White on it | Reads as |
|---|---|---|---|---|
| **Ink blue** (current) | `#1b4d8f` | 7.9:1 | 8.4:1 | Steady, institutional. Safe. Slightly cool against warm paper, and blue is the default of every template. |
| Deep evergreen | `#1c4636` | 10.0:1 | 10.6:1 | Warm-compatible, highest contrast of the set. Pacific Northwest; quietly suggests electric without saying so. |
| Oxblood | `#7b2d26` | 8.8:1 | 9.4:1 | The classic pairing with cream — letterpress, old imprints. Most "printed" of the set. Risks reading formal, closer to a law firm than a car service. |
| Slate teal | `#1d4c4f` | 9.0:1 | 9.6:1 | Cooler than evergreen, calmer than blue. Reads considered rather than corporate. |
| Burnt sienna | `#9c4221` | 6.2:1 | 6.5:1 | Warmest option. Distinctive, but drifts rustic — closer to a bakery than a car service. |
| Ink only | `#14110c` | 17.8:1 | 18.8:1 | No accent at all. Links underlined instead of coloured. The most severe and the most editorial; nothing on the page competes with the type. |

---

## Rules worth keeping

**Colour is an index, not decoration.** Four hues that name four businesses are
a taxonomy; four hues rotating across cards for variety are wallpaper. The test
is whether a reader can say what a colour *means*. The old rotation could not
pass it, which is what made the page read as a template — not the number of
hues.

**No gradients.** Enforced in `paper.css`, not asserted here. This document
claimed twice that gradients were "verified absent on every route"; both times
it was written rather than measured, and both times it was false — a radial
blue glow under the front-page CTA, amber gradient badges on the pricing and
finance cards, a dark gradient on the agent code panel and a blue-to-teal bar
on the Deflator, seventy in all. Two exemptions survive on purpose, both drawn
rather than decorative: the Real Estate blueprint grid, and the hatch on a
zero-value Deflator track, which encodes "no data".

**Ink for anything that is not the one call to action.** A page gets a single
accent button; everything else is ink. It leaves the accent free to mean
"this is the thing to click".

**Semantic colour is never restyled.** Green, amber and red mean paid, pending
and failed. They get darkened to sit on paper, never repurposed.

**Check contrast by rendering, not by reading hex values.** Four mistakes here
were only caught by measuring: a badge that ended up dark-brown-on-dark-brown at
1.47:1 after a bulk find-and-replace; an audit that reported 1:1 because it
treated a translucent tint as an opaque fill instead of compositing it; a bulk
repaint that pushed ink onto the one dark panel on the site; and a stylesheet
comment describing the opposite of what the stylesheet did, because an earlier
rule carried one more `:not()` and quietly outranked it.

**Measure every view, not the visible one.** The landing page is eight views
stacked in one document and seven of them are `display:none` at load. An audit
that only reads what is on screen measures one view and reports the whole route
clean — which is exactly what happened, and it hid an ink heading sitting on
the navy blueprint sheet at 1.3:1.

## Type

| Role | Stack |
|---|---|
| Display — headings, figures, wordmark | `--psx-display`: Iowan Old Style → Palatino → Hoefler Text → Georgia → Songti SC / SimSun / Batang → serif |
| Body and UI | `--psx-sans`: system stack |

Nothing is fetched over the network — these ship with macOS, Windows, iOS and
Android, so the page renders immediately and identically offline. The CJK serifs
at the end of the display stack matter: without them a Chinese or Korean heading
falls back to a heavy system sans and stops looking like the same page.

To use a licensed face (Carna, or anything else), add an `@font-face` and put it
at the front of `--psx-display`. That is the whole change.
