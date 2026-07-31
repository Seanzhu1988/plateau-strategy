# Advertising — the plan, for later

Parked deliberately. Nothing here should be started until the measurement
piece at the top is done, because everything below depends on it.

---

## The gate: when is the site ready for ads?

Spending before these are true is buying traffic the site cannot measure,
convert, or keep. Each line is checkable — no judgement calls.

**Measurement — without this, nothing else matters**
- [ ] Visits counted by source (`utm_source` + referrer)
- [ ] Conversions counted by source: booking created, agent signup, driver
      application. Aggregate counters only, keeping the existing no-per-visitor
      privacy design

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

## 0. Do this first: measurement (the prerequisite)

The site's traffic tracker (`traffic.json`) records pageviews, unique visitors
and paths. It deliberately does **not** keep a per-visitor log — visitor ids are
folded down to counts once a day closes. That privacy stance is worth keeping.

What it does not record: **where a visit came from, and whether it converted.**

So today, $500 of ads would teach us exactly one thing — pageviews went up. Not
which bookings came from it, not what a booking cost, not whether to spend more
or stop.

**The work:** count visits *by source* (referrer + `utm_source`) and count
*conversions* by source — bookings created, agent signups, driver applications.
Aggregate counters only, no per-visitor trail, so the existing privacy design
survives. Roughly an hour.

Until that exists, every ad dollar is unattributable.

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
