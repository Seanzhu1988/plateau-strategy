# Universal Gallery private artwork research

This release expands the existing photograph research flow beyond museum-owned objects. It accepts a private collection, home, studio or gallery context and asks the vision provider for visible signatures, labels, medium clues and useful search terms. It explicitly prohibits authentication, sale valuation and claims of legal ownership.

The visitor page adds a native expandable section explaining what evidence to collect and how to continue with a photograph. It distinguishes a visual similarity from authentication, provenance or valuation. It also says that the current catalogue search does not cover every private collection or auction archive. No new private archive, auction connector or appraisal service is claimed.

The guidance is translated in Chinese, Spanish, Korean and Vietnamese through the shared language switcher. Each pack gained exactly five entries; no existing translations changed or disappeared.

Verification on September 19, 2026:

- 36 Python tests passed for photo privacy, consent, request limits, provider failures and the new private-art boundary.
- 93 JavaScript tests passed for photo preparation, story races, research limits and safe source attribution.
- Mobile Chromium at 390 by 844 passed expand, collapse, keyboard close and photograph-link checks in all four translated languages.
- The browser made no write requests, had no page errors and had no horizontal overflow.
- `git diff --check` passed.

Photographs are still stripped of metadata, sent only after explicit consent and never published. Results remain research leads requiring visitor confirmation against documented sources. Independent Claude review is pending.
