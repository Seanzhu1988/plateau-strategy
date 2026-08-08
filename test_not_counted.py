"""Our own devices must not appear in the traveler numbers.

The numbers that matter most are the smallest: a handful of self-visits is
invisible in a thousand and decisive in twenty.
"""
import os, sys, json, tempfile, shutil

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A

tmp = tempfile.mkdtemp()
A.TRAFFIC_PATH = os.path.join(tmp, "traffic.json")
A.OWNER_AUTH_PATH = os.path.join(tmp, "owner_auth.json")
A.app.config["TESTING"] = True

fails = []
def chk(label, cond):
    print(f"  {'OK  ' if cond else 'FAIL'} {label}")
    if not cond: fails.append(label)

PHONE = ("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 "
         "(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")

def counted_today():
    try:
        d = json.load(open(A.TRAFFIC_PATH))
    except Exception:
        return 0, 0
    if not d.get("days"):
        return 0, 0
    rec = d["days"][sorted(d["days"])[-1]]
    return rec.get("pageviews", 0), len(rec.get("visitor_ids", []))


print("a real traveler is counted:")
t = A.app.test_client()
t.get("/", headers={"User-Agent": PHONE})
pv, uv = counted_today()
chk(f"the visit registers ({pv} views, {uv} visitor)", pv == 1 and uv == 1)


print("\nthe phone, after opening /not-a-traveler once:")
phone = A.app.test_client()
before_optout = counted_today()
r = phone.get("/not-a-traveler", headers={"User-Agent": PHONE})
chk(f"the opt-out page does not itself count {before_optout} -> {counted_today()}",
    counted_today() == before_optout)
chk(f"the page renders as a page, not JSON ({r.status_code}, {r.mimetype})",
    r.status_code == 200 and r.mimetype == "text/html")
body = r.get_data(as_text=True)
chk("it says plainly that this device is not counted",
    "not counted" in body)
chk("it offers the way back", "count=1" in body)
chk("search engines are told to skip it", 'name="robots"' in body)

before = counted_today()
for _ in range(5):
    phone.get("/", headers={"User-Agent": PHONE})
    phone.get("/trip-planner", headers={"User-Agent": PHONE})
chk(f"10 further page opens change nothing {before} -> {counted_today()}",
    counted_today() == before)

print("\nand it survives, because that is the whole point:")
chk("the flag is a long-lived cookie, not a session",
    any(c.key == A.TRAFFIC_OPTOUT_COOKIE and c.expires for c in phone._cookies.values())
    if hasattr(phone, "_cookies") else True)
# a brand-new client with only that cookie is still ignored
fresh = A.app.test_client()
fresh.set_cookie(A.TRAFFIC_OPTOUT_COOKIE, "1")
before = counted_today()
fresh.get("/", headers={"User-Agent": PHONE})
chk("a fresh browser carrying the flag is ignored", counted_today() == before)


print("\nthe computer, just by signing in as the owner:")
comp = A.app.test_client()
r = comp.post("/api/owner/setup", json={"username": "sean", "password": "hunter22"})
chk(f"owner account created ({r.status_code})", r.status_code == 200)
before = counted_today()
for _ in range(4):
    comp.get("/", headers={"User-Agent": PHONE})
chk(f"the computer stopped counting without being asked {before} -> {counted_today()}",
    counted_today() == before)

# and it keeps holding after the session is gone — the reason it's a cookie
comp.post("/api/owner/logout")
before = counted_today()
comp.get("/", headers={"User-Agent": PHONE})
comp.get("/book", headers={"User-Agent": PHONE})
chk("still uncounted after logging out", counted_today() == before)

# logging in again on a device that had been counting
comp2 = A.app.test_client()
comp2.get("/", headers={"User-Agent": PHONE})          # counted first
mid = counted_today()
comp2.post("/api/owner/login", json={"username": "sean", "password": "hunter22"})
comp2.get("/", headers={"User-Agent": PHONE})
chk(f"login stops it counting from then on {mid} -> {counted_today()}",
    counted_today()[0] == mid[0])


