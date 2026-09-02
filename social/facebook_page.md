# The Facebook Page, ready to paste

[SEAN 2026-08-31: "i just share with you the facebook page" then "can you try
to build as much as possible in that page, its merging i think".]

The Page was mid-merge, so this is everything that could be built without
touching it. Paste each field; nothing here needs to be written from scratch.

Every fact below is taken from the live site, not invented. Prices, durations,
piers and the licence are what tours.html already says in public.

## First, when the merge finishes

A Facebook merge keeps ONE Page and folds the other's likes and followers into
it. Posts, photos and reviews on the absorbed Page are generally NOT carried
across, and the merge cannot be undone. So before anything else:

- Check which Page survived, and that its **name** and **username** are the
  ones you want. The username is the address people type.
- Check the follower count went up rather than sideways.
- If reviews or photos you cared about were on the absorbed Page, they are
  probably gone. Look before you assume they moved.

## The fields

**Page name** (29/75)

    Plateau Strategy Solution Lab

**Username** (15/50). This becomes facebook.com/plateaustrategy

    plateaustrategy

**Category.** Primary: Tour Agency. Secondary: Airport Shuttle Service.
Both are real: you sell licensed walking tours and flat-rate transfers.

**Tagline / bio** (76/101)

    Licensed Seattle guide. Walking tours and flat-rate Tesla airport transfers.

**Short description, English** (223/255). This is what shows in
search results and when someone hovers the Page name.

    Washington-licensed guide. Small-group and private walking tours of Seattle, built around your ship's all-aboard time. Departures from Pier 66 and Pier 91. Flat-rate Tesla airport transfers, $75 to SeaTac, no surge pricing.

**Short description, Chinese** (75/255). Written in Chinese, not
translated from the English.

    华盛顿州持照导游。西雅图小团与私人步行导览，按你邮轮的归船时间倒推安排路线，66号与91号码头出发。特斯拉机场接送固定价，到西塔机场75美元，不加价。

**Action button:** Book Now, pointing at
https://plateaustrategy.io/tours?utm_source=facebook

## Our Story

    I am a Washington-licensed tour guide and a registered Seattle LLC, and I
    walk this city for a living.

    Most of my work starts at a cruise terminal. If you are off a ship you
    have one afternoon and a hard deadline, so I plan every route backwards
    from your all-aboard time rather than forwards from the start. You get
    back to the gangway with at least an hour to spare. That is the whole
    promise, and it is why the tours are shaped the way they are.

    Groups stay small. Never a crowd of forty behind a raised umbrella.

    I also drive flat-rate airport transfers, $75 to SeaTac, any hour, no
    surge pricing. If you have an early flight after a late tour, it is the
    same person on both ends.

    The site carries free tools I built because visitors kept asking for them:
    a trip planner, a destination book, and a gallery search that finds any
    artwork from the number printed on its label.

## Services, with the real numbers

| Service | Price | Duration | Notes |
|---|---|---|---|
| Cruise Terminal Walking Tour | $75 / person | 2.5 hours | Starts Pier 66 or Pier 91, 2 people minimum |
| Downtown Seattle and Pike Place Half-Day | $89 / person | 3 hours | Starts Pike Place Market, 2 people minimum |
| Private Group Walking Tour | $395 flat | 3 hours | Up to 6 people, route built with you |
| Airport transfer to SeaTac | $75 flat | | Any hour, no surge pricing |

## The first week of posts

Nothing needs writing. `social/posts.json` already holds 26 posts, 6 of them
written for Facebook, and `social_pack.py` rotates them weekly with a
per-channel `utm_source` so the Archive can score the channel on bookings
rather than likes. Run it and paste:

    python3 social_pack.py

Post the tours one every week. It is the money and the season is short.

## What is still needed from you

- The Page URL or username once the merge settles, so the links can be
  checked and the profile link set.
- For autoposting later: a Meta developer app and an Instagram business
  account linked to the Page. Those produce tokens. **Do not paste a token
  into chat.** It goes in `.env`, which I never read.
