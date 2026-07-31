# Advertising — the plan, for later

Parked deliberately. Nothing here should be started until the measurement
piece at the top is done, because everything below depends on it.

---

## The gate: when is the site ready for ads?

Spending before these are true is buying traffic the site cannot measure,
convert, or keep. Each line is checkable — no judgement calls.

**Measurement — without this, nothing else matters**
- [x] Visits counted by source (`utm_source` + referrer)
- [x] Conversions counted by source: booking created, agent signup, driver
      application. Aggregate counters only, keeping the existing no-per-visitor
      privacy design
- [x] Readable without a text editor — Archive → **🎯 Where visitors came from**,
      one row per day per source, exportable as CSV

**The thing the ad points at has to work**
- [ ] A stranger can complete a booking end to end and receive an invoice
- [x] Data survives a deploy — Render starter plan with a mounted disk
- [ ] `plateaustrategy.io` resolves on both apex and `www`, with a valid
      certificate. Today `www` is correct and the apex still points at Porkbun
      parking
- [ ] The map tools verified working against live data — attractions, hotels,
      airports, rest stops, the overnight prompt, and the fly-first city-to-city
      flow. Several were built without ever being seen against live Overpass

**Somewhere for the traffic to land**
- [ ] Destination pages server-rendered — a crawler currently sees 2 headings on
      the Destination Book, so paid visitors would arrive at an empty shell for
      anyone who does not run JavaScript

**Free channels used up first — ads are the expensive option, not the first one**
- [ ] Google Business Profile claimed (free, highest-intent local traffic)
- [ ] At least a few hotel or agency partners live in the Agent Program —
      commission-only distribution, no ad spend, already built

When every box above is ticked, the first spend should be small, local, and
search-intent based. See channels below.

---

## 0. Measurement — done

The traffic tracker used to record pageviews, unique visitors and paths, but not
**where a visit came from or whether it converted**. So $500 of ads would have
taught us one thing: pageviews went up. Not which bookings came from it, not what
a booking cost, not whether to spend more or stop.

Now in place:

- **`_visit_source()`** labels each first visit with one short word.
  `utm_source` wins when present; otherwise the referring host collapsed to a
  family, so every Google property is `google`, not `www.google.co.uk`. Our own
  pages are `internal` and never counted as a source.
- **First touch only.** A source is counted once per new visitor, not once per
  page they read — otherwise the stickiest page gets the credit instead of the
  source that actually worked.
- **`psx_src`**, a 30-day cookie holding that label (never a URL). A booking,
  agent signup or driver application made later is credited to it. Thirty days
  because an ad click is not owed credit for a booking made a year later.
- **Archive → 🎯 Where visitors came from** — one row per day per source:
  `new_visitors, bookings, agent_signups, driver_signups`. CSV export works.

Still aggregate day counters, no per-visitor trail, no third-party analytics.

### Tagging a campaign

Put `?utm_source=<label>` on any link you place anywhere. The label is what shows
up in the Archive, so make it specific enough to tell channels apart:

| Where the link lives | URL |
|---|---|
| Google Business Profile | `https://plateaustrategy.io/?utm_source=google_business` |
| A Google Ads campaign | `https://plateaustrategy.io/?utm_source=google_ads` |
| A Reddit or forum post | `https://plateaustrategy.io/trip-planner?utm_source=reddit_seattle` |
| A hotel partner's page | `https://plateaustrategy.io/?utm_source=hotel_<name>` |

Untagged links still get attributed by referrer — a tag just makes it exact, and
is the only way to tell two Google placements apart.

### Reading the result

`new_visitors` alone is not a result. The number that decides whether to keep
spending is **bookings ÷ new_visitors** for that source, compared against
`direct`. A source sending traffic that never books is spend that isn't working,
whichever way the pageview line moved.

One quirk worth knowing: a source can show conversions with **zero visits** on a
given day. Someone who arrived Monday and booked Thursday appears on Thursday's
row with `new_visitors: 0, bookings: 1`. That is correct — the visit was Monday,
the booking was Thursday.

---

## 1. Two different things both called "advertising"

| | What it is | When |
|---|---|---|
| **Buying ads** | Acquiring riders, drivers, agents | After measurement |
| **Selling ads** | Monetising the free tools | Much later — see below |

Selling ad space is premature. At current traffic, display ads pay pennies per
thousand views and make the tools worse. **Hotel and ticket commissions pay
4–8% of a real booking** — orders of magnitude more per visitor, and they fit
the product rather than fighting it.

Sell relevance now, attention later.

---

## 2. Channels, cheapest first

**a) Google Business Profile — free, unclaimed.**
Someone typing "airport transfer near me" at 5am is the highest-intent customer
this business will ever see. Being in the map pack costs nothing. Biggest
unclaimed win on the list.

**b) The Agent Program is already an ad channel — and the best kind.**
Hotels and travel agencies are distribution paid **only on results**. No upfront
spend, no attribution problem. Ten hotel partners beats a $500 ad budget, and
the program is already built.

**c) Local search ads — small, tight, after measurement.**
`seatac airport transfer`, `tesla rental rideshare seattle`. Tight geography,
tight keyword set, $10–20/day. High intent and immediately measurable — but only
once (0) is in place.

**d) The free tools are the cheapest advertising, and they already exist.**
A road trip planner that genuinely answers "what's along the way" gets shared
and linked. This is why the SEO and AI-discoverability work matters more than an
ad budget right now: it compounds, ads do not.

---

## 3. Affiliate revenue — needs accounts, not code

The plumbing is a small job; the accounts are the blocker and only the owner can
open them.

- **Hotels** — Booking.com or Expedia affiliate, 4–7% per stay. The 🏨 layer in
  the trip planner already finds and shows hotels; each one needs a
  "Check availability" link carrying an affiliate id.
- **Tickets** — GetYourGuide or Viator, 5–8%. Same shape on attraction popups.

Build it with the affiliate id as a single config constant, so it goes live the
moment an account is approved.

---

## 4. The compounding asset

`place_ratings.json`, `visit_times.json`, `destination_comments.json`,
`travel_wishes.json` — OpenStreetMap has none of this. Nobody else knows people
actually spend 40 minutes at a given place, or how travellers rated it.

It is currently locked inside a JavaScript app, so search engines and AI
assistants cannot see any of it. **Server-rendering the destination pages — one
URL per city and per place — is what turns that data into traffic.** Every place
the community adds becomes a page that can rank; every rating makes it more
unique.

That is the flywheel. Ads only convert traffic that already exists.
