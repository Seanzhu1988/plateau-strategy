# Ivy League branding references — private preview only

Checked 2026-09-12. Owner scope: `ivy-branding.js` and this audit only. No production pages, tour IDs, stop order, narratives, recordings, or model files changed. No asset was downloaded into the repository, generated, traced, or altered. Nothing was pushed or deployed.

## Contract and display

`IVY_BRANDING` is an ES-module named export keyed by `harvard`, `yale`, `princeton`, `columbia`, `penn`, `brown`, `dartmouth`, and `cornell`. A consumer may remove the exact `ivy-` prefix from the stable tour ID to look up the school. Each record has `name`, `logoUrl`, `logoAlt`, `mascotName`, `mascotNote`, and `sources`. Six records also have `mascotImageUrl`, `mascotImageAlt`, and `mascotImageCredit`.

Use the logo unchanged beside the school name, with preserved aspect ratio and clear space. These are the actual logos shown by each school's official athletics site, not invented school emblems. Use `object-fit: contain`; do not recolor, crop into a circle, apply grayscale, or recreate the mark in text. Keep a plain school-name fallback if an image fails. Mascot qualifications must remain visible in the compact name, not only in an expandable note. Optional photographs should be lazy-loaded in a selected school's details, not downloaded for every small row. They are mascot photographs, not photographs of a tour destination or a particular stop.

## Identity verification

