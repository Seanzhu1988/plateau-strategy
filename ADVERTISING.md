# Advertising, the plan, for later

Parked deliberately. Nothing here should be started until the measurement
piece at the top is done, because everything below depends on it.

---

## The gate: when is the site ready for ads?

Spending before these are true is buying traffic the site cannot measure,
convert, or keep. Each line is checkable, no judgement calls.

**Measurement, without this, nothing else matters**
- [x] Visits counted by source (`utm_source` + referrer)
- [x] Conversions counted by source: booking created, agent signup, driver
      application. Aggregate counters only, keeping the existing no-per-visitor
      privacy design
- [x] Readable without a text editor, Archive → **🎯 Where visitors came from**,
      one row per day per source, exportable as CSV

**The thing the ad points at has to work**
- [ ] A stranger can complete a booking end to end and receive an invoice
- [x] Data survives a deploy, Render starter plan with a mounted disk
- [~] `plateaustrategy.io` resolves on both apex and `www`, with a valid
      certificate. DNS is now right, both point at Render (216.24.57.x), the
      Porkbun parking record is gone. The certificate still needs an eyes-on
      check: open both in a browser and confirm the padlock, no warning
- [ ] The map tools verified working against live data, attractions, hotels,
      airports, rest stops, the overnight prompt, and the fly-first city-to-city
      flow. Several were built without ever being seen against live Overpass

**Somewhere for the traffic to land**
- [ ] Destination pages server-rendered, a crawler currently sees 2 headings on
      the Destination Book, so paid visitors would arrive at an empty shell for
      anyone who does not run JavaScript

**Free channels used up first, ads are the expensive option, not the first one**
- [ ] Google Business Profile claimed (free, highest-intent local traffic)
- [ ] At least a few hotel or agency partners live in the Agent Program, 
      commission-only distribution, no ad spend, already built

When every box above is ticked, the first spend should be small, local, and
search-intent based. See channels below.

---

## 0. Measurement, done

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
  page they read, otherwise the stickiest page gets the credit instead of the
  source that actually worked.
- **`psx_src`**, a 30-day cookie holding that label (never a URL). A booking,
  agent signup or driver application made later is credited to it. Thirty days
  because an ad click is not owed credit for a booking made a year later.
- **Archive → 🎯 Where visitors came from**, one row per day per source:
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

Untagged links still get attributed by referrer, a tag just makes it exact, and
is the only way to tell two Google placements apart.

### Reading the result

`new_visitors` alone is not a result. The number that decides whether to keep
spending is **bookings ÷ new_visitors** for that source, compared against
`direct`. A source sending traffic that never books is spend that isn't working,
whichever way the pageview line moved.

One quirk worth knowing: a source can show conversions with **zero visits** on a
given day. Someone who arrived Monday and booked Thursday appears on Thursday's
row with `new_visitors: 0, bookings: 1`. That is correct, the visit was Monday,
the booking was Thursday.

---

## 0.5 The identity the advertising points at

Before any listing or campaign: **the business has to be reachable and it has to
describe itself the same way everywhere.** Google matches a Business Profile
against the website. If the name, phone or service area differ, verification gets
harder and the two work against each other instead of reinforcing.

Where it stood before this section was written: the public site had **no phone
number and no contact email anywhere a customer could find**. The only real
contact details in the whole codebase were inside `partners.html`, in a
copy-paste *sales script* aimed at hotels. Someone who wanted a 5am airport
pickup had no way to call.

That is a bigger hole than any ad budget. Fixed now:

- **`LocalBusiness` schema** on the landing page, the node Google's local search
  actually reads. Service area (Seattle + SEA), 24/7 hours, the $75 flat rate as
  a real `Offer`, and a `ReserveAction` pointing at `/book`. Deliberately **no
  `streetAddress`**: this is a service-area business, the car comes to you.
- **Footer contact block**, service area, hours, and the flat rate, in markup a
  crawler reads on the first page it fetches.

- [~] **Business email, `hello@plateaustrategy.io`.** Decided over the personal
      Gmail: a gmail.com address on a car-service listing costs conversions for
      no reason, and the domain is already paid for.

      **Published, then pulled back the same day.** A direct DNS query showed
      `plateaustrategy.io` has no MX records at all, so mail to that address
      bounces, the address went live before mail routing existed, which is the
      wrong order. It goes back the moment Porkbun forwarding is on; the exact
      line is kept in a comment in the footer and in `_todo_email` on the schema
      node. Lesson worth keeping: check that an address receives mail *before*
      advertising it.

