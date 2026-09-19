# Freedom Trail museum tools

This release adds the mini Universal Gallery search and photograph entry to four reviewed museum experiences in the handmade Freedom Trail player. The stops are Old South Meeting House, Old State House, Paul Revere House and USS Constitution.

The page uses the same explicit `universal_gallery` metadata as the public directory and standard tour player. Ordinary trail stops do not show the tool. Each museum stop has its own search input, and the photograph action continues to the existing consent-based Universal Gallery flow. Opening the tool does not upload a photograph, start a search or make a paid request.

The controls reuse the shipped English, Chinese, Spanish, Korean and Vietnamese translations. Native details controls provide pointer and keyboard open and close behavior. Existing stop order, stories, photographs, audio selection and 3D model links are preserved.

Verification on September 19, 2026:

- Eighteen relevant Python tests passed for routes, audio structure, language assets, sitemap coverage and explicit museum metadata.
- Fifty relevant JavaScript tests passed, including exact stop content, directory coverage, 3D integration, slideshow behavior and byte-for-byte audio path protection.
- Mobile Chromium at 390 by 844 checked all four stops in English, Chinese, Spanish, Korean and Vietnamese.
- Expand, close, keyboard close, search form, photograph link, ordinary-stop exclusion, no horizontal overflow, no writes and zero page errors passed.
- The English mobile layout was visually inspected with the Old South Meeting House tool open.
- `git diff --check` and JSON validation passed.

The Met and MoMA already have search bars. The standard tour player, National Mall and Freedom Trail now provide the same Gallery entry from their reviewed museum stops. This release does not add new audio or claim that a visual result authenticates or values an object. Independent Claude review is pending.
