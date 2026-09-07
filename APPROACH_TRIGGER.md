# The Approach Trigger

A shared build spec. This is the main job. It is written to be picked up on any
machine that has the repo, including the Mac and the other Claude session, the
moment they pull.

Live blueprint with diagrams: https://claude.ai/code/artifact/65e8ceb2-c9f5-481b-a97a-aae849d08ddd

No long dashes anywhere in this file, per the house rule for blueprints.

## What it is

A guide that senses when a traveler is nearing a landmark, sizes the moment to
the building in front of them, and tells them where to look. Hands stay in
pockets, the story starts on its own.

Three jobs: sense the approach, size the trigger to the building, point the
traveler.

## Decisions locked in (Sean, this round)

1. **The trigger arms with "Lock the walk."** It co-plays with the same button
   that already locks the walk and follows the map. One action turns on the
   walk, the map follow, and the trigger together. That button is also the tap
   that unlocks audio autoplay in the browser, so it does double duty.
2. **It auto-plays the description.** When a traveler enters a landmark's
   narration zone, its description plays on its own. No second tap.
3. **It spreads to every build.** This is not a National Mall feature. It is a
   shared system that every walk uses, the Freedom Trail, the DC walks, and
   whatever comes next. Build it once, as a reusable module plus a small set of
   per-stop data fields, and have each walk include it.

## The head start (already running)

The National Mall walk already watches position, draws a moving dot, and keeps
the screen awake. Inside that loop it already does a simple trigger: within 60
meters of the nearest stop, with GPS accuracy at 80 meters or better, it opens
the stop and plays its audio once. One flat radius, no direction, no sense of
building size. We are upgrading that, not starting over.

## Upgrade one: a radius sized to the building

Each landmark gets three rings, not one, and each ring fires a different kind of
line. The radii grow with the building's height `H` and its widest footprint
dimension `W`, both in meters. Height drives how early you can see it, width
drives its ground presence.

```
# all distances in meters. constants are tuning dials, set on real walks.
R_headsup = clamp( 50,  40 + 2.5*H + 0.5*W,  600 )   # "coming up on your left"
R_narrate = clamp( 40,  20 + 0.6*H + 0.8*W,  220 )   # the full description
R_base    = clamp( 15,   8 + 0.15*H + 0.6*W,  60 )   # "look up, find the door"
```

Worked cases:

| Landmark              | H (m) | W (m) | Heads-up | Narrate | Base |
|-----------------------|------:|------:|---------:|--------:|-----:|
| Washington Monument   |   152 |    17 |      430 |     125 |   41 |
| Lincoln Memorial      |    30 |    57 |      143 |      84 |   47 |
| Brick rowhouse museum |     9 |    12 |       69 |      40 |   17 |

Tall and thin (the Monument) gets a huge heads-up ring and a tight base. Short
and wide (the Lincoln Memorial) is driven more by footprint and earns a bigger
base zone. That is the behavior we want, and it falls out of two numbers.

**Where the numbers come from.** Every rebuilt DC landmark already has a massing
file with its real size in meters (the Washington Monument file states a 152.4
meter shaft on a 16.764 meter foot). For landmarks with no model file, the same
height and footprint come from OpenStreetMap building outlines, one lookup per
landmark, stored once. Nothing is measured by hand at run time.

## Upgrade two: pointing the traveler

Left and right come from two directions.

```
bearing  = initial great-circle angle from the traveler to the nearest footprint edge
heading  = GPS course when moving, else phone compass, else last two fixes
turn     = normalize( bearing - heading )     # into -180 .. 180

 -30..30    -> "straight ahead"
  30..150   -> "on your right"
 -150..-30  -> "on your left"
 past 180   -> "behind you"
 H > 25 m   -> add "look up"
 wide, low  -> "spread out in front of you"
```

**The design decision this forces.** Left and right depend on the individual
traveler and cannot be pre-recorded. So the guide has two voices. The
description stays a produced recording, one per landmark per language, the
quality we already have. The directional cue is generated on the phone in the
moment, shown on screen and optionally spoken by the phone's built-in text to
speech. A short line like "the memorial is on your right, look up as you reach
it" plays first, then the recording takes over.

## Runtime shape (one position update)

- Distance and bearing to each landmark, cheap math on the existing position loop.
- A small state machine per landmark: `dormant -> sighted -> approaching -> arrived -> done`.
  Each border crossing can fire its own line. A landmark speaks its full
  description once per visit.
- Hysteresis: leave a zone at its radius plus a buffer, so standing on an edge
  does not stutter the audio.
- Accuracy gate: a fuzzy GPS reading is held, not trusted. If the error is
  bigger than the zone is deep, wait or ask "tap to play" rather than guess.
- One voice at a time: in a cluster, play the most prominent nearby landmark
  (ranked by height and footprint) and queue the rest.
- Arming: the "Lock the walk" tap, which also grants audio autoplay and is the
  moment to request compass permission on iPhone.

## Reusable architecture (so it spreads to every build)

- **One module** (for example `approach-trigger.js`) that takes the traveler's
  position and a list of landmarks, runs the zones, the state machine, and the
  directional math, and emits events: `sighted`, `narrate`, `atBase`, with the
  side and the up cue attached.
- **A per-stop data contract** each walk fills in: `lat`, `lon`, `height_m`,
  `footprint` (widest dimension or a polygon), optional `entrance`, plus the
  existing story and audio fields. Radii are computed from height and footprint
  at load, not stored.
- Each walk page (national-mall, freedom-trail, and future walks) includes the
  module and wires its "Lock the walk" button to arm it. The walk supplies data,
  the module supplies behavior.

## Honest limits

GPS is good to roughly 5 to 20 meters outdoors in the open, fine for a 40 meter
base ring and plenty for a 400 meter heads-up ring. It cannot tell which room
you are in, so this is for outdoor landmarks. Interiors need a different signal
later (a scanned code at the gallery door, or a small beacon), not GPS. Downtown
towers can bend the signal, another reason for the accuracy gate and for keeping
the manual tap list. Position stays on the phone, drawn on the local map, never
sent to our server, the same promise the walk already makes.

## Build order (no big bang)

- **Phase 0, shipped.** The flat 60 meter auto-play on the Mall today.
- **Phase 1.** Extract the trigger into the shared module. Swap the flat 60 for
  `R_narrate` per landmark. Add `height_m` and `footprint` to each stop, from
  the model files and OpenStreetMap. First visible win, low risk.
- **Phase 2.** The heads-up ring and a short "coming up" cue on entry.
- **Phase 3.** Direction: heading against bearing, spoken as left, right, ahead,
  or look up. Wire compass permission into the Lock the walk tap.
- **Phase 4.** Base-zone "look up, the door is on your left", cluster priority,
  and accuracy tuning from real walks. Then roll the module into the Freedom
  Trail and the rest.

## Open tuning (not blocking)

- How early the heads-up cue should feel. 400 meters for a tall landmark is the
  current guess. Tune on a real walk.
- How loud the directional voice should be: spoken every time, or a soft on
  screen line with sound only for the description.
