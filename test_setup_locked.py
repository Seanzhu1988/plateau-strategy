# -*- coding: utf-8 -*-
"""Nobody but the owner may touch the integration settings.

Found by a nine-lens council on 2026-08-08, three lenses independently, and
verified by execution rather than by reading: a client with no cookies and no
session POSTed to /api/setup/square and got 200, after which the running
process held the caller's token.

What was reachable by anyone on the internet:

  * repoint SMS at a stranger's Twilio account, and because notify reads
    os.environ on every call and the service runs --workers 1, one POST
    poisons the whole process. Ride offers carry pickup address, dropoff,
    date, time, flight number and fare.
  * send SMS to a number the CALLER chose, on our live credentials, with no
    throttle. Toll fraud billed to us, and a fast way to get the Twilio
    account suspended, which takes driver dispatch down with it.
  * overwrite the Square token, which does not redirect money but does stop
    invoices silently while bookings appear to keep working.

The last assertion here is the one that matters most. Naming five routes would
pass forever while a sixth was added without a decorator, which is exactly
how these five came to exist beside forty-eight that were gated correctly. So
it asks the app for every /api/setup route it has and fails if ANY of them
answers a stranger.

    python3 test_setup_locked.py
"""
import os
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                              # noqa: E402

tmp = tempfile.mkdtemp()
A.OWNER_AUTH_PATH = os.path.join(tmp, "owner_auth.json")
A.app.config["TESTING"] = True

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


stranger = A.app.test_client()

print("a stranger cannot reach the settings at all:")
r = stranger.get("/setup")
chk("the page itself is refused (%d)" % r.status_code, r.status_code in (401, 403, 404))
r = stranger.get("/api/setup/status")
chk("nor can they read what is connected (%d)" % r.status_code, r.status_code in (401, 403, 404))

print("\nand cannot take over the integrations:")
r = stranger.post("/api/setup/square", json={"access_token": "sq0atp-ATTACKER"})
chk("Square token cannot be overwritten (%d)" % r.status_code, r.status_code in (401, 403, 404))
chk("and nothing was written to the environment",
    os.environ.get("SQUARE_ACCESS_TOKEN") != "sq0atp-ATTACKER")

r = stranger.post("/api/setup/twilio", json={"account_sid": "ACdead", "auth_token": "x",
                                             "from_number": "+15005550006"})
chk("SMS cannot be repointed (%d)" % r.status_code, r.status_code in (401, 403, 404))
chk("and the credentials did not take",
    os.environ.get("TWILIO_ACCOUNT_SID") != "ACdead")

r = stranger.post("/api/setup/twilio/test", json={"to": "+15551234567"})
chk("no SMS can be sent to a number of their choosing (%d)" % r.status_code,
    r.status_code in (401, 403, 404))

print("\nthe owner can still do the job:")
owner = A.app.test_client()
owner.post("/api/owner/setup", json={"username": "sean", "password": "hunter22"})
r = owner.get("/api/setup/status")
chk("status reads for the owner (%d)" % r.status_code, r.status_code == 200)
r = owner.get("/setup")
chk("and the page opens (%d)" % r.status_code, r.status_code == 200)

print("\neven signed in, the test message goes to OUR number and no other:")
sent = {}
_real = A.notify.send_sms
A.notify.send_sms = lambda to, body: sent.setdefault("to", to) or "sent"
try:
    os.environ["OWNER_PHONE"] = "+12065550111"
    r = owner.post("/api/setup/twilio/test", json={"to": "+15559999999"})
    chk("the number the caller asked for is ignored (%s)" % sent.get("to"),
        sent.get("to") == "+12065550111")
finally:
    A.notify.send_sms = _real
    os.environ.pop("OWNER_PHONE", None)

print("\nand no /api/setup route anywhere answers a stranger:")
open_routes = []
for rule in A.app.url_map.iter_rules():
    path = str(rule)
    if not path.startswith("/api/setup"):
        continue
    for method in ("GET", "POST"):
        if method not in rule.methods:
            continue
        got = stranger.open(path, method=method, json={})
        if got.status_code not in (401, 403, 404, 405):
            open_routes.append("%s %s -> %d" % (method, path, got.status_code))
chk("every /api/setup route refuses (%s)" % (open_routes or "all of them"), not open_routes)

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
