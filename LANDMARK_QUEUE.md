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

## Seattle, not started, and the numbers it already has

The Space Needle is the best documented thing left in the queue. From the
Space Needle's own facts page and Wikipedia: 605 ft tall, observation deck at
520 ft, 138 ft across at its widest. Enough to build. Before drawing, confirm
the leg spread at ground and the top house diameter, which the 138 ft figure
is usually quoted for.

Smith Tower, 484 ft and 38 storeys, has not been verified against a source.

Seattle needs a home the way the trail needed one. A `seattle-3d.js` beside
`trail-3d.js`, and a stage on whichever page sells the cruise walk.

## The rule that produced this file

Absence over invention. A landmark with no verifiable dimensions gets nothing,
and nothing is honest. Three of the four candidates looked at on 2026-09-01
were one number short, and none of them were built.
