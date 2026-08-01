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
| Paper — page background | `#faf8f4` | — | every page |
| Panel — hero, footer, table headers | `#f5f1e8` | — | banded sections |
| Card | `#ffffff` | — | every card, panel, input |
| **Ink** — headings, body, buttons | `#14110c` | 17.8:1 | 37% of all colour used |
| Text — paragraphs | `#4a453d` | 9.4:1 | 13% |
| Muted — captions, labels | `#6b655b` | 6.3:1 | 7% |
| Border — hairlines | `#e6e2da` `#ddd8cd` | — | card and input edges |
| **Accent** — links, icons, focus | `#1b4d8f` | 7.9:1 | 4% |

Ink is near-black but *warm* — pure `#000` on cream reads as a hole. Same reason
the background is not `#fff`: white under a serif headline looks like a login
form, not a page.

### Status colours — meaning, not decoration

These are exempt from any palette change. They carry information, and a reader
should never have to learn a custom scheme to know that red is wrong.

| Meaning | Hex | On paper | Used for |
|---|---|---|---|
| Money / live / paid | `#1b5e43` | 10.0:1 | "Operating", paid badges, positive figures |
| Warning / pending | `#8a5a12` | 6.1:1 | "In development", unpaid, research badges |
| Error / cancelled | `#a3302a` | 7.4:1 | failures, cancellations |

---

## Accent options

The accent is the only real choice here. It carries links, icons, focus rings
and numerals — roughly 4% of the page. Everything below clears AA comfortably,
so this is a question of what the business should feel like, not what is legible.

| Option | Hex | On paper | White on it | Reads as |
|---|---|---|---|---|
| **Ink blue** (current) | `#1b4d8f` | 7.9:1 | 8.4:1 | Steady, institutional. Safe. Slightly cool against warm paper, and blue is the default of every template. |
| Deep evergreen | `#1c4636` | 10.0:1 | 10.6:1 | Warm-compatible, highest contrast of the set. Pacific Northwest; quietly suggests electric without saying so. |
| Oxblood | `#7b2d26` | 8.8:1 | 9.4:1 | The classic pairing with cream — letterpress, old imprints. Most "printed" of the set. Risks reading formal, closer to a law firm than a car service. |
| Slate teal | `#1d4c4f` | 9.0:1 | 9.6:1 | Cooler than evergreen, calmer than blue. Reads considered rather than corporate. |
| Burnt sienna | `#9c4221` | 6.2:1 | 6.5:1 | Warmest option. Distinctive, but drifts rustic — closer to a bakery than a car service. |
| Ink only | `#14110c` | 17.8:1 | 18.8:1 | No accent at all. Links underlined instead of coloured. The most severe and the most editorial; nothing on the page competes with the type. |

### Changing it

One line in `paper.css`:

```css
--psx-blue: #1b4d8f;   /* accent — links, icons, focus, numerals */
```

`--psx-indigo`, `--psx-violet` and `--psx-teal` are all mapped to the same value
on purpose: the old design used four accent hues, which is three too many.

---

## Rules worth keeping

**One accent.** Four hues rotating across cards was decoration standing in for
meaning — it is what made the page read as a template.

**No gradients.** Verified absent on every route. A gradient is the single most
recognisable signal of a generated site.

**Ink for primary actions, not the accent.** A black button on paper is quieter
and more certain than a coloured one, and it leaves the accent free to mean
"this is a link".

**Semantic colour is never restyled.** Green, amber and red mean paid, pending
and failed. They get darkened to sit on paper, never repurposed.

**Check contrast by rendering, not by reading hex values.** Two mistakes here
were only caught by measuring: a badge that ended up dark-brown-on-dark-brown at
1.47:1 after a bulk find-and-replace, and an audit that reported 1:1 because it
treated a translucent tint as an opaque fill instead of compositing it.

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
