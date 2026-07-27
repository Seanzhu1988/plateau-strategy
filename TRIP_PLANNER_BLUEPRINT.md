# 🗺️ Trip Planner → Route Market — Blueprint

> The plan of record for turning the free Trip Planner into a tool that also earns.
> Written 2026-07-23. Update this file on design changes; the site's session history
> stays in the chat log, the *design* lives here.

---

## The idea in one line

**One tool, three doors.** The same planner is a free trip tool for a visitor, a
route builder for a tour guide, and a sellable inventory for an agent — and any of
them can put a real guide on the job with one tap.

---

## Why this exists

The free tools exist to bring people to the site. The planner was the best of them
and the least connected to the business — a visitor could plan a perfect day and
then leave. This blueprint closes that gap **without taking the free tool away**:
free stays free, and the paid path only appears at the moment someone actually
wants help.

---

## The three doors

| Who | What they see | What they get |
|-----|---------------|---------------|
| **Visitor** (nobody signed in) | The planner exactly as it is today | A free trip plan. Optionally: "get a guide for this route" |
| **Tour guide** (an agent account) | A **Publish** button on their route | Their route becomes bookable; they get dinged when someone wants it |
| **Agent** (an agent account) | A **route market** of published routes | Sells a guide's route to their own customer and earns commission |

**Key simplification: a tour guide IS an agent account.** No second identity system,
no new login, no new payout path. A guide is simply an agent who publishes routes
instead of referring rides. This single decision removes the most expensive piece
of a marketplace build.

---

## The guide's free studio

Most guides do not have a website, a booking page, or the money to build one. So the
editor is not a paid add-on — **it is the free tool.** On this site a guide can:

- build the route on the map (already works)
- **name it, describe it, and write a note on each stop** in their own words
- set the day, the pace, the start point, the price they want
- publish it and get a link that *is* their storefront

That is the whole product-creation kit, free, for someone with nothing but knowledge
of their city. It is the same promise as the rest of the site — the tools get you out
of the hole; you only pay the company anything when you actually earn.

---

## The book writes itself

The Destination Book and the planner are one system. **Anything anyone searches and
adds becomes a book entry** — so the book grows on its own and shows a visitor what a
city actually holds.

- Added from the planner's map search **or** the book's own "suggest & add" — same
  endpoint, same result.
- **Every new entry gets a description**, derived from the map's own classification
  and address (`Museum in Georgetown, Seattle.`) — nothing is invented, and the
  category (`culture` / `food` / `nature` / `views` / `history`) is derived the same way.
- A **re-search fills in what's missing**: an older entry with a blank description gets
  one. A description a person actually wrote is never overwritten.
- Community entries carry `source:"user"`, `auto_desc`, and `found_via` so a curated
  guide tip is always distinguishable from a machine-written line.

Both tools live in the **Transportation** tab as free cards, alongside Ride, Rentals
and the Agent Program.

---

## Real map, real time data

A route a guide sells has to be real:

- **The drawn route follows actual roads** — each day's stops go to the routing service
  and come back as true driving geometry (29 points on a 3-stop Manhattan day, vs. 4
  straight-line corners before). Straight dashes remain only as a labelled fallback.
- **Day totals come from the routing service**, then get the same traffic adjustment
  the rest of the planner uses — free-flow 5 min shows as 8 min in Manhattan daytime,
  so the map can never promise a drive time the itinerary disagrees with.
- Above `MATRIX_MAX` places the tool says it is estimating instead of failing silently.

---

## Stay times: the site learns how long a place is worth

Whoever sets a visit length in the planner teaches the site. Those durations are
collected per place and fed back as a recommendation, so a first-time visitor
inherits what everyone before them learned.

**Two separate signals — they are never mixed:**

| Signal | Floor before it's shown | Shown as |
|--------|------------------------|----------|
| **Public endorsed** — anyone who set a time | 3 people | `👥 60m public` |
| **Guide endorsed** — a verified tour guide | 1 guide | `🎓 90m guide` |

- **A guide's time outranks the crowd's** when both exist — that's what the planner
  applies. A professional's judgment is the product.
- **"Guide" is granted only by a verified agent code.** A claimed endorsement is worth
  nothing, so an unverified claim is silently recorded as public.
- **Median, never average** — one person typing 999 must not move the number.
- **Below the floor the site says nothing.** An opinion is not a fact.
- **Your own edit always wins** over any recommendation (`visit_mine`).
- Durations only. No identities, no accounts, nothing personal is stored.

Endpoints: `POST /api/visit-time` (record) · `GET /api/visit-times?city=` (read) ·
enriched into `/api/destinations` as `typical_visit` + `visit_n`. Store:
`visit_times.json` (gitignored). Range guard 5–600 min, 300 samples per place.

**Why this matters commercially:** it makes routes *realistic*, and a guide-endorsed
timing is a reason to buy the guide's route instead of guessing.

---

## The route object

A route is the saved output of the planner, owned by whoever built it.

```
route = {
  id, code,                       # RT_20260723_001 / "SEA-4K2M" (shareable)
  title, city, summary,
  owner_agent_id,                 # the guide (null = anonymous visitor route)
  stops: [ {name, lat, lon, cat, close, visit, arr, leave, day} ],
  start: {lat, lon}, leave_at, traffic,
  days, total_minutes,
  status: draft | published | retired,
  version,                        # publishing FREEZES a snapshot
  price_usd, guide_note,
  created_at, published_at, sales_count
}
```

**Versioning rule (decided):** publishing freezes a snapshot. Editing a published
route creates a **new version**; agents who adopted the old one keep selling what
they adopted until they choose to update. Nobody's sold product changes underneath
them.

---

## The offer handshake ("the ding")

