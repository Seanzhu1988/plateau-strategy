# Ivy north destination-photo source audit

Verified: 2026-09-12. Scope: Penn (10), Brown (11), Dartmouth (11), Cornell (11), using the exact ordered stop names and numeric IDs in `trails.json`.

## Result and publication boundary

43 of 43 stops have at least one destination-specific preview photograph; 48 photographs total. 41 stops have an openly licensed or photographer-released public-domain photograph. Two Penn artwork stops have private-reference images only: **Benjamin Franklin on a bench** and **The Split Button**. Both carry `previewOnly: true`, `needsRightsReview: true` and a specific `rightsNote` in the JSON. Do not ingest those two into a publicly cleared image set or remove their flags during merging.

The bench image is Eric Sucar's official University of Pennsylvania Flickr photograph, explicitly **all rights reserved**, retained as an identified reference rather than asserted reuse permission. The Button image is Wally Gobetz's Flickr photograph under **CC BY-NC-ND 2.0**; its photographer license is noncommercial/no-derivatives and does not clear the underlying sculpture. Obtain applicable permissions before public/commercial use. No visitor photographs, private files, secrets or personal submissions were inspected or used.

## Evidence and method

- Commons category listings and File pages were used to discover exact candidates, then public Commons `imageinfo`/`extmetadata` checked image URLs, photographer, license and object description in low-volume batches. Each photo links directly to its File page, not a generic school page or search result.
- The two Flickr sources were checked on their actual photo pages for photographer, location, date and rights status. Penn's official description verifies the bench is the 1987 George Lundeen sculpture at 37th Street and Locust Walk. The Button source describes Oldenburg and Coosje van Bruggen's sculpture in its Van Pelt Library setting; its license link resolves to CC BY-NC-ND 2.0.
- Same-name false matches were rejected: Hanover Inn in Harwich, England; Parkhurst Hall in Bexhill; Dartmouth athletics as a substitute for the Green; a Webster Hall candidate whose description instead named Rollins Chapel. Historical postcards and architectural renderings were not selected as present-day photographs.
- Steinberg-Dietrich is the exact building: [the Commons File description](https://commons.wikimedia.org/wiki/File:The_Wharton_School_-_UPenn_20240528.jpg) explicitly identifies Steinberg Hall-Dietrich Hall, cross-checked against [Penn Facilities' building page](https://facilities.upenn.edu/maps/locations/steinberg-hall-dietrich-hall). It is not Huntsman Hall or Steinberg Conference Center.
- Photo identity and licensing were source-metadata checked; this is not a claim that every image has received a full-resolution pixel-by-pixel visual review or that every remote URL has been successfully loaded through the tour UI. The integrating agent should verify delivered images and readable credits in the private preview.
- Remote source embeds only. No image files downloaded, no paid providers invoked, no tour order/audio/site files changed, no publication or deployment performed.

## Image-date and framing limitations

These are dated photographs, not live site-condition guarantees. Captions identify capture years where established. Hanover Inn (2007), Dartmouth Green (2007), Baker Library (2018), Hopkins Center (2018) and Cornell's suspension bridge (2009) are older views. Hopkins is explicitly labelled before the expansion and must not be presented as the current expanded facade. Hood's selected photo shows the new north entrance in April 2019. Baker's photo is the actual library exterior, not a depiction of Orozco's murals. Sanborn's image shows Sanborn Library within the named House stop. Cornell Arts Quad is an aerial overview plus a separate Ezra Cornell statue image; it does not claim both founders are visible together. Benefit Street is an actual street view near Benevolent Street, not a claim to the precise tour-coordinate camera position.

CC/PD labels below apply to the photograph unless otherwise stated. Preserve author credit, source and license links; indicate any later crop or modification, and honor share-alike where applicable. The 1919 Ezra Cornell sculpture is separately attributed to Hermon Atkins MacNeil. The two modern Penn sculptures remain explicitly subject to additional rights review.

## Per-stop sources

### ivy-penn

| Stop | Exact destination | Photograph / source | Photographer license |
| --- | --- | --- | --- |
| 1 | Benjamin Franklin on a bench | [Eric Sucar, Office of University Communications, University of Pennsylvania — Ben on the Bench at 37th Street and Locust Walk, photographed in November 2020. ](https://www.flickr.com/photos/universityofpennsylvania/51982514671/) | All rights reserved — official reference only **PRIVATE REFERENCE ONLY** |
| 2 | Locust Walk | [MatthewMarcucci at English Wikipedia — Locust Walk, Penn's brick pedestrian path, looking east. ](https://commons.wikimedia.org/wiki/File:Eastward_view_of_Locust_Walk.jpg) | Public domain |
| 3 | The Split Button | [Wally Gobetz (wallyg) — The Split Button in its Van Pelt Library setting, photographed in July 2024. ](https://www.flickr.com/photos/wallyg/53897521253/) | CC BY-NC-ND 2.0 — photograph only **PRIVATE REFERENCE ONLY** |
| 4 | College Hall and College Green | [Daderot — College Hall at the University of Pennsylvania, photographed in October 2010. ](https://commons.wikimedia.org/wiki/File:College_Hall_(University_of_Pennsylvania)_-_IMG_6596.JPG) | Public domain |
| 5 | Fisher Fine Arts Library | [Daderot — Fisher Fine Arts Library at the University of Pennsylvania. ](https://commons.wikimedia.org/wiki/File:Fisher_Fine_Arts_Library_-_IMG_6609.JPG)<br>[Shirt Vonnegut — Fisher Fine Arts Library illuminated at night. ](https://commons.wikimedia.org/wiki/File:Fisher_Fine_Arts_Library_at_Night.jpg) | Public domain<br>CC0 |
| 6 | Houston Hall | [AttaleianAnatolian — Houston Hall's Spruce Street entrance, photographed in November 2023. ](https://commons.wikimedia.org/wiki/File:The_Spruce_Street_Entrance_of_the_Houston_Hall_of_the_University_of_Pennsylvania.jpg) | CC0 |
| 7 | Irvine Auditorium | [ajay_suresh — Irvine Auditorium at Penn, photographed in March 2024. ](https://commons.wikimedia.org/wiki/File:Irvine_Auditorium_-_UPenn_(53590619400).jpg) | CC BY 2.0 |
| 8 | Wharton at Steinberg-Dietrich Hall | [颐园居 — Steinberg-Dietrich Hall, the Wharton building on Locust Walk, photographed in May 2024. ](https://commons.wikimedia.org/wiki/File:The_Wharton_School_-_UPenn_20240528.jpg) | CC BY-SA 4.0 |
| 9 | Penn Museum | [Mefman00 — The Penn Museum's Warden Garden and main entrance, photographed in August 2012. ](https://commons.wikimedia.org/wiki/File:Penn_Museum%27s_Warden_Garden_and_Main_Entrance,_Summer_2012.jpg) | CC0 |
| 10 | Franklin Field | [JJonahJackalope — Franklin Field's exterior from South Street and Convention Avenue, February 2024. ](https://commons.wikimedia.org/wiki/File:Franklin_Field,_Philadelphia,_2024.jpg) | CC BY-SA 4.0 |

### ivy-brown

| Stop | Exact destination | Photograph / source | Photographer license |
| --- | --- | --- | --- |
| 1 | Van Wickle Gates | [Beyond My Ken — Brown University's Van Wickle Gates, photographed in April 2021. ](https://commons.wikimedia.org/wiki/File:2021_Brown_University,_Van_Wickle_Gates.jpg) | CC BY-SA 4.0 |
| 2 | University Hall | [Sean McVeigh — University Hall at Brown, an aerial view from August 2017. ](https://commons.wikimedia.org/wiki/File:Brown_University_University_Hall_aerial.png) | CC BY 3.0 |
| 3 | Manning Hall | [Beyond My Ken — Manning Hall at Brown, viewed from the southwest in April 2021. ](https://commons.wikimedia.org/wiki/File:2021_Brown_University,_Manning_Hall_from_southwest.jpg) | CC BY-SA 4.0 |
| 4 | Sayles Hall | [Beyond My Ken — Sayles Hall at Brown, viewed from the southwest in April 2021. ](https://commons.wikimedia.org/wiki/File:2021_Brown_University,_Sayles_Hall_from_southwest.jpg) | CC BY-SA 4.0 |
| 5 | John Carter Brown Library | [Beyond My Ken — The John Carter Brown Library, viewed from the north in April 2021. ](https://commons.wikimedia.org/wiki/File:2021_Brown_University,_John_Carter_Brown_Library_from_north.jpg) | CC BY-SA 4.0 |
| 6 | Carrie Tower | [Farragutful — Carrie Tower on Brown's campus, photographed in December 2019. ](https://commons.wikimedia.org/wiki/File:Carrie_Tower_-_Brown_University.jpg) | CC BY-SA 4.0 |
| 7 | John Hay Library | [Beyond My Ken — The John Hay Library at Brown, photographed in April 2021. ](https://commons.wikimedia.org/wiki/File:2021_Brown_University,_John_Hay_Library.jpg) | CC BY-SA 4.0 |
| 8 | Faunce House | [Beyond My Ken — Faunce House, now the Stephen Robert '62 Campus Center, photographed in April 2021. ](https://commons.wikimedia.org/wiki/File:2021_Brown_University,_Faunce_House.jpg) | CC BY-SA 4.0 |
| 9 | Sciences Library | [Beyond My Ken — Brown's Sciences Library, known as the SciLi, photographed in April 2021. ](https://commons.wikimedia.org/wiki/File:2021_Brown_University,_Sciences_Library.jpg) | CC BY-SA 4.0 |
| 10 | Soldiers Memorial Gate | [Kenneth C. Zirkel — Brown's Soldiers Memorial Gate, photographed in October 2016. ](https://commons.wikimedia.org/wiki/File:Soldiers_Memorial_Gate_(Brown_University).jpg) | CC BY-SA 4.0 |
| 11 | Benefit Street | [Filetime — Looking southeast along Benefit Street in Providence's College Hill neighborhood, September 2020. ](https://commons.wikimedia.org/wiki/File:View_down_Benefit_Street.jpg) | CC BY-SA 4.0 |

### ivy-dartmouth

| Stop | Exact destination | Photograph / source | Photographer license |
| --- | --- | --- | --- |
| 1 | Hanover Inn | [Kane5187 — Hanover Inn beside Dartmouth's campus in Hanover, New Hampshire, June 2007. ](https://commons.wikimedia.org/wiki/File:Dartmouth_College_campus_2007-06-23_Hanover_Inn_02.JPG) | Public domain |
| 2 | Dartmouth Green | [Kane5187 — Dartmouth's central Green in Hanover, photographed in October 2007. ](https://commons.wikimedia.org/wiki/File:Dartmouth_College_campus_2007-10-13_-_The_Green_2.JPG) | Public domain |
| 3 | Dartmouth Hall and Dartmouth Row | [Daderot — Dartmouth Hall, the central building of Dartmouth Row in Hanover. ](https://commons.wikimedia.org/wiki/File:Dartmouth_Hall,_Dartmouth_College_-_general_view.JPG) | Public domain |
| 4 | Rollins Chapel | [Daderot — The front facade of Rollins Chapel at Dartmouth. ](https://commons.wikimedia.org/wiki/File:Rollins_Chapel,_Dartmouth_College_-_front_facade.JPG)<br>[Daderot — Rollins Chapel's tower viewed at an angle. ](https://commons.wikimedia.org/wiki/File:Rollins_Chapel,_Dartmouth_College_-_oblique_view.JPG) | Public domain<br>Public domain |
| 5 | Webster Hall and Rauner Library | [RyanAl6 — The front portico of Webster Hall, home to Rauner Special Collections Library. ](https://commons.wikimedia.org/wiki/File:Dartmouth_Rauner_Library_(Webster_Hall)_portico_2.jpg) | CC BY-SA 4.0 |
| 6 | Baker Library and the Orozco murals | [Gunnar Klack — Baker Memorial Library at Dartmouth, photographed in May 2018. ](https://commons.wikimedia.org/wiki/File:Baker-Library-Dartmouth-College-Hanover-New-Hampshire-05-2018a.jpg) | CC BY-SA 4.0 |
| 7 | Sanborn House | [Kenneth C. Zirkel — Sanborn Library at Dartmouth, part of the Sanborn House stop. ](https://commons.wikimedia.org/wiki/File:Sanborn_Library_(Dartmouth_College).jpg) | CC BY 4.0 |
| 8 | Parkhurst Hall | [Kenneth C. Zirkel — Parkhurst Hall at Dartmouth in Hanover, New Hampshire. ](https://commons.wikimedia.org/wiki/File:Parkhurst_Hall,_Dartmouth_College.jpg) | CC BY 4.0 |
| 9 | Collis Center | [Kenneth C. Zirkel — Collis Center at Dartmouth in Hanover, New Hampshire. ](https://commons.wikimedia.org/wiki/File:Collis_Center,_Dartmouth_College.jpg)<br>[Kenneth C. Zirkel — Inside Dartmouth's Collis Center. ](https://commons.wikimedia.org/wiki/File:Collis_Center_interior,_Dartmouth_College.jpg) | CC BY 4.0<br>CC BY 4.0 |
| 10 | Hopkins Center for the Arts | [Gunnar Klack — Hopkins Center for the Arts on Wheelock Street in May 2018, before the recent expansion. ](https://commons.wikimedia.org/wiki/File:Hopkins-Center-for-the-Arts-Wheelock-St-Hanover-New-Hampshire-05-2018a.jpg) | CC BY-SA 4.0 |
| 11 | Hood Museum of Art | [Alison Palizzolo (Apalizzolo) — The Hood Museum's north entrance after its expansion, photographed in April 2019. ](https://commons.wikimedia.org/wiki/File:FINAL_Hood_Museum_Facade_April_2019_Photo_by_Alison_Palizzolo_300ppi.jpg) | CC BY-SA 4.0 |

### ivy-cornell

| Stop | Exact destination | Photograph / source | Photographer license |
| --- | --- | --- | --- |
| 1 | Ho Plaza and Willard Straight Hall | [P. Hughes — Ho Plaza at Cornell, looking north in June 2025. ](https://commons.wikimedia.org/wiki/File:Cornell_University_-_Ho_Plaza,_looking_north.jpg)<br>[P. Hughes — The main entrance of Willard Straight Hall on Ho Plaza, June 2025. ](https://commons.wikimedia.org/wiki/File:Cornell_University_-_Willard_Straight_Hall_(2025).jpg) | CC BY 4.0<br>CC BY 4.0 |
| 2 | McGraw Tower | [Joe Mabel — McGraw Tower at Cornell, photographed in October 2025. ](https://commons.wikimedia.org/wiki/File:Cornell_University_-_McGraw_Tower_01.jpg) | CC BY-SA 4.0 |
| 3 | Uris Library | [P. Hughes — The central doorway of Uris Library at Cornell, June 2025. ](https://commons.wikimedia.org/wiki/File:Cornell_University_-_Uris_Library_2.jpg) | CC BY 4.0 |
| 4 | Libe Slope | [Alex Sergeev, (www.asergeev.com) Originally uploaded by en:User:Mercuryboard — An autumn view of Libe Slope, looking toward the west ends of Cornell's campus buildings. ](https://commons.wikimedia.org/wiki/File:Cornell_University_Slope.jpg) | CC BY-SA 3.0 |
| 5 | Arts Quad and the founders | [Eustress — Cornell's Arts Quad seen from McGraw Tower in October 2010. ](https://commons.wikimedia.org/wiki/File:Cornell_Arts_Quad.JPG)<br>[Kenneth C. Zirkel — The Ezra Cornell statue on the Arts Quad, photographed in May 2018. ](https://commons.wikimedia.org/wiki/File:Statue_of_Ezra_Cornell,_founder_of_Cornell_University.jpg) | CC BY-SA 3.0<br>CC BY-SA 4.0 |
| 6 | Goldwin Smith Hall | [颐园居 — Goldwin Smith Hall at Cornell, photographed in May 2024. ](https://commons.wikimedia.org/wiki/File:Cornell_University_Goldwin_Smith_Hall_20240526.jpg) | CC BY-SA 4.0 |
| 7 | Sage Chapel | [Notyourbroom — Sage Chapel at Cornell, photographed in February 2009. ](https://commons.wikimedia.org/wiki/File:Cornell_Sage_Chapel_1.jpg) | CC BY 3.0 |
| 8 | Andrew Dickson White House | [P. Hughes — Andrew Dickson White House on Cornell's Ithaca campus. ](https://commons.wikimedia.org/wiki/File:Cornell_University_-_A._D._White_House.jpg) | CC BY-SA 4.0 |
| 9 | Johnson Museum of Art | [P. Hughes — The Herbert F. Johnson Museum of Art at Cornell, photographed in 2025. ](https://commons.wikimedia.org/wiki/File:Cornell_University_-_Herbert_F._Johnson_Museum_of_Art_(2025).jpg) | CC BY 4.0 |
| 10 | Fall Creek Suspension Bridge | [Justin Ennis — The pedestrian suspension bridge over Fall Creek at Cornell, photographed in October 2009. ](https://commons.wikimedia.org/wiki/File:Cornell_footbridge.jpg) | CC BY 2.0 |
| 11 | Fall Creek Gorge, Beebe Lake and Triphammer Falls | [P. Hughes — Beebe Lake and Triphammer Falls at Cornell, photographed in June 2025. ](https://commons.wikimedia.org/wiki/File:Cornell_University_-_Beebe_Lake_and_Triphammer_Falls.jpg) | CC BY 4.0 |

## Reproduction check

Read-only validation compares all four manifests against `trails.json`: exact trail IDs, stop count, numeric order and names; at least one photograph per stop; required `src`, `alt`, `caption`, `credit`, `sourceUrl`, `license`; HTTPS image/source URLs; no duplicate source reused across different stops; no local visitor-upload paths; both restricted sources retain explicit rights flags. This validates the candidate data contract, not runtime image delivery or legal clearance.