| School | Display identity | Primary evidence and decision |
|---|---|---|
| Harvard | Crimson — team identity | [Harvard Athletics' timeline](https://gocrimson.com/sports/2020/5/5/information-history-traditiontimeline) identifies Crimson as the chosen nickname and color. It does not establish a character mascot. No “John Harvard the Pilgrim,” animal, or mascot photograph is invented. This is deliberately not a categorical claim that no Harvard group has ever used a mascot. |
| Yale | Handsome Dan — bulldog | [Yale Visitor Center](https://visitorcenter.yale.edu/handsome-dan) and [Yale Athletics' mascot history](https://yalebulldogs.com/sports/2019/6/25/information-mascot-handsome-dan-index.aspx) identify the live bulldog tradition. The display avoids a numeral that would become wrong when a new dog succeeds the current mascot. |
| Princeton | The Tiger | [Princetoniana](https://princetoniana.princeton.edu/campus/landmarks/tigers) documents the Tiger at athletics and community events. The mascot is not given an invented personal name. |
| Columbia | Roar-ee the Lion | [Columbia College's history](https://www.college.columbia.edu/alumni/item/roar-ee-born-columbia-athletics-presents-new-logo) documents Roar-ee's 2005 introduction; [Columbia Athletics](https://gocolumbialions.com/news/2013/9/23/209264173) supplies the photograph. |
| Penn | The Penn Quaker | [Penn Today](https://penntoday.upenn.edu/news/penn-mascot-inside-quakers-head) identifies the Quaker and profiles a performer. Do not substitute Penn State's Nittany Lion, a Quaker Oats logo, or Benjamin Franklin. |
| Brown | Bruno and Cubby — bears | [Brown Athletics' mascot page](https://brownbears.com/sports/2018/4/27/Marketing-Spirit-Support-Mascots-Mascots) names both bears; its main photograph depicts the pair. [Brown's history](https://www.brown.edu/news/2023-07-24/bruno) also establishes Bruno's role. |
| Dartmouth | Big Green — team identity, no official mascot | [Dartmouth's athletics page](https://home.dartmouth.edu/campus-life/athletics-recreation) establishes Big Green. [The student creators' Keggy page](https://sites.dartmouth.edu/jacko/keggy/) describes the lack of an official mascot and their own creation. Keggy is not represented as official, and no image of Keggy or the retired Indigenous caricature is included. |
| Cornell | Touchdown the Big Red Bear — unofficial | The [current Cornell Enrollment FAQ](https://faq.enrollment.cornell.edu/kb/article/221-what-is-cornell-s-school-mascot/) explicitly calls the bear unofficial; [Cornell Athletics](https://cornellbigred.com/sports/2007/7/11/History.aspx) agrees. [Cornellians](https://alumni.cornell.edu/cornellians/traditions-trivia/) identifies and pictures Touchdown. A student resolution proposing official status is not treated as evidence that it was granted. |

## Logo provenance and transport checks

Every `logoUrl` was extracted from the actual HTML of the corresponding official athletics home page, not guessed from a third-party logo catalog. SIDEARM's CloudFront URLs are the assets those official pages themselves serve. All eight returned HTTP 200 and `image/svg+xml` when checked. No authentication, cookies, paid API, or media-display workaround was used.

| Official source | Asset suffix | Observed SVG dimensions | Visible colors |
|---|---|---|---|
| [Harvard Athletics](https://gocrimson.com/) | `gocrimson.com/images/responsive_2024/logo_main.svg` | 56 × 56 | Crimson/white |
| [Yale Athletics](https://yalebulldogs.com/) | `yalebulldogs.com/images/responsive_2019/yale_logo_primary.svg` | 146 × 36 | Navy |
| [Princeton Athletics](https://goprincetontigers.com/) | `princeton.sidearmsports.com/images/nextgen_2022/logo_main.svg` | 56 × 64 | Orange/black |
| [Columbia Athletics](https://gocolumbialions.com/) | `/images/sng_2025/logo_main.svg` | 120 × 60 | Blue |
| [Penn Athletics](https://pennathletics.com/) | `penn.sidearmsports.com/images/responsive_2021/main.svg` | 315 × 386 | Red/blue/white |
| [Brown Athletics](https://brownbears.com/) | `brownuni.sidearmsports.com/images/sng_2022/logo_main_updated.svg` | 100 × 123 | Brown/red |
| [Dartmouth Athletics](https://dartmouthsports.com/) | `dartmouthsports.com/images/nextgen_2025/logo_main.svg` | 95 × 120 | Green |
| [Cornell Athletics](https://cornellbigred.com/) | `cornellbigred.com/images/responsive_2025/logo_main.svg` | 76 × 100 | Red |

## Photograph provenance and visual checks

All six selected photographs were opened and inspected in the research browser. They depict the named mascot(s); the original remote files are unchanged. Historical photographs are not claims about the costume currently worn in 2026. Exact URLs are in the module, while the source article remains attached to each record.

| School | Selected photograph | Source credit / limit |
|---|---|---|
| Yale | Handsome Dan resting with a chew toy; 320 px derivative published by the Visitor Center | Yale Visitor Center; the selected page did not identify a photographer. No invented individual credit. |
| Princeton | Tiger in an orange jersey with football fans | [University news, 2019](https://www.princeton.edu/news/2019/12/03/tiger-athletics-give-day-returns); courtesy of Princeton Athletics. |
| Columbia | Roar-ee in a light-blue Columbia jersey | [Athletics article, 2013](https://gocolumbialions.com/news/2013/9/23/209264173), referencing a 2011 image-path asset. Publisher credit: Columbia University Athletics; no separate photographer established. |
| Penn | Fully costumed Quaker waving on Locust Walk | [Penn Today, 2022](https://penntoday.upenn.edu/news/penn-mascot-inside-quakers-head), photographer Eric Sucar. The article's first image of the performer with the mascot head removed was inspected and rejected in favor of the fully costumed picture. |
| Brown | Bruno and Cubby standing together by an athletics field | Official [Bruno & Cubby page](https://brownbears.com/sports/2018/4/27/Marketing-Spirit-Support-Mascots-Mascots), 2018 asset. Publisher credit: Brown University Athletics; no separate photographer established. |
| Cornell | Touchdown waving in front of students in the stands | [Cornellians, 2025](https://alumni.cornell.edu/cornellians/traditions-trivia/), photograph credited to Sreang Hok / Cornell University. |

## Restrictions and publication boundary

These URLs establish provenance, not ownership or permission. Logos and mascot likenesses are university-associated marks; photographs are not assumed public domain or Creative Commons merely because they are publicly viewable. This module is for the requested private design preview and contains no public-use clearance. A future publication decision must review the specific proposed use, the universities' requirements, photograph rights, and whether linking rather than displaying is appropriate. No legal assurance is made here.

Examples of the source owners' stated restrictions:

- [Yale Identity](https://yaleidentity.yale.edu/core-identity-elements/yale-logo-and-wordmarks/yale-logo) requires Trademark Licensing approval for logo/wordmark use in non-Yale publications or displays. This is not satisfied by downloading the asset or giving credit.
- [Harvard Trademark Program](https://trademark.harvard.edu/faq) identifies protected wordmarks, the H letter-mark and VERITAS shields and discusses permission/licensing. The preview is not a Harvard endorsement.
- [Princeton Trademark Licensing](https://trademarks.princeton.edu/faq) identifies protected university names, shields and tiger designs.
- [Brown's visual identity policy](https://policy.brown.edu/policy/visual-identity) identifies university and athletics marks, including mascot-associated names.
- [Columbia's athletics brand guide](https://gocolumbialions.com/documents/download/2025/8/27/060-1964_Athletics_StyleGuide_v10.pdf) distinguishes the varsity mark from restricted cartoon/club marks. The module uses the official site's unchanged primary logo.
- [Keggy's creators](https://sites.dartmouth.edu/jacko/keggy/) describe their rights and restrictions. No Keggy image is used.

Before any approved publication: confirm image availability, retain accurate mascot qualifications and credits, review permissions, add an explicit non-affiliation statement, and use text fallback when approval or image availability is absent. Do not turn this preview module into an automatic asset scraper, publishing job, or new external image proxy. Loading remote images can expose a visitor's IP address to their host; use `referrerpolicy="no-referrer"` and consider the host behavior during the separate privacy review.

## Local verification

A no-network Node module-import assertion run passed: exactly eight expected school keys; all required string fields; HTTPS logo, photograph and source URLs; at least two primary source references per school; exactly six optional images with alt text and credit; explicit Harvard/Dartmouth team-identity and Cornell unofficial qualifications; no invented Harvard/Dartmouth mascot image. Whitespace checks passed. This verifies the data contract, not university permission or future remote-host availability. The prototype owner performs the separate page integration and layout review.