Two doors, **one offer object** — only `source` differs.

```
Visitor  ──"get a guide for this route"──┐
                                         ├──► OFFER ──► guide dinged ──► accept / decline / expire
Agent    ──"sell this to my customer"────┘
```

- **Accept** → becomes a normal reservation (`trip_type="tour"`) carrying
  `route_id`, `guide_id`, and `agent_id` → Square invoice → payout, all on
  existing rails.
- **Decline** → sender told immediately.
- **No answer by the deadline** → offer expires, sender told. *This is the failure
  mode that kills marketplaces — a customer left hanging. It gets a deadline and an
  alert, not hope.*

**Reuse, don't reinvent:** this is structurally identical to the existing driver
dispatch broadcast (reservation → drivers notified → someone takes it → uncovered
reminder when nobody does). Guides are drivers with a different skill. The offer
board reuses that flow, the reminder loop, and the Dispatch "needs attention"
banner.

**Notification cost rule:** email + dashboard by default; **SMS only for
time-critical dings.** Twilio has been overcharging — every event does not deserve
a text.

---

## Money

| Path | Split |
|------|-------|
| Visitor → guide (no agent) | Guide's fee · company commission |
| Agent → guide | Guide's fee · agent commission · company commission |

- The **customer pays the company's Square invoice**; we are the merchant of record
  for the service, exactly as with rides today.
- The commission is **accounting deducted before payout** — the guide is paid
  through the existing payout system (PayPal or marked-paid).
- **We do NOT hold customer funds in escrow on a guide's behalf.** Invoicing for our
  own service is the business we already run; escrowing third-party funds is a
  different legal animal and is deliberately out of scope.

Existing plumbing this rides on: `commission_rate` (10% default), `commission_usd`
($15 flat), `agent_id` on reservations, Square invoices, `/api/payouts`.

---

## Rules still to decide (business calls, not code)

1. **Guide response deadline** — how long before an offer expires?
2. **Double-booking** — may a guide accept two tours on the same day? (Needs a
   conflict check either way.)
3. **Customer ownership** — if that customer rebooks the same guide next month,
   does the agent still earn? For how long?
4. **Guide fee authority** — does the guide set the price and the agent add margin,
   or does the agent quote freely above a guide floor?
5. **Company commission rate** on the guide path.

None of these block Phases 1–2.

---

## Build phases

| Phase | What | Earns money? | Status |
|-------|------|--------------|--------|
| **1** | Fix the six bugs · move the tool into Transportation | no — foundation | **in progress** |
| **2** | Save a route → shareable link (`/r/SEA-4K2M`) | no — makes routes real | next |
| **3** | "Get a guide for this route" — visitor dings guide | **yes, no marketplace needed** | **offer capture in progress** |
| **4** | Route market — agents browse, adopt, ding | yes | planned |

### The one-page layout (Sean's sketch, 2026-07-23)

Sean drew the whole tool as one screen. Built so far:

- **`State` → `City` pickers** at the top, seeded from our cities (New York / Washington
  DC / Washington→Seattle), growing as travelers add places in new cities.
- The trip renders as the ordered chain **D1 → D2 → …** (the numbered stops) beside the **Map**.
- **The three doors, as an action bar at the bottom:**
  - 🚗 **I need a ride** → the working reservation flow (`/book`), trip stashed for prefill.
  - 🙋 **Prefer my trip to a guide** → opens a handoff form (name + contact + note) →
    `POST /api/guide-offer` → stored + owner alerted. This is the **offer object** — the
    first slice of the ding handshake.
  - 🏷️ **Offer it as a guided trip** → guides only (verified agent code) → lists the route
    with a price → `status: LISTED`.

`guide_offers.json` (gitignored). `GET /api/guide-offers` is owner-gated. **No money
moves here** — this captures intent; the accept/decline/expire handshake routed to a
specific guide is the next build.

**Why this order:** Phase 3 earns before a marketplace exists. Phase 4 then becomes
mostly screens, because the offer handshake already works. And nothing gets built on
top of a planner that still loses your work.

---

## Bug register (found 2026-07-23 by code audit)

| # | Bug | Why it matters | Status |
|---|-----|----------------|--------|
| 1 | The trip itself is never saved — only the place list | Reload wipes a route you were building. Fatal once routes are products | **fixed P1** |
| 2 | Auto-plan picks purely by earliest closing time, ignoring drive distance | Sends you across town and back — bad routes | **fixed P1** |
| 3 | Search is worldwide and unbounded | "Museum" in Seattle can drop a pin in Europe, wrecking the map + matrix | **fixed P1** |
| 4 | Community places only merge when a sample button is clicked | Returning visitors never see what the site learned | **fixed P1** |
| 5 | Removing one place silently wipes the whole trip | Index shift forces a reset with no warning | **fixed P1** |
| 6 | Drive-time matrix has no size guard | As places accumulate the request quietly fails → silent estimate mode | **fixed P1** |

---

## Where things live

```
trip-planner.html          the tool (map, engine, roles)
destination-book.html      the curated book; feeds the planner
destinations.json          places + community memory (source:"user")
app.py                     /trip-planner, /api/destinations*, routes + offers API
routes.json                saved & published routes            (phase 2)
offers.json                the ding handshake                  (phase 3)
```

**Kill switches:** every earning layer is env-gated and reversible —
`ROUTE_MARKET_ENABLED`, `GUIDE_OFFERS_ENABLED`. Off = the tool is exactly the free
planner it is today.

---

## The discipline

The regular customer must never be made to feel like a lead. Publish, adopt, and
commission UI stays **invisible** unless you are signed in as a guide or an agent.
The free tool has to stay a genuinely good free tool — that is what brings the
traffic the rest of this depends on.
