# -*- coding: utf-8 -*-
"""The blueprint deck sells access to a document, and only that.

Pay to view is a product sale: the reader unlocks a blueprint and reads it, no
stake and no return. This proves the parts that must hold: the file never
reaches anyone who has not been granted access, no money is taken unless Square
is connected, access is granted only by the owner (the step a settled payment
triggers), and a caller cannot name a file outside the app.

    python3 test_deck.py
"""
import os
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
for _k in ("SQUARE_ACCESS_TOKEN", "SQUARE_LOCATION_ID"):
    os.environ.pop(_k, None)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                                # noqa: E402

tmp = tempfile.mkdtemp()
A.DECK_PATH = os.path.join(tmp, "deck.json")
shutil.copy(os.path.join(os.path.dirname(os.path.abspath(__file__)), "deck.json"),
            A.DECK_PATH)                                       # seed with the Met item
A.app.config["TESTING"] = True

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


c = A.app.test_client()

print("a stranger sees a locked deck:")
d = c.get("/api/deck").get_json()
chk("the seeded blueprint is listed and locked",
    d["ok"] and d["items"] and d["items"][0]["locked"] and d["items"][0]["id"] == "BP_0001")
chk("payments off and not owner", d["payments_live"] is False and d["owner"] is False)
chk("a locked item ships no view url", "view_url" not in d["items"][0])

print("the paywall is real, not cosmetic:")
v = c.get("/deck/BP_0001/view")
chk("the blueprint file is withheld, redirect to the deck (302)",
    v.status_code == 302 and "/deck" in v.headers.get("Location", ""))

print("no money moves without a payment rail:")
r = c.post("/api/deck/BP_0001/checkout", json={"name": "A Reader", "email": "a@b.com"})
chk("checkout refuses with no Square connected (503)",
    r.status_code == 503 and r.get_json().get("reason") == "no_payments")

print("only the owner grants, and only the owner sees who waits:")
with c.session_transaction() as s:
    s["owner"] = "tester"
do = c.get("/api/deck").get_json()
chk("owner sees owner detail (file, pending)",
    do["owner"] and "file" in do["items"][0] and "pending" in do["items"][0])
g = c.post("/api/deck/BP_0001/grant", json={"vid": "vid_test"}).get_json()
chk("owner grants one reader", g.get("ok") and g.get("readers") == 1)
up = c.post("/api/deck", json={"title": "Second sheet", "teaser": "A teaser",
                               "file": "met-blueprint.html", "price_usd": 12}).get_json()
chk("owner adds a blueprint", up.get("ok") and up.get("id"))
rp = c.post("/api/deck", json={"id": "BP_0001", "title": "The Metropolitan Museum, an indoor guide blueprint",
                               "teaser": "t", "file": "met-blueprint.html", "price_usd": 15}).get_json()
chk("owner re-prices an existing blueprint", rp.get("ok"))

print("a caller cannot name a file outside the app:")
bad = c.post("/api/deck", json={"title": "x", "teaser": "y", "file": "../secret.html", "price_usd": 5})
chk("path traversal is refused (400)", bad.status_code == 400)

print("a granted reader, and only a granted reader, can read it:")
c2 = A.app.test_client()
c2.set_cookie("psx_vid", "vid_test")
v2 = c2.get("/deck/BP_0001/view")
chk("the granted reader receives the blueprint (200)",
    v2.status_code == 200 and b"Metropolitan" in v2.data)
d2 = c2.get("/api/deck").get_json()
chk("and sees it unlocked with a view url",
    d2["items"][0]["locked"] is False and d2["items"][0].get("view_url"))

print()
if fails:
    print("FAILED: %d" % len(fails))
    sys.exit(1)
print("all good")