**Still open, needs an account, not code:**

- [ ] A **Seattle business phone number** (206/425/253), published on the site
      and on the Business Profile. Decided against the personal 917 mobile:
      Google treats an area code that doesn't match the service area as worth a
      second look, transportation listings already get suspended more than most
      categories, and a New York number on a Seattle listing invites exactly
      that scrutiny. It also just reads as out-of-town to the customer.

      The drop-in point is marked in two places, the footer comment in
      `landing-page.html` and `_todo_telephone` in the `LocalBusiness` node.
      Same digits in both, and on the Business Profile.

### Setting up the two accounts

**Phone, Google Voice, free, ~10 minutes.** `voice.google.com` → sign in →
*Get a Google Voice number* → search area code **206** → pick one → link your
existing mobile. Calls forward to the phone you already carry, so nothing
changes about how you answer. Worth knowing: Google Voice numbers are sometimes
rejected for Business Profile verification. If that happens, a $10, 15/month
number from Grasshopper or OpenPhone is the fallback, and both give you a real
business line with voicemail.

**Email, Porkbun forwarding, free, ~5 minutes.** Porkbun account → the
`plateaustrategy.io` domain → *Email Forwarding* → forward `hello@` to your
Gmail. Mail arrives where you already read it; customers see the domain. To
*reply* as `hello@`, add it in Gmail under Settings → Accounts → *Send mail as*.

Once the number exists, send it over and it goes into both files in one edit.

### The canonical description, use this everywhere, unchanged

> **Plateau Strategy Solution Lab**
> Flat-rate Tesla airport transfers and car service in the Seattle area,
> including Seattle, Tacoma International Airport (SEA). $75 flat to SeaTac.
> Available 24/7 by reservation.

Same words on the Business Profile, the website, and any directory listing.
Consistency is most of what "local SEO" actually is.

---

## 0.75 Google Business Profile, the filing, field by field

Free, and the highest-intent traffic this business can get. **Not instant**, 
verification usually takes 5, 14 days, so file it today even though the paid test
runs first. Start at `business.google.com`.

| Field | Value |
|---|---|
| Business name | `Plateau Strategy Solution Lab` (exactly, no keywords appended; keyword-stuffed names get listings suspended) |
| Category (primary) | **Car service**, or `Airport shuttle service` if the intent is mostly SEA runs |
| Category (secondary) | `Limousine service`, `Car rental agency` |
| Address | **Hide it.** Choose "I deliver goods and services to my customers", this is a service-area business |
| Service area | Seattle, Bellevue, and any city actually served. Do not list cities you would decline |
| Phone | The new Seattle 206 number, same digits as the website footer |
| Website | `https://plateaustrategy.io/?utm_source=google_business` |
| Hours | Open 24 hours, all 7 days, matches the site's 24/7 claim |
| Services | `SeaTac airport transfer, $75 flat`, `Tesla rental for rideshare drivers` |
| Description | The canonical paragraph above |
| Photos | **The single highest-leverage field.** Real photos of the actual Tesla, interior and exterior, in daylight. Listings with photos get materially more clicks than listings without. Stock images are worse than none |

One warning specific to this business: **transportation listings get suspended
more than most categories.** Do not append keywords to the name, do not list a
service area you can't cover, and don't use a virtual-office address. The rules
are boring and enforcement is automated.

---

## 0.9 The first paid test, ready to paste

$10/day × 7 days ≈ **$70**. The purpose is not profit, it's finding out whether
the click-to-booking path works at all.

**Campaign type:** Search only. Turn off Display Network and Search Partners, 
Google enables them by default and they'll eat the budget on untargeted
impressions.

**Location:** Seattle + Bellevue + Tukwila + SeaTac, radius-targeted. Set it to
*"Presence: people in or regularly in your targeted locations"*, the default
also includes people merely *searching about* the area, which means paying for
clicks from other states.

**Keywords**, exact and phrase match only. Broad match will spend the whole
budget on people shopping for a Tesla to buy:

