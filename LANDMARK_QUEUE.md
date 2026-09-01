# Landmark queue, and the numbers each one is still missing

The 3D landmark routine builds one model per run, and it may only build from
published dimensions. This file records what has been checked, so a later run
does not spend its whole budget re-walking the same dead ends.

## Built

MET rooms: dendur, great-hall, american-court, asian-astor, modern,
grand-stair-2, plus the composed landmark cards.

Freedom Trail (trail-3d.js): bunker-hill, old-north, faneuil-hall,
state-house, old-state-house, old-south, constitution. Seven of the ten
buildings the routine listed.

MoMA: the building's own architecture (moma-3d.js).

Seattle (seattle-3d.js): space-needle. Mounted on tours.html.

## Freedom Trail, the three not built, and why

**Park Street Church.** The steeple is published and firm: 217 ft 9 in, from
the church itself, and 217 ft from Wikipedia and SAH Archipedia. No source
found in this run publishes the footprint of the brick body. SAH describes it
but gives no plan dimensions, and the SAH page returns 403 to a plain fetch.
A model needs the rectangle before the steeple can stand on anything, so this
one waits for a HABS or MACRIS record.
Checked 2026-09-01: parkstreet.org Freedom Trail page, Wikipedia, SAH search
result, trolleytours, and a targeted search for a body dimension. None had it.

**King's Chapel.** The opposite gap. The footprint is published, a rectangular
granite edifice of 65 by 100 ft, but no source found publishes the height of
the unfinished tower, which is the whole silhouette. Wikipedia, the NPS place
page, and the church's own walking tour page all describe the building without
a single vertical measurement. HABS MASS,13-BOST,12 is the likely home of the
number and has not been read yet.

**Paul Revere House.** Not researched this run.

## Seattle, one built, and what the next one needs

**Space Needle. BUILT 2026-09-01.** Every figure sourced: 605 ft to the tip,
520 ft deck, 518 ft top floor, 500 ft restaurant, 138 ft across the top,
120 by 120 ft foundation 30 ft deep (Wikipedia); 102 ft leg base, waist at the
373 ft level, three PAIRS of legs (Docomomo WEWA); 36 in welded columns
(ASCE). The queue asked to confirm the leg spread and the top house diameter
before drawing, and both were confirmed. The width AT the waist is the only
quantity no source publishes, so the curve runs through the published level
and its narrowest point is a consequence of that curve, declared in the file.
wikiarquitectura holds plans and returns 403 to a plain fetch; if a later run
needs the waist as a fact rather than a curve, that is where to look.

**Smith Tower.** 484 ft and 38 storeys, still unverified against a source, and
the footprint is not known at all. It needs both before it can be drawn: the
1914 tower is a slab with a pyramidal cap, and the cap needs a height of its
own or it will be eyeballed.

**The Pier 66 to Pike Place walk**, 0.7 miles and 8 to 10 minutes uphill, is
not a building and does not need dimensions in the same way. It needs the
grade, which is the whole point of the promise being made about it, and no
run has looked for a published elevation gain yet.

## The rule that produced this file

Absence over invention. A landmark with no verifiable dimensions gets nothing,
and nothing is honest. Three of the four candidates looked at on the first 2026-09-01 run were one
number short and none were built. The fourth, the Space Needle, had every
number it needed and was built on the second.
