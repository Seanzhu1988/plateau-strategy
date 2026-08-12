# Privacy: what is built, what is decided, and what needs a lawyer

Written 9 August 2026. Companion to `consent.py`, `privacy.html`,
`test_consent.py` and `test_privacy_routes.py`.

This exists because "we ask permission first" is an intention, and an
intention is not a control. Everything below is either enforced by code that
fails closed, or listed as an open question with a name on it.

---

## 1. Current state

| Thing | State |
|---|---|
| Privacy policy page (`/privacy`) | **Written, will not serve** until `PRIVACY_CONTACT` is set |
| Consent module (`consent.py`) | Built, tested |
| Consent routes (`/api/consent/*`) | **404 to everyone** until `LOCATION_CONSENT_ENABLED` is set |
| The "Add this place" button | **Not built.** No page calls any of it |
| Location collected today | **None.** The only location feature on the site is "Use my location" on the booking form, which fills the pickup field |

Nothing in this change collects anything from anyone. Deploying it changes
nothing a visitor can see.

---

## 2. The decision that shaped everything

The original idea was to record a customer's location **at login** as a newly
discovered city. That was rejected, and the reasons are worth keeping because
they will come up again.

**It would not have worked.** A location at login is derived either from the
IP address, which gives the carrier's regional hub, the VPN exit, or Apple
Private Relay, so the map fills with datacentres, or from the browser
geolocation API, which requires a permission prompt. A prompt at login, when
the person is trying to do something else, gets refused, and browsers remember
a refusal per site. That refusal would also have killed the "Use my location"
button on the booking form, which is a feature that works.

**Even accurate, it would have been the wrong place.** Where somebody is when
they sign in is their home or their desk. That is the most sensitive location a
person has and the least useful one for a map of places worth visiting.

**Consent does not fix a bad idea.** Asking permission properly and then
collecting a home address is still collecting a home address.

So the ask moves to the moment of contribution, when somebody is somewhere
worth adding and wants to add it, and what gets stored is the city, not the
person.

---

## 3. What the code will not let us do

These are not policies. They are properties of the code, each with a test.

1. **No coordinate can be stored.** `record_place()` has no parameter for one.
   The endpoint runs `looks_like_coordinate()` over the entire request body
   first and refuses anything shaped like a fix on the ground, by key name, by
   value pattern, at any nesting depth, including a bare float. It refuses
   rather than silently dropping, so a caller cannot come to believe we accept
   coordinates.

2. **Nothing is consent but `True`.** Not `1`, not `"yes"`, not a non-empty
   string. Those are what a pre-ticked box and a sloppy JSON body produce, and
   each would pass `if granted:`.

3. **The purpose is a closed set.** An unrecognised purpose is refused. There
   is no "other", and there is deliberately no purpose called "research", see
   §5.

4. **The wording is pinned.** Every consent row stores the version and a
   SHA-256 of the exact text shown. Consent to superseded wording is not live
   consent; the person is asked again rather than migrated.

5. **Withdrawal deletes.** It does not set a flag. The contributions are
   removed, the key linking the two files is destroyed, and the ledger row
   survives as proof that consent existed and was honoured.

6. **Retention runs on use, not on a promise.** Contributions older than 400
   days are deleted whenever the endpoint is touched.

7. **Selling is not a setting.** `SALE = False` and `SHARING = False` are
   constants, not environment variables. Turning either on is a diff with an
   author.

8. **`coarsen()` clears the statutory line at every latitude.** If a coordinate
   ever legitimately has to be handled server-side, this is the only sanctioned
   road. It snaps to a cell ~11 km across, about 21× coarser than the 1,750
   ft that Washington treats as "precise". The longitude step is widened by
   1/cos(latitude), because a fixed grid in degrees is not a fixed distance:
   0.1° of longitude at 89°N is under 200 m, which would be *inside* the line
   it exists to clear. The test measures the resolution rather than asserting
   it.

---

## 4. Why the subject is a browser token, not a customer id

Consents are keyed to a random token in the session, minted on first grant.
Never the customer id.

- A client-supplied identity is a client-supplied identity: if withdrawal or
  export keyed on it, anyone could erase or read anyone else's.
- Tying contributions to an account would create precisely the record this
  design avoids, named person plus places. Unlinked, `place_contributions.json`
  is a list of city names that identifies nobody.

**The cost, stated plainly:** clearing cookies means that browser can no longer
withdraw what it added. What it added is "somebody once said Tacoma", so this
is the right side of the trade, but it belongs on the page, not buried here.

---

## 5. Why the wording is not "for research"

The original phrasing was "we collect location for research, would you like to
share". Three problems:

- **Not specific enough to be valid consent.** Consent runs to a stated
  purpose; "research" is a category. Consent that broad tends not to count,
  which means paying the cost of asking without gaining the protection.
- **It is the word data brokers use**, and people have learned what it means.
- **It is not true.** We want to add cities to a map. That is a better sentence
  and an honest one.

The text now in `consent.py` says what happens and what does not:

> Add this place to the map?
> We save the name of the city you are in, not your exact location, not your
> address, and not your name.
> Saying no changes nothing about your booking or your account, and you can
> undo this later.

---

## 6. Why `/privacy` refuses to serve without a contact

A policy that grants the right to ask for your data, and gives no working
address to ask at, documents an obligation and then fails it. That is worse
than having no policy.

