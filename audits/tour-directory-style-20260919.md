# Public tour directory style and action placement

This release applies Sean's requested public tour-directory visual language: body text `#0F172A`, primary brand `#033E3E`, tour links `#123456` and the Open tour action `#F37021` with dark text. The label now says Semi-Walking tours. Open tour appears beside Your stops, in order, with one action on the page.

The two new visitor-facing phrases ship in English, Chinese, Spanish, Korean and Vietnamese. Each non-English pack gained exactly two entries; no existing translation changed or disappeared.

Verification on September 19, 2026:

- 21 public-directory JavaScript tests passed, preserving 13 routes, 163 ordered stops, search, model links and public-photo safeguards.
- Four Python language and asset-route tests passed.
- Mobile Chromium at 390 by 844 passed all five languages, exact colors, one Open tour action in the requested location, no horizontal overflow, no write requests and zero page errors.
- The full mobile page was visually inspected after the automated check.
- `git diff --check` passed.

No routes, stops, stories, models, photographs or audio were changed. Museum-specific Universal Gallery tools remain a separate pending release. Independent Claude review is pending.
