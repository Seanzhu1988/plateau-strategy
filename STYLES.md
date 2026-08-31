# The styles book

A model of a real building is only as good as the vocabulary it is drawn with.

This is the reference; `styles-3d.js` is the same book in the form a browser
can run. When a model declares a style, this file says what that declaration
commits it to. Add a style here before drawing a building in it.

The rule the book exists to enforce: **look up the style before choosing the
geometry.** The Brooklyn Bridge towers were drawn with their openings as
triangles for two weeks. Nothing about the model was obviously broken. It was
simply not the Brooklyn Bridge, because the Brooklyn Bridge is Gothic Revival
and a Gothic arch is not a triangle.

---

## The arch, which is most of the difference

Nearly every style question that reaches the geometry is an arch question, and
one formula answers all of them.

A pointed arch is **two-centred**. Each side is a circular arc struck from a
centre sitting on the springing line on the *opposite* side of the centreline,
so the two arcs lean into each other and meet at a point. Given half-width `a`
and rise `h` from the springing to the apex, the centre offset is forced:

    R = a + d,  and the apex lies on the arc, so
    d² + h² = (a + d)²      →      d = (h² − a²) / 2a

That formula contains the entire family, and tells you which arch you are
drawing:

| rise ÷ half-width | offset `d` | what it is |
|---|---|---|
| `h < a` | negative | **segmental**, flatter than a half circle |
| `h = a` | **0** | **semicircular** — the two centres merge. Roman, Romanesque, Beaux-Arts |
| `a < h < a√3` | small | **drop** arch: pointed, but blunt |
| `h = a√3 ≈ 1.732a` | `d = a` | **equilateral**: the textbook Gothic arch |
| `h > a√3` | large | **lancet**: the sharp one. Cathedral windows, and this bridge |

Measured against the full width instead of the half, carry `rise ÷ width`:
**0.5 is round, 0.866 is equilateral, above that is a lancet.**

The round arch falls out of the Gothic formula as the case where the point
disappears. Romanesque and Gothic are the same equation at different settings,
which is worth knowing before writing a second function for the second one.

What makes it *read* right is that the curve is **steepest at the springing and
flattest at the apex**, the exact opposite of the straight line most people
reach for. And two details do more than the curve alone:

- **The spandrel.** The stone above the curve and below the square head of the
  opening. Fill it and the hole is pointed. Leave it out and you have a
  rectangular hole with a line scratched on it.
- **The voussoirs.** The joints between the wedge stones. Because each is a
  true radius from the arc centre, they **fan**. Parallel joints are the tell
  of a hole cut in a slab rather than an arch built out of stones.

---

## Gothic Revival

*1740s to 1900s. Here: the Brooklyn Bridge towers, 1869 to 1883.*

Roebling hung his span between two masonry towers deliberately shaped like
cathedral portals; contemporaries described the openings as rising "like
majestic cathedral windows". Granite and limestone, 276.5 ft to the top.

**Tells**
- Pointed openings struck as arcs, never straight lines.
- Load carried on piers, so a wall reads *pier, opening, pier, opening, pier*.
  Drawn as two posts with a gap it reads as scaffolding.
- Vertical emphasis: the opening much taller than it is wide.
- Visible coursing and radiating voussoirs.

**Wrong if** the opening is a triangle, a rectangle, or a half circle.

**Our numbers.** Opening 33.75 ft wide, 117 ft tall, springing at 0.62 of the
height, so a rise of 44.5 ft over a half-width of 16.875. That is
`rise ÷ width = 1.32`, well past 0.866, so a **lancet**, which is what the
photographs show. The centres land 50 ft outside the opening. Against the
straight line it replaced, the true arc bulges **4.36 ft**. That is the size of
the error in stone.

---

## Art Deco

*1920s to 1930s. Here: the Empire State Building, 1930 to 1931.*

**Tells**
- Unbroken **vertical** piers with recessed spandrels between, pulling the eye
  up the full height.
- The mass **steps back** as it rises, several times. This is not taste, it is
  the 1916 zoning resolution requiring setbacks so light reaches the street,
  which is why that decade's skyline is ziggurats rather than boxes.
- A crown treated as ornament, not as a roof.
- Metal trim against pale stone. Indiana limestone and aluminium here.

**Wrong if** the facade bands horizontally, or the tower is one plain box. A
Deco tower drawn with horizontal banding reads as 1960s office and the century
is wrong.

**Our numbers.** Roof 1,250 ft, tip 1,454 ft including the mooring mast that
never moored anything. Setbacks at 21, 25, 30, 72, 81 and 85 storeys.

---

## Beaux-Arts

*1880s to 1920s. Here: the Met's Fifth Avenue front, 1902. Not yet modelled.*

**Tells**
- Strict symmetry about a central axis.
- A heavy rusticated base carrying a lighter upper order.
- Paired columns, a deep cornice, sculpture held within the wall.
- **Round** arches. A Gothic point here is a century out of place.

**Wrong if** it is asymmetric, or the arches are pointed.

---

## Egyptian Revival

*1820s to 1850s. Here: the Bunker Hill Monument, 1825 to 1842.*