```
[seatac airport transfer]
[seatac airport car service]
[airport shuttle to seatac]
"private car to seatac airport"
"seattle airport transfer service"
"tesla car service seattle"
[black car service seattle airport]
```

**Negative keywords**, add these before launching, not after:

```
-job -jobs -hiring -driver -career -salary
-free -cheap -coupon
-buy -sale -for sale -price of -lease
-uber -lyft -parking -flight -flights
-rental car -rent a car -car rental
```

`-driver` and `-rental car` matter twice over here: the site *also* recruits
drivers and rents Teslas, so those searches would land on a rider ad and convert
as nothing.

**Ad copy.** Fifteen headlines and four descriptions per language, which is
what a Responsive Search Ad wants, Google rotates them and learns which
combinations work, so a set of three starves the test.

Every claim is checkable on the site. The earlier draft carried "Book in Under
2 Minutes", which nobody had timed; it is gone. Run `python3 check_ads.py`
before uploading, it enforces the real limits, and Google **counts a
double-width character as two**, so a Chinese headline gets 15 characters, not
30. Copy written in English and then translated is rejected at upload, which is
the ordinary way a multilingual campaign fails before it starts. One English
description came back at 91 against a 90 limit on the first run.

*English headlines (≤30):*
```
Flat $75 to Sea-Tac              Seattle to Sea-Tac, $75
Seattle Airport Car Service      Price Agreed Before Booking
Tesla Airport Transfer           Book Your Sea-Tac Ride
The Quote Is the Fare            Service in Five Languages
No Surge, No Meter               Ride to Sea-Tac in a Tesla
Reserve Any Hour, 24/7           Airport Transfer, Flat Rate
Driver Arrives 15 Min Early      Quoted Once. That's the Fare.
Fixed-Price Airport Rides
```

*English descriptions (≤90):*
```
Flat $75 to Sea-Tac. The fare you are quoted is the fare you pay. No surge, no meter.
Reserve any hour of the day. Your driver arrives fifteen minutes early, in a Tesla.
Seattle airport transfers at a price agreed before you book. Pay exactly what was quoted.
Book in English, Chinese, Korean, Vietnamese or Spanish. A Seattle service, not an app.
```

Chinese, Spanish, Korean and Vietnamese sets are in `check_ads.py`, written to
the same standard and length-checked. They are not translations of the English
, an ad has to be written in the language, because "No Surge, No Meter" has no
literal equivalent worth running. 不加价 不计表 says it in six characters.

---

### The angle worth more than the budget

The site now works in five languages, and **Seattle has one of the largest
Chinese, Korean and Vietnamese speaking populations in the country.** Somebody
landing at Sea-Tac who would rather arrange a car in their own language is
poorly served by every incumbent, the apps are English-first and a phone call
means explaining an address in a second language at five in the morning.

That is a real edge, cheaply defended, and it is the reason the translation
work is a marketing asset rather than a nicety:

- Non-English keywords are far cheaper. Almost nobody bids on 西雅图机场接送
  or 시애틀 공항 픽업 against the flood on "seatac airport transfer".
- Intent is higher. Someone searching in Chinese for an airport car has already
  decided not to use the app.
- **Run them as separate campaigns, not one campaign with translated ads.**
  Google targets language and location separately; mixing them spends the
  English budget on impressions nobody clicks.
- Point each at the site with the language pre-selected and its own source tag,
  so the Archive shows which language actually converts:
  `https://plateaustrategy.io/?lang=zh&utm_source=google_zh`

Budget the first test in English only. Add one non-English campaign once the
booking flow is proven end to end, a language you cannot support on the phone
is a booking you cannot complete.

### What "it worked" looks like after 7 days

Read Archive → 🎯 Where visitors came from, row `google_ads`:

| Result | What it means | What to do |
|---|---|---|
| No clicks | Keywords too narrow, or bid too low | Widen geography before widening keywords |
| Clicks, no bookings | The ad works, the landing page doesn't | Stop. Fix the page. More spend won't help |
| ≥1 booking | The path works end to end | Compute cost per booking against the $75 fare before scaling |

$70 buys roughly 15, 30 clicks in this category. That is enough to tell whether
the page converts at all, and not enough to measure a rate precisely, don't
over-read a single week.

---

## 1. Two different things both called "advertising"

