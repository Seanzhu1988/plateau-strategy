# National Mall museum tools

This release adds the mini Universal Gallery search and photograph entry to all seven explicitly reviewed museum and gallery stops in the handmade National Mall player. It uses the same `universal_gallery` stop metadata as the public directory and standard tour player.

The tool appears at National Museum of the American Indian, National Air and Space Museum, National Gallery of Art, Hirshhorn Museum, National Museum of Natural History, National Museum of American History and National Museum of African American History and Culture. It stays hidden at other stops. Changing stops closes the tool so an expanded panel cannot remain attached to the wrong destination.

Verification on September 19, 2026:

- Eight Python tests passed for Mall coverage, story connection, language packs and asset routes.
- Five pedestrian-routing tests passed, including the Mall crossing and White House exterior route.
- Mobile Chromium at 390 by 844 checked all seven stops in English, Chinese, Spanish, Korean and Vietnamese.
- Expand, close, keyboard close, search form, photograph link, non-museum hiding, no horizontal overflow, no writes and zero page errors passed.
- `git diff --check` passed.

The photograph entry continues to the existing consent-based flow; no photo is uploaded or search started until the traveler acts. The Freedom Trail handmade player remains pending. The Met and MoMA already have Gallery search bars. Independent Claude review is pending.
