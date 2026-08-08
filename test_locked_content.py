# -*- coding: utf-8 -*-
"""A lock that the reader's browser can undo is not a lock.

This is the whole test. Everything else about paid content — the price, the
teaser, who gets the money — is a business decision that can change. The one
thing that cannot be got wrong is that a reader who has not paid never
RECEIVES the text, because every other kind of lock is theatre:

  * hidden with CSS — the text is already on their machine
  * cut by JavaScript after render — same, and View Source shows it
  * omitted by the page but present in the JSON — Network tab shows it

So these assertions read the raw bytes of the API response and check the
protected sentence is not in them anywhere. Not "the page does not show it";
not "the field is absent" — the string does not leave the server.

    python3 test_locked_content.py
"""
import json
import os
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                              # noqa: E402

tmp = tempfile.mkdtemp()
A.ARTICLES_PATH = os.path.join(tmp, "articles.json")
A.OWNER_AUTH_PATH = os.path.join(tmp, "owner_auth.json")
A.app.config["TESTING"] = True

SECRET = "Form the LLC in Washington before you take a dollar from anyone."
TEASER = "Two things decide whether this idea is legal to run. The first is free:"

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


reader = A.app.test_client()
r = reader.post("/api/articles", json={"author": "An Attorney", "title": "Legal read: EV rental fleet",
                                       "body": SECRET},
                headers={"X-Forwarded-For": "203.0.113.9"})
aid = r.get_json()["article"]["id"]

owner = A.app.test_client()
owner.post("/api/owner/setup", json={"username": "sean", "password": "hunter22"})

print("before it is locked, it reads as normal:")
raw = reader.get("/api/articles").get_data(as_text=True)
chk("the body is served", SECRET in raw)

print("\nonce locked, the text does not leave the server:")
r = owner.post("/api/articles/%s/lock" % aid,
               json={"price_usd": 75, "teaser": TEASER, "by": "Jane Roe, WSBA #00000"})
chk("the owner can put a price on it (%d)" % r.status_code, r.status_code == 200)

raw = reader.get("/api/articles").get_data(as_text=True)
chk("THE PROTECTED SENTENCE IS ABSENT FROM THE RAW RESPONSE", SECRET not in raw)
a = json.loads(raw)["articles"][0]
chk("it is marked locked", a.get("locked") is True)
chk("the price is shown so the offer is legible", a.get("price_usd") == 75)
chk("the teaser stands in for the body", TEASER in (a.get("body") or ""))
chk("the attorney is credited", "WSBA" in (a.get("locked_by") or ""))

print("\na reader cannot let themselves in:")
r = reader.post("/api/articles/%s/grant" % aid, json={"vid": "self-service"})
chk("granting is refused without the owner (%d)" % r.status_code, r.status_code == 401)
r = reader.post("/api/articles/%s/lock" % aid, json={"unlock_forever": True})
chk("so is removing the lock (%d)" % r.status_code, r.status_code == 401)
chk("and the text is still not served", SECRET not in reader.get("/api/articles").get_data(as_text=True))

print("\na price is required, and so is something to read for free:")
r = owner.post("/api/articles/%s/lock" % aid, json={"teaser": "x"})
chk("no price is refused (%d)" % r.status_code, r.status_code == 400)
r = owner.post("/api/articles/%s/lock" % aid, json={"price_usd": 0, "teaser": "x"})
chk("a zero price is refused (%d)" % r.status_code, r.status_code == 400)
r = owner.post("/api/articles/%s/lock" % aid, json={"price_usd": 75})
chk("a lock with no teaser is refused (%d)" % r.status_code, r.status_code == 400)

print("\nafter the reader is granted access, they get the text:")
buyer = A.app.test_client()
buyer.set_cookie("psx_vid", "buyer-abc")
chk("and not before", SECRET not in buyer.get("/api/articles").get_data(as_text=True))
r = owner.post("/api/articles/%s/grant" % aid, json={"vid": "buyer-abc"})
chk("the owner grants it (%d)" % r.status_code, r.status_code == 200)
chk("the buyer now receives the body", SECRET in buyer.get("/api/articles").get_data(as_text=True))

print("\nand it is one reader at a time, not a hole for everyone:")
chk("a different reader still sees only the teaser",
    SECRET not in reader.get("/api/articles").get_data(as_text=True))

print("\nthe lock is general, not attorney-specific:")
r = reader.post("/api/articles", json={"author": "Someone", "title": "A paid research note",
                                       "body": SECRET},
                headers={"X-Forwarded-For": "198.51.100.5"})
bid = r.get_json()["article"]["id"]
owner.post("/api/articles/%s/lock" % bid, json={"price_usd": 12, "teaser": "The first half is free:"})
chk("any piece can carry a price, with nothing legal about it",
    SECRET not in reader.get("/api/articles").get_data(as_text=True))

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
