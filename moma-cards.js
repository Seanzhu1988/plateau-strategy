/* The gallery cards for /moma. Every floor and gallery number here was read
 * from moma.org's own live pages on 2026-08-28 and independently re-verified
 * by an adversarial pass before this file was written, because a guide that
 * sends a person to the wrong floor for The Starry Night defeats its whole
 * purpose. One catch worth keeping: Les Demoiselles d'Avignon moved from
 * gallery 503 to 502 in the March 2024 rehang, so guides that say 503 are
 * stale, and this one is not. Content only: geometry and behaviour live in
 * moma-map.js, so a fact fix never touches the drawing. */
window.MOMA_CARDS = {
 "six-sculptures": {
  "name": "Six Sculptures · 500",
  "floor": 5,
  "minutes": 5,
  "one_line": "The Sculpture Garden extends into this quiet indoor room, and the collection's hundred-and-forty-year story starts at the door beside it.",
  "highlights": [
   {
    "work": "The room itself",
    "note": "Six sculptures, changed from time to time, facing the garden through glass. Take the minute; the galleries that follow are dense."
   }
  ]
 },
 "van-gogh": {
  "name": "French Landscapes · 501",
  "floor": 5,
  "minutes": 15,
  "one_line": "The chronology proper begins here in the 1880s, and the painting most people crossed the ocean for hangs in the first numbered room.",
  "highlights": [
   {
    "work": "The Starry Night",
    "note": "Van Gogh painted it in June 1889 from his asylum room at Saint-Remy, from memory and imagination as much as from the window. Expect a crowd around it at any hour."
   },
   {
    "work": "The Sleeping Gypsy",
    "note": "Rousseau's lion and sleeping traveller under a full moon, newly back on view in this room."
   }
  ]
 },
 "demoiselles": {
  "name": "Les Demoiselles · 502",
  "floor": 5,
  "minutes": 10,
  "one_line": "A gallery named after the one painting in it that changed everything after 1907.",
  "highlights": [
   {
    "work": "Les Demoiselles d'Avignon",
    "note": "Picasso kept it rolled in his studio for years because even his friends recoiled. It has hung in this room, 502, since the March 2024 rehang; older guides still say 503."
   }
  ]
 },
 "matisse": {
  "name": "Henri Matisse · 506",
  "floor": 5,
  "minutes": 10,
  "one_line": "A room of Matisse, with the five dancers holding hands at the centre of it.",
  "highlights": [
   {
    "work": "Dance (I)",
    "note": "Painted in 1909 as the full-size study for a Russian collector's staircase. The final version is in St Petersburg; this is the one Matisse kept looser and faster."
   }
  ]
 },
 "monet": {
  "name": "Monet's Water Lilies · 515",
  "floor": 5,
  "minutes": 12,
  "one_line": "One room in the Geffen Wing built around one painting that wraps three walls.",
  "highlights": [
   {
    "work": "Water Lilies (1914-26)",
    "note": "The triptych runs about forty feet end to end, painted at Giverny in Monet's last decade while his eyesight failed. Sit on the bench; the painting was made to surround you, not to be walked past."
   }
  ]
 },
 "surreal": {
  "name": "A Surreal Lens · 517",
  "floor": 5,
  "minutes": 10,
  "one_line": "The surrealists, and the small painting everyone is surprised by.",
  "highlights": [
   {
    "work": "The Persistence of Memory",
    "note": "Dali's melting watches, 1931. The surprise in person is the size: it is about as big as a sheet of paper, and the whole room reorganises around it anyway."
   }
  ]
 },
 "american": {
  "name": "American Idioms · 521",
  "floor": 5,
  "minutes": 10,
  "one_line": "The American rooms that close the floor's story on the eve of mid-century.",
  "highlights": [
   {
    "work": "Christina's World",
    "note": "Wyeth's 1948 painting of his neighbour Christina Olson, who would not use a wheelchair and crossed her fields by pulling herself. The house on the hill still stands in Cushing, Maine."
   }
  ]
 },
 "pollock": {
  "name": "New World Stage · 401",
  "floor": 4,
  "minutes": 10,
  "one_line": "Floor 4 opens after the war, with New York suddenly the centre of the art world.",
  "highlights": [
   {
    "work": "One: Number 31, 1950",
    "note": "Pollock at full reach, nearly nine feet by seventeen and a half, poured and flicked on the floor of a Long Island barn. Stand close, then far; it is two different paintings."
   }
  ]
 },
 "sixties": {
  "name": "The Sixties · 412",
  "floor": 4,
  "minutes": 12,
  "one_line": "Pop arrives, and the supermarket walks into the museum.",
  "highlights": [
   {
    "work": "Campbell's Soup Cans",
    "note": "Warhol's thirty-two canvases, one for every variety Campbell's sold in 1962, hung in a grid like shelves. He priced them at a hundred dollars each and struggled to sell them."
   }
  ]
 },
 "seventies": {
  "name": "Toward 1980 · 413-421",
  "floor": 4,
  "minutes": 15,
  "one_line": "The floor runs on through minimalism, conceptual work and the 1970s until it hands the story to Floor 2.",
  "highlights": [
   {
    "work": "The later galleries",
    "note": "Twenty-two rooms on this floor in all, loosely chronological. If time is short, follow the numbers and stop where something stops you."
   }
  ]
 },
 "contemporary": {
  "name": "1980 to Today · 201-216",
  "floor": 2,
  "minutes": 20,
  "one_line": "The newest work, rehung often enough that the honest promise is the era, not a checklist.",
  "highlights": [
   {
    "work": "Galleries 201-216",
    "note": "Contemporary rooms change with the programme; what hangs here rotates more than anywhere else in the building. That is the point of the floor."
   }
  ]
 },
 "atrium": {
  "name": "The Marron Atrium",
  "floor": 2,
  "minutes": 3,
  "one_line": "The tall room at the building's heart, where performances and single large works take over.",
  "highlights": [
   {
    "work": "Whatever fills it this month",
    "note": "The atrium is programmed like a stage. Lean over the rail and look before deciding whether to come down to it."
   }
  ]
 }
};
