# The model standard

Sean, 2026-09-03, on the first National Mall models: "the 3D model needs to be
realist, the one you have is unacceptable." On the rebuilt Capitol, Lincoln,
Jefferson and Washington Monument: "now it looked better, I might need this
design style apply to all other design. this is the attitude."

This file is the attitude, written down so it survives the session that
produced it. It applies to every model on the site: the Freedom Trail stops,
the New York landmarks, the Met and MoMA, the Mall, and anything the landmark
routine builds from now on.

## The standard is a method, not a look

Every building goes through four steps, in this order. Skipping one is how
the first Mall models happened: correct in every number and still not the
building.

### 1. Research first, with a source behind every number

Before a line of geometry: column count and order (Doric, Ionic,
Corinthian), entablature, steps, drum and dome diameters, wings and porticos,
materials and their colours, and the distinctive things a visitor actually
sees from the street. The Monument's stone colour change at 150 ft. The
Lincoln's 36 columns. The Capitol's Statue of Freedom.

Every number carries a URL. A number that is not published is left out and
named as a gap in the build report. It is never guessed and never
"approximately right".

### 2. Build only from those facts

- The real number of columns, as columns, each with a capital block.
- Entablatures and cornices as separate thin slabs, not a taller wall.
- Steps as a stack of shrinking slabs with the real count.
- The drum under a dome, with its own colonnade if it has one.
- Wings and porticos where they exist, and nowhere they do not.
- Two tones per material through `ctx.shade`, a warmer tone on the sunlit
  faces; real materials: marble, sandstone, granite, bronze.
- A ground shadow under every main mass. Nothing in this renderer casts
  light, so a building with no shadow floats.
- Heights TRUE. Never exaggerated. The first Mall model multiplied every
  height by six and turned a ten-to-one obelisk into a knitting needle.

### 3. Render and look

`node render_room.js dc:only-<k> -0.55 0.30 > /tmp/x.svg && qlmanage -t -s 800
-o /tmp /tmp/x.svg`, then Read the PNG. From more than one angle, because the
far side is culled and the front bay of a temple only shows from the front.

Arithmetic passes what eyes catch. Face counts, bounding boxes and
finite-geometry checks have all passed models with a floor painted over the
whole room, a glass wall covering a temple, a square dome on a round
building, and an inner block painting through its attic. Looking caught every
one of those.

### 4. Adversarial review, then a fix loop

The builder never certifies its own work. Two independent critics, each
prompted to REFUTE realism:

- an architecture critic, comparing the render against the facts and the real
  building: massing, proportion, column count, distinctive features;
- a rendering reviewer, hunting faces painting through faces, floating parts,
  missing shadow, wrong culling, flat unshaded looks.

A score under 7.5 or any blocking issue goes back to a fix agent with the
issue list; up to two rounds. A model passes when the refuters fail to refute
it, not when the builder is satisfied.

## The mechanics

- One file per building: `dc-form-<k>.js` registers
  `window.DC_FORMS[k] = function (ctx, p, s, VE) { ... }` and is loaded after
  the host renderer. Several can be built at once without touching each
  other.
- Helpers live on `window.DC3D.helpers`: `prism`, `ngon`, `dome`,
  `colonnade`, `pyramid`, `shadow`, `depthOf`, and the palette `C`.
- The painter's trap, met eight times in this project: a large slab's nearest
  corner sits farther than the nearest corner of anything smaller under it,
  so it paints first and the thing beneath shows through. Every slab that sits
  on something gets an explicit depth.
- The workflow that encodes all four steps is `realistic-mall-models`
  (research, build, verify, fix). Reuse it; do not hand-roll a cheaper
  version.

## Cost, honestly

Four buildings took about seven million subagent tokens and hit the account's
spend limit once, part-way through review. Batch the work, four to six
buildings at a time, and never run two of these workflows at once. A run that
dies in the review phase leaves builds on disk and no verdicts, and a result
with zero verdicts reads as "passed" unless you check.