# The cookie is the primary mechanism and the session is the backstop, so
# prove the backstop alone works: a browser signed in as owner whose opt-out
# cookie has been swept (privacy extensions do exactly this — psx_not_counted
# looks like a tracker) must still not count.
print("\nowner signed in, but the opt-out cookie wiped:")
swept = A.app.test_client()
swept.post("/api/owner/login", json={"username": "sean", "password": "hunter22"})
swept.delete_cookie(A.TRAFFIC_OPTOUT_COOKIE)
chk("the cookie really is gone",
    A.TRAFFIC_OPTOUT_COOKIE not in [c.key for c in swept._cookies.values()]
    if hasattr(swept, "_cookies") else True)
before = counted_today()
for _ in range(3):
    swept.get("/", headers={"User-Agent": PHONE})
chk(f"still not counted, on the session alone {before} -> {counted_today()}",
    counted_today() == before)

print("\nturning it back on works:")
back = A.app.test_client()
back.get("/not-a-traveler", headers={"User-Agent": PHONE})       # off
before = counted_today()
back.get("/", headers={"User-Agent": PHONE})
chk("confirmed off", counted_today() == before)
r = back.get("/not-a-traveler?count=1", headers={"User-Agent": PHONE})
chk("the page now says it is being counted", "is being counted" in r.get_data(as_text=True))
before = counted_today()
back.get("/", headers={"User-Agent": PHONE})
chk(f"and it counts again {before} -> {counted_today()}",
    counted_today()[0] == before[0] + 1)

print("\nbots were already ignored, and still are:")
bot = A.app.test_client()
before = counted_today()
bot.get("/", headers={"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)"})
chk("a crawler is not a traveler", counted_today() == before)


# ---- and the same must hold for CONVERSIONS ------------------------------
#
# It did not. record_conversion() checked none of the exclusions above, so a
# device excluded from pageviews still added a booking. The live file showed
# exactly that: a day reading 0 pageviews and 1 booking, and an earlier day
# with 17 bookings against 59 visitors.
#
# This is the more damaging half. A pageview that should not be there inflates
# a number nobody acts on; a booking that should not be there is the number the
# whole site is judged by.
print("\nand a conversion follows the same rules as a view:")

def conversions_today():
    try:
        d = json.load(open(A.TRAFFIC_PATH))
    except Exception:
        return {}
    if not d.get("days"):
        return {}
    return d["days"][sorted(d["days"])[-1]].get("conversions", {})

def booking_count():
    return sum(conversions_today().get("booking", {}).values())

with A.app.test_request_context("/", headers={"User-Agent": PHONE}):
    before = booking_count()
    A.record_conversion("booking")
    chk(f"a real traveler's booking is counted ({before} -> {booking_count()})",
        booking_count() == before + 1)

with A.app.test_request_context("/", headers={"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)"}):
    before = booking_count()
    A.record_conversion("booking")
    chk(f"a crawler's booking is not ({before} -> {booking_count()})",
        booking_count() == before)

with A.app.test_request_context(
        "/", headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/141.0 Safari/537.36"}):
    before = booking_count()
    A.record_conversion("booking")
    chk(f"a headless test browser's booking is not ({before} -> {booking_count()})",
        booking_count() == before)

with A.app.test_request_context("/", headers={"User-Agent": PHONE},
                                environ_base={"HTTP_COOKIE": A.TRAFFIC_OPTOUT_COOKIE + "=1"}):
    before = booking_count()
    A.record_conversion("booking")
    chk(f"an opted-out device's booking is not ({before} -> {booking_count()})",
        booking_count() == before)

# ---- the deadlock, which took the whole site down ------------------------
#
# _track_traffic held _LOCK and, inside it, called _geo_lookup — which takes
# the same lock to write its cache. threading.Lock is not reentrant, so the
# second acquire never returned. Every visitor whose city was not already in
# memory hung forever, and gunicorn runs one worker with eight threads, so
# eight of them stopped the site answering at all.
#
# It is timed rather than inspected because the shape of the fix may change;
# what must not change is that a page load finishes.
print("\ncounting a visitor never blocks the page:")
import threading as _th

A._GEO_MEM.clear()
done = []

def _one():
    c = A.app.test_client()
    c.get("/", headers={"User-Agent": PHONE, "X-Forwarded-For": "203.0.113.44"})
    done.append(True)

t = _th.Thread(target=_one, daemon=True)
t.start()
t.join(timeout=20)
chk("a page request with a cold geo cache returns at all", bool(done))

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else f"\nFAILED: {fails}")
raise SystemExit(1 if fails else 0)
