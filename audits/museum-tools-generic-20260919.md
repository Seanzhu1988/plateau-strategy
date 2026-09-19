# Universal Gallery tools for museum stops

This release adds a small Universal Gallery search and photograph entry to reviewed museum and collection stops in the public directory and generic tour player. Museum support is explicit data, not a name guess: 21 stops carry `universal_gallery: true`, including Yale Center for British Art, Liberty Bell Center, Second Bank of the United States and National Constitution Center as well as destinations whose names contain Museum or Gallery.

The tool is shown only for reviewed stops. It searches by artist, artwork or label text and links to the existing consent-based photograph flow. Opening and closing use native details controls. The tool does not run a search, upload a photograph or make a paid request until the traveler acts.

The four new lines ship in Chinese, Spanish, Korean and Vietnamese. Search with a photograph already had translations and was reused. Each language pack gained exactly four entries; no existing translation changed or disappeared.

Verification on September 19, 2026:

- 22 public-directory JavaScript tests passed, including exact flag coverage and preservation of 13 routes and 163 stops.
- Five Python language and asset-route tests passed.
- Mobile Chromium at 390 by 844 passed the directory and generic Philadelphia tour in English, Chinese, Spanish, Korean and Vietnamese.
- National Constitution Center showed the tool; Independence Visitor Center correctly hid it.
- Expand, close, keyboard close, search form, photograph link, no horizontal overflow, no writes and zero page errors passed.
- The full mobile generic-tour page was visually inspected with the tool open.
- `git diff --check` passed.

The National Mall and Freedom Trail have handmade players and need their own per-stop integration. The Met and MoMA already have Universal Gallery search bars. This release does not claim every museum page is finished. Independent Claude review is pending.
