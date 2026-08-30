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