America borrowed the Egyptian obelisk for the one thing it promised, which was
permanence, and then cut it plain in whatever stone the ground gave up. At
Bunker Hill that stone is Quincy granite, hauled on the Granite Railway, the
first railroad chartered in the country.

**Tells**
- A single square shaft that tapers dead straight from base to top.
- The taper is **subtle**. An Egyptian temple wall batters about 0.075 and
  curves the eye inward; an obelisk is nearer 0.03 and does not curve at all.
- It ends in a **pyramidion**. A shaft cut off flat is a chimney.
- No cornice, no carving, no order. Ornament here is a different building.

**Wrong if** the sides visibly bow, or the top is flat, or anything is applied
to the shaft.

**Our numbers.** 221 ft, 30 ft square at the base to 15.4 ft at the top. That
is a lean of `(30 - 15.4) / 2 / 221 = 0.033`, taken from the published
dimensions rather than from a photograph, which is the whole difference
between an obelisk and a spike.

---

## Georgian, and the Wren church

*1700s to 1780s. Here: Old North Church, Boston, 1723, steeple 1740.*

Christ Church in the City of Boston is a colonial builder's reading of the
London churches Christopher Wren put up after the Great Fire: a plain brick
box, correct and symmetrical, with all the ambition spent on the steeple.

**Tells**
- Strict bilateral symmetry. The plan is a rectangle and the front is centred.
- **Round** arched sash windows, in two levels on the front. A pointed arch
  here is Gothic and fifty years early.
- Red brick laid in bond, with the trim in plain painted wood, never stone
  carving.
- The steeple climbs in **diminishing stages**: square brick tower, open
  belfry, octagonal lanterns, then a slender spire and a vane. A steeple drawn
  as one continuous taper is an obelisk wearing a cross.
- The body is low and the steeple is tall. Most of the height is the steeple.

**Wrong if** the arches are pointed, the facade is asymmetric, or the spire
rises straight off the roof with no stages between.

**Our numbers.** Body 96.5 by 51.5 ft, nave 70 by 51 and 42 ft high, steeple
191 ft above ground, brick walls 2.5 ft thick and the tower's 3.5. The tower
block is therefore `96.5 - 70 = 26.5` ft of the length. Sources disagree about
the first steeple, which several give as 175 ft, and the church's own account
says the 1806 replacement stood fifteen feet shorter than the 1740 original;
the 191 ft in the model is the figure the church and the register use for what
is standing now.

---

## Federal, and the ordered civic front

*1780s to 1820s. Here: Faneuil Hall, Boston, 1742, enlarged by Charles
Bulfinch 1805 to 1806.*

Georgian's successor, and the difference is discipline rather than ornament.
A Georgian church spends everything on one steeple. A Federal civic building
spends it on ORDER: the whole elevation is ruled into bays by pilasters, and
the pilasters change their order as they climb.

**Tells**
- **The hierarchy of orders, bottom to top.** Faneuil Hall runs Tuscan at the
  market level, Doric at the second story, Ionic at the third. Plainest at the
  bottom, richest at the top. Getting that order backwards is the giveaway.
- **Bays counted, not suggested.** A pilaster on every bay division and
  **paired at the outer ends**, so the corners read as heavier than the middle.
- Round, elongated **compass-headed** sash in the principal stories, sitting
  over a ground floor that was an **open arcade** before it was glazed in.
- Red brick, with every piece of trim painted a single off-white. Not stone.
  Stone appears only where it must work: granite pilaster bases at the ground,
  brownstone sills and keystones.
- A **cupola** on a quoined base: open arched belfry, then a dome. It sits at
  one end over the entrance front, not on the middle of the roof.
- The roof is a broad gable holding a usable half story, so it carries real
  dormers rather than a decorative one or two.

**Wrong if** the orders climb from rich to plain, the pilasters are evenly
spaced with no pairing at the corners, or the cupola is a spire. A Federal
cupola ends in a dome; a spire would make it a church.

**Our numbers.** Three and a half stories, **seven bays wide and nine bays
deep**, the market floor **76 by 100 ft** inside, the Great Hall **76 ft
square with a 28 ft ceiling**, the attic hall **48 by 76 ft**, **five
copper-clad barrel dormers on each slope** of the slate roof, and the
grasshopper vane **52 in long, 38 lb**, cut by Shem Drowne in 1742. The 76 ft
interior width inside walls a shade over 2 ft thick is the published 80 ft
outside, which is the figure for Bulfinch doubling the original 40 ft width.
No source publishes a floor-to-floor height or a cupola height, so those are
proportioned from the 28 ft ceiling that is published, and said so.

---

## Working rules

1. **Name the style before choosing the geometry.** If you cannot name it, you
   are about to guess, and the guess will be a triangle.
2. **Real published dimensions, in feet, or do not draw it.** Every number in a
   model should be traceable to a source, not eyeballed from a photograph.
3. **Style rules live here, not in the model.** A second building in the same
   style must not restate them. `styles-3d.js` loads before any model script.
4. **The tells are a checklist.** After drawing, read the tells back and check
   each one. The triangle survived because nobody read the list.
5. **Screenshot it.** Geometry that is right in the numbers can still be
   invisible, hidden or inside out. A malformed spandrel bricked up all four
   openings while every number in the file was correct, and only the picture
   showed it.
