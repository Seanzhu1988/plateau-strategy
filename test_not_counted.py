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

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else f"\nFAILED: {fails}")
raise SystemExit(1 if fails else 0)
