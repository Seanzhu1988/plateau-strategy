# -*- coding: utf-8 -*-
"""Endpoints that return a person's details must refuse a stranger.

Found in a privacy audit: several endpoints handed out customer or driver PII
to anyone who asked, some keyed only by a sequential id (RES_0001, RTR_0001,
...) that anyone can count up through. This locks the door and keeps it locked.

    python3 test_pii_gates.py
"""
import json
import os
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                            # noqa: E402

A.app.config["TESTING"] = True
tmp = tempfile.mkdtemp()
for a in ("RES_PATH", "RENTERS_PATH", "AGENTS_PATH", "WISHLIST_PATH",
          "OWNER_AUTH_PATH", "SIGNATURES_PATH", "CONTRACT_PATH"):
    if hasattr(A, a):
        setattr(A, a, os.path.join(tmp, a.lower() + ".json"))

SECRET = ["Carlos Secret", "206-555-9002", "lead-secret@x.com",
          "Jane Secret", "206-555-9001"]
json.dump([{"id": "RES_0001", "status": "NEW",
            "client": {"name": "Jane Secret", "phone": "206-555-9001",
                       "email": "jane@x.com"}}], open(A.RES_PATH, "w"))
json.dump([{"id": "RTR_0001", "name": "Carlos Secret", "phone": "206-555-9002"}],
          open(A.RENTERS_PATH, "w"))
json.dump([{"name": "Finance Lead", "email": "lead-secret@x.com",
            "phone": "206-555-9003"}], open(A.WISHLIST_PATH, "w"))

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


anon = A.app.test_client()

print("a stranger is refused, and no personal detail is in the reply:")
CASES = [
    ("GET", "/api/contract/roster", "every driver's name and phone"),
    ("GET", "/api/finance/wishlist", "every finance signup's contact"),
    ("POST", "/api/reservations/RES_0001/accept", "a reservation with customer PII"),
    ("POST", "/api/reservations/RES_0001/complete", "a reservation with customer PII"),
]
for method, ep, what in CASES:
    r = anon.open(ep, method=method, json={})
    body = r.get_data(as_text=True)
    chk("%s %s is refused (%d) [%s]" % (method, ep, r.status_code, what),
        r.status_code == 401)
    chk("  and no PII leaked in the refusal",
        not any(s in body for s in SECRET))

print("\nthe aggregate endpoints stay public — they carry no contact details:")
r = anon.get("/api/travel-wishes")
chk("travel-wishes is public (%d)" % r.status_code, r.status_code == 200)
chk("  and leaks no contact detail",
    not any(s in r.get_data(as_text=True) for s in SECRET))
r = anon.get("/api/traffic/summary")
chk("traffic summary is public (%d)" % r.status_code, r.status_code == 200)

print("\nthe owner still reaches the real lists:")
own = A.app.test_client()
own.post("/api/owner/setup", json={"username": "sean", "password": "pw123456"})
for ep in ("/api/contract/roster", "/api/finance/wishlist"):
    r = own.get(ep)
    chk("owner GET %s works (%d)" % (ep, r.status_code), r.status_code == 200)
chk("and the owner actually sees the data",
    "Carlos Secret" in own.get("/api/contract/roster").get_data(as_text=True))

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