| | What it is | When |
|---|---|---|
| **Buying ads** | Acquiring riders, drivers, agents | After measurement |
| **Selling ads** | Monetising the free tools | Much later, see below |

Selling ad space is premature. At current traffic, display ads pay pennies per
thousand views and make the tools worse. **Hotel and ticket commissions pay
4, 8% of a real booking**, orders of magnitude more per visitor, and they fit
the product rather than fighting it.

Sell relevance now, attention later.

---

## 1.5 Offers that arrive by ad, the Reddit $500, evaluated

A Reddit Ads signup link with a matched-credit promo came in. Recording the
answer here so it does not get re-argued the next time one lands, because
these arrive constantly and they all read as free money.

**What it actually is.** Spend $500, get $500 in credit. First-time
advertisers only, one per account. The offer must be accepted within 30 days
of creating the account, and the $500 has to be *spent within 14 days* of
accepting; the credit then expires 90 days after that. So it is not $500 of
free advertising, it is $500 of real money on a two-week clock, buying $500
of credit on a three-month clock.

**Why not now.** Measured against the gate at the top of this file, five of
nine boxes are open, and the two that matter most are:

  · A stranger cannot yet be shown to complete a booking end to end and get
    an invoice. That is the one thing an ad has to work for.
  · A crawler sees two headings on the Destination Book, so anyone arriving
    without JavaScript lands on an empty shell.

And the site currently gives a visitor no way to reach a person: the phone is
a `XXX-XXXX` placeholder in both the schema block and the footer, and the
email was pulled because the domain has no MX records and mail to it bounces.
An ad campaign into that is paying to create demand with nowhere to put it.

**Why Reddit in particular is the wrong first channel here.** Reddit targets
by subreddit and interest, people reading, not people buying. An airport
transfer is bought in the moment somebody types "seatac airport car service",
and that demand lives in search and in the map pack. Section 2(a) and 2(b)
below are both free, both higher-intent, and both still unclaimed.

**The part that makes this easy.** The offer is for first-time advertisers,
one per account. Taking it now spends a one-time offer at the worst possible
moment. These promotions run more or less continuously, so the cost of
waiting is close to zero and the cost of going early is $500 plus the one
chance at the match.

Revisit when the gate is clear. Then the first spend is search, not social.

---

## 2. Channels, cheapest first

**a) Google Business Profile, free, unclaimed.**
Someone typing "airport transfer near me" at 5am is the highest-intent customer
this business will ever see. Being in the map pack costs nothing. Biggest
unclaimed win on the list.

**b) The Agent Program is already an ad channel, and the best kind.**
Hotels and travel agencies are distribution paid **only on results**. No upfront
spend, no attribution problem. Ten hotel partners beats a $500 ad budget, and
the program is already built.

**c) Local search ads, small, tight, after measurement.**
`seatac airport transfer`, `tesla rental rideshare seattle`. Tight geography,
tight keyword set, $10, 20/day. High intent and immediately measurable, but only
once (0) is in place.

**d) The free tools are the cheapest advertising, and they already exist.**
A road trip planner that genuinely answers "what's along the way" gets shared
and linked. This is why the SEO and AI-discoverability work matters more than an
ad budget right now: it compounds, ads do not.

---

## 3. Affiliate revenue, needs accounts, not code

The plumbing is a small job; the accounts are the blocker and only the owner can
open them.

- **Hotels**, Booking.com or Expedia affiliate, 4, 7% per stay. The 🏨 layer in
  the trip planner already finds and shows hotels; each one needs a
  "Check availability" link carrying an affiliate id.
- **Tickets**, GetYourGuide or Viator, 5, 8%. Same shape on attraction popups.

Build it with the affiliate id as a single config constant, so it goes live the
moment an account is approved.

---

## 4. The compounding asset

`place_ratings.json`, `visit_times.json`, `destination_comments.json`,
`travel_wishes.json`, OpenStreetMap has none of this. Nobody else knows people
actually spend 40 minutes at a given place, or how travellers rated it.

It is currently locked inside a JavaScript app, so search engines and AI
assistants cannot see any of it. **Server-rendering the destination pages, one
URL per city and per place, is what turns that data into traffic.** Every place
the community adds becomes a page that can rank; every rating makes it more
unique.

That is the flywheel. Ads only convert traffic that already exists.
