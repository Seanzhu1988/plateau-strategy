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

## Post-medieval English, the First Period house

The oldest thing on the Freedom Trail is not Georgian and must not be drawn as
if it were. Georgian is symmetrical, classical and thin-walled in its
ornament; a First Period house of the 1680s is medieval English carpentry
built in New England, and every tell is structural rather than decorative.

The tells, in the order they read at fifty feet:

- **The jetty.** The second storey overhangs the first, typically a foot or
  so, and the overhang is carried on the crosswise timbers of the frame, not
  on brackets. Draw the upper box wider than the lower one. This single move
  is most of the silhouette; a flush wall reads as a later house immediately.
- **The pendants.** Turned wooden drops hang at the corners of the jetty
  where the posts end. They are small, and they are the signature. The Paul
  Revere House sheet draws one as a detail at half scale for that reason.
- **A steep gable.** Around fifty degrees, not the thirty-something of a
  Georgian roof. The steepness is a thatch inheritance that outlived thatch.
- **A massive chimney,** central or at one end, rising well clear of the
  ridge. It is a masonry core, not a flue: it is the widest thing on the roof.
- **Casements, leaded and small,** in ranges rather than in the tall single
  sash of the next century. They sit high under the eaves because the storeys
  are low.
- **Low storeys.** Six and a half to eight feet, which is why the windows
  crowd the plate and why the building reads as long rather than tall.
- **Clapboard,** unpainted or dark, laid over the frame.

And the plan tell, which matters more here than any elevation: **one room to a
floor**, with the second block added as an ell that follows the LOT rather
than the house. Where the lot is irregular the ell meets the main block off
square. Do not straighten it. The angle is the honest fact about how these
houses grew, and a right angle is the easiest way to draw one of them wrong.

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

## The New England meeting house

*1600s to 1700s. Here: Old South Meeting House, Boston, 1729.*

Not a church, and drawing it as one is the mistake. A Puritan meeting house
was a room for the town as much as for the congregation, and its plan says so.
The Wren church of the same decade puts its door under its tower and walks you
up the long axis to an altar. The meeting house turns that ninety degrees: the
principal entrance is on the LONG side, the pulpit faces it across the short
width, and the tower is stuck on the end wall where it interrupts nothing.

**Tells**
- **The entrance is on the long side.** A door centred under the tower, with
  the pews marching away from it, is a church, not a meeting house.
- The tower stands against the **short gable end**, centred on it, and takes
  the middle bay of that front for itself.
- The body is a plain brick rectangle, two storeys, with the same round
  arched window repeated at both levels and no order laid over the wall. The
  Federal building rules its bays with pilasters; this one just counts them.
- The roof runs the long way and can be **gabled at one end and hipped at the
  other**, which a symmetrical church roof never is.
- The steeple is wood on a brick tower, and the joint is visible: brick stops,
  a painted octagon carries on.

**Wrong if** the door is under the tower, the windows are pointed, or pilasters
divide the wall into bays.

**Our numbers.** The brick tower rises 80 ft from street level to the steeple,
the copper clad octagonal spire is 20 ft, and the whole stands 183 ft. The
wooden steeple between them is therefore `183 - 80 - 20 = 83` ft, a
subtraction rather than a guess. The front is five bays wide including the
tower's own bay, the long elevations are seven, and the roof is gabled west
and hipped east. The footprint in feet is published nowhere I could find, and
is the one soft number: it is proportioned from the 80 ft tower and the
published bay counts.

---

## Federal, and the ordered civic front

*1780s to 1820s. Here: Faneuil Hall, Boston, 1742, enlarged by Charles
Bulfinch 1805 to 1806; and the Massachusetts State House, Bulfinch, 1795 to
1798.*

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

**And at the State House**, where the building described itself. The
Columbian Centinel of 10 January 1798, reproduced in the National Historic
Landmark nomination, gives an **oblong 173 ft front and 61 deep**, a
**basement storey 20 ft** under a **principal storey 30 ft**, an **attic 60 ft
wide and 20 high** under a pediment, a **dome 50 ft across and 30 high** with
a circular lanthorn and a gilt pine cone, a **portico 94 ft long of arches
projecting 14 ft** carrying a Corinthian colonnade of the same length, square
windows on the wings, and walls of patent brick with white marble fascias,
imposts and keystones. The wings follow: `(173 - 94) / 2 = 39.5` ft each.

That notice gives extents and no counts, which is where a photograph earns
its place as a source. Counted off a frontal view: **seven arches**, **twelve
columns coupled in pairs at both ends**, **three bays to each wing**. The
counts then CHECK the dimensions instead of contradicting them, because at
the scale the published 94 ft sets in that photograph the pediment measures
60.4 ft against a published 60, and the columns come out 2.5 ft thick against
the 30 in the Commonwealth gives for the pine logs the originals were turned
from. A count and a dimension that agree are worth more than either alone.

---

## The white cube

*1930s to now. Here: the Metropolitan's modern wing, gallery 851.*

The only style in this book that is defined by what it removes. A Beaux-Arts
gallery tells you how to feel before you have looked at anything; a white cube
withdraws so completely that the room claims to be neutral, which is itself a
position and a fairly recent one.