`plateaustrategy.io` has no MX records today, so `hello@` bounces. Sean's
personal address is not going up without his say-so.

**To publish: set `PRIVACY_CONTACT` in Render to a working address.** Then add
the footer link (§8).

---

## 7. Questions for the attorney

Privacy counsel, ideally Washington-admitted. The professionals directory
already lists the role (`privacy-counsel`).

1. **Is `/privacy` accurate and sufficient** for a Washington sole proprietor
   doing rides, rentals and free travel tools? Every sentence describes code
   that exists today.

2. **Does the My Health My Data Act apply to us at all,** and is the "we
   collect none" notice the right form? Specifically: pickup and drop-off
   addresses are precise locations, volunteered, used only to drive the person.
   Does that reach the definition of consumer health data if someone is
   collected from a medical building? Our position is no, we do not analyse,
   categorise or infer from the address, but the private right of action makes
   this worth an answer rather than a view.

3. **Does the homepage link satisfy the "prominently published" requirement,**
   and does the CHD notice need to be a separate page rather than a section?

4. **Is the browser-token consent model defensible** given it means a person
   who clears cookies cannot exercise withdrawal? Is a stated, understood
   limitation acceptable, or must consent be tied to an identifiable account?

5. **Is the 400-day retention defensible** for city-level contributions, and is
   the 1,750 ft / 11 km margin the right place to draw the coarsening line?

6. **The signature records store IP and user-agent.** They are kept as evidence
   of signing. Is that documented correctly, and is the retention right?

7. **OpenStreetMap is called by the visitor's browser**, so OSM receives their
   IP and search terms without it passing through our server. We disclose this.
   Is disclosure enough, or does it need consent?

8. **Do we need a Data Processing Agreement** with Square and Twilio, and does
   either arrangement make us a "seller" or "sharer" under any state law?

---

## 8. To switch things on

| Step | Action |
|---|---|
| Publish the policy | Set `PRIVACY_CONTACT` in Render to a working address |
| Link it | Add `<li><a href="/privacy">Privacy</a></li>` to the Company column of the footer in `landing-page.html`, and a link from the homepage for the MHMDA "prominently published" requirement |
| Enable the map consent | Set `LOCATION_CONSENT_ENABLED=1`, **after** counsel answers §7 |
| Build the button | Not built. `/api/consent/text` supplies the exact wording to render; the page must show that text and post that version back |

---

## 9. Separate finding, not part of this work

**Customer and owner passwords use a single round of SHA-256** (`app.py:196`),
while the bot lab uses PBKDF2 at 200,000 rounds. A single round falls to a GPU
at billions of guesses per second.

This is not urgent for the consent work, contributions are unlinked from
accounts by design, which is part of why they are. It matters for
`customers.json`, which holds names, emails and phone numbers today.

The fix is a standard transparent migration: verify against the old hash, then
re-hash with PBKDF2 on the next successful sign-in, so nobody is locked out and
the weak hashes drain away as people return. Not done here because changing
authentication is not the same change as adding a consent layer, and it should
land where it can be reviewed on its own.

---

## 10. Footprints, the one coordinate store, and why it is not visitor data

Added 2026-08-10. `footprints.py` holds recorded walks of **our own named
corridors**, terminal door to platform, that kind of thing, used to verify
and later guide the journey walkthroughs. It is the only store of
**metre-level GPS traces** on the site. (Stated precisely because a document
for counsel must not overclaim: the traffic system's `geo_cache.json` holds
**city-level** centroids, lat/lon rounded to two decimals, ~1 km, derived
from IP geolocation for the aggregate viewers-by-city table, and traffic day
records carry the same coarse place coordinates. Those cannot describe a
walk or a person's position; these traces can, which is why the fence below
exists.) The fence, for counsel:

- The submitting endpoint is **owner-authenticated**. No visitor can reach it.
- The corridors are a **closed list in code**. A walk for a corridor we did
  not deliberately open is refused, so the store cannot become anyone's
  movement diary, there is nowhere to file a movement that is not one of our
  own walkways.
- A stored walk carries **no identity and no clock**, a date and a duration,
  never a timestamp. "The corridor takes nine minutes" is a map; "someone was
  at the door at 23:41" is surveillance, and the field does not exist.
- Traces expire from use after 180 days and each corridor keeps at most 20.

Our position: this is the business surveying its own ground, equivalent to
photographing a hallway; no consumer data is collected. Counsel should
confirm nothing in MHMDA or RCW 19.373 reads a business's own surveyor traces
as consumer health or location data.

### Added to the attorney list, 2026-08-10 (footprints for data collection)

9. **Visitor-contributed corridor walks, parked until answered.** The current
   design accepts GPS traces only from the owner and owner-issued surveyor
   accounts. The proposed extension, a traveller deliberately contributing a
   walk of a named public corridor, "add this corridor" like "add this place"
  , would be consumer **precise location** under MHMDA even though the
   corridor is public and the act deliberate. What consent framework, if any,
   makes that lawful, and does bounding acceptance to registered public
   corridors (refusing anything outside them) change the analysis? Until
   answered, no visitor path to the footprint store exists, and consent.py
   continues to refuse coordinates from visitors everywhere.

   For the record, the passive version, the walking guide reporting
   travellers' movements back to the server, is a **never**, not a question.
   The policy sentence "we do not record visitors' movements" is load-bearing.
