# Pulse mobile refinement

## Scope

The existing owner-only `/pulse` dashboard, refined for a phone while away.
No trading order routes, payment operations, customer records or credentials
were changed. The HTML shell remains public; all business data still requires
the existing owner session. Responses containing aggregates are private and
not cacheable.

## What changed

- Today, 7-day and 30-day traffic views with preceding-period comparisons.
  Multi-day figures sum daily visitors, not unique people across the period.
  Comparisons disclose the current partial day and do not invent growth from
  absent, incomplete or zero previous baselines.
- Existing audience language/device counters, booking/inquiry/signup counts,
  sources, locations, landing pages and popular pages follow the chosen period.
- Read-only gallery archive totals, actual stories, writing retries/backlog,
  unresolved research, scout progress and site generation allowance.
  A configured key is explicitly not proof of provider credit or successful AI.
- Missing/corrupt stores show unavailable, not apparent zero activity. Old
  persisted worker states do not present past completion or a crashed run as live.
- Search demand checks the canonical story archive and no longer assumes an
  artist's name proves that every artifact has a story. Pulse reads the bounded
  tally instead of loading the entire append-only search log on each refresh.
- Visible last-success/failure status, 12-second request deadlines, no overlapping
  refreshes, hidden/offline polling pause and stale online-count labeling.
- Expandable phone reports, readable long paths/queries, tap/keyboard chart values,
  and genuinely lazy loading of the place job list. Existing trading snapshot and
  visit-exclusion actions are retained.

## Verification

Isolated Python aggregation and route tests cover all periods, owner authorization,
read-only storage, missing-data states, canonical story matching and no private
identity/token/photograph leakage. JavaScript tests cover refresh ordering,
timeouts, offline/hidden states, lazy worklist, failed-save rollback and charts.

Browser acceptance uses a loopback-only fixture with a prominent sample-data
banner. At 390 by 844 pixels, the page and expanded reports have no horizontal
overflow; every visible button is at least 44 pixels tall. Switching periods
changes the actual metrics. Worklist requests are zero before opening and one
after opening. A simulated 503 preserves the last numbers, marks them stale and
replaces "online now" with "online at last update"; the next successful refresh
recovers. No fixture data is included in the production template.

The live private dashboard requires the owner's normal sign-in; no production
session was fabricated for testing. Verify the deployed public shell, owner-only
401 responses, manifest and website/gallery regression suite after publication.

## Deployment and rollback

Ship only reviewed source, tests and this note to the verified website repository.
No database migration or durable-state modification is introduced by Pulse.
Rollback trigger: owner data appears without authentication, Pulse stops rendering,
or core public routes fail after deployment. Restore the prior code release without
reverting or deleting runtime data. A Render persistent-disk remount can briefly
return 502 during deployment; check recovery before reporting completion.