**Tells**
- **No mouldings anywhere.** No cornice, no dado, no skirting worth drawing,
  no architrave around the opening. A single plane meets another single plane.
- **The wall is the ground, not the frame.** One flat off-white, unbroken, and
  the works hung far apart on it.
- **Light from a slot**, a cove or a scoop at the top of the wall or a
  daylight ceiling. Never a visible fitting, never a chandelier.
- **Doorways are holes.** A rectangular opening cut straight through, no case
  and no reveal.
- Hung on a common centre line, **57 inches**, which is the museum standard
  and is why paintings of wildly different sizes read as one row.

**Wrong if** anything is decorated. A moulding, a picture rail, a patterned
floor or a coloured wall moves it to another style and another century.

**Our numbers.** The room itself is the floor plan's rectangle and not a
survey, on the same footing as Dendur, and the caption says so. What is real
is what hangs in it: Pollock's *Autumn Rhythm*, from the Met's own collection
API, **8 ft 10 1/4 in by 17 ft 4 in**. Seventeen feet four, on a wall drawn at
34, is the whole reason to build the room; no photograph of that painting has
ever managed to say it. It is drawn as a bare stretched rectangle at that
size and nothing else. The painting is in copyright. Its dimensions are not,
and the size is the subject.

## The sailing frigate

*1797. Here: USS Constitution, berthed at the Charlestown Navy Yard, the last
stop on the Freedom Trail and the only thing on it that floats.*

Not architecture, and the moment it is drawn like architecture it stops being
a ship. A building is a set of rectangles and a ship has none: every line on
it is a curve, and the three curves below are what the eye is actually reading
when it says "old warship" without knowing why.

**Tells**
- **The sheer.** The deck line dips amidships and lifts at both ends. Draw it
  level and you have drawn a barge. It is the single most recognisable line on
  a wooden warship and it is never straight.
- **Tumblehome.** The hull is widest a little below the deck and leans back
  inboard above that, so the rail is narrower than the waterline beam. A hull
  with vertical sides is a hull from the 1900s.
- **The gun port band.** One pale stripe running the length of the black
  topsides with the ports cut in it, evenly spaced, all one size. The count is
  the armament divided by two, not a decorative rhythm.
- **Three masts, descending aft to forward is wrong.** Main is tallest,
  fore a little shorter, mizzen shortest, and they lean aft together.
- **A bow that carries beyond the hull.** The bowsprit and jibboom add more
  than a quarter of the ship's length forward, and the spanker boom overhangs
  the stern. The overall length is much greater than the deck.
- **A flat transom stern**, not a point. Fine at the bow, blunt at the stern.

**Wrong if** the deck line is level, the sides are vertical, the ports are
irregular, or the hull ends in a point at both ends.

**Our numbers.** From the USS Constitution Museum's own facts page: **207 feet
on deck** from billethead to taffrail, **305 feet overall** from bowsprit to
spanker boom, **175 feet** at the waterline, **43 feet 6 inches** of beam,
**22 feet 6 inches** of draft today, and the mainmast **172 feet** from the
spar deck to the truck. The gun ports are counted from the published armament:
thirty 24-pounder long guns on the gun deck and twenty-four 32-pounder
carronades on the spar deck, which is fifteen and twelve a side. What is
derived is said out loud in the model: the height of the spar deck above the
water, the shape of the sheer, the tumblehome, and the fore and mizzen mast
heights, none of which that page publishes.

---

---

## Googie, and the Space Age tower

*1950s to mid 1960s. Here: the Space Needle, Seattle, 1961 to 1962. John
Graham and Company, from Edward Carlson's sketch of a balloon on a tether and
Victor Steinbrueck's hourglass.*

A world's fair style, built to sell the future to a crowd that had just been
promised one. It is the opposite of every masonry style in this book: nothing
is stacked, nothing is load-bearing wall, and the eye is meant to be surprised
that the thing stands up at all.

**Tells**
- **Structure in tension, shown.** Slender steel legs, splayed wide at the
  ground and pinched to a waist, with the mass carried at the top rather than
  at the bottom. A masonry tower gets thinner as it rises. This one gets
  thinner and then wider again.
- **The hourglass.** The waist is the whole idea, and a tower drawn as a
  straight taper is a different building.
- **A disc, cantilevered, held clear of the shaft.** The saucer is wider than
  anything below it and overhangs on every side.
- **A spire that is decoration**, not a mast and not a roof.
- Pale paint and a lot of glass on the disc, so the top reads as light and the
  legs read as line.

**Wrong if** the profile tapers straight from base to tip, or the top sits ON
the shaft rather than clear of it. Both mistakes turn a 1962 fair tower into a
water tower, and the decade is lost.

**Our numbers.** 605 ft to the spire tip, observation deck at 520 ft, top
floor 518 ft, restaurant originally 500 ft. 138 ft across at the top. Three
pairs of steel legs, 36 in welded columns, running from a 102 ft diameter
base to the pinched waist at 373 ft and flaring out above it. Foundation
120 by 120 ft and 30 ft deep.

**The one number nobody publishes** is the width AT the waist. The height of
the waist is published, both widths it sits between are published, so the leg
curve is drawn through the published level and its narrowest width is a
consequence of that curve, not a figure claimed from a source.

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
