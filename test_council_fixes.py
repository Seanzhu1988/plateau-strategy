# -*- coding: utf-8 -*-
"""The five findings the council raised beyond the setup routes, each closed.

Written as one file because they were found together and share a shape: every
one of them was a door that looked locked. The credential was published beside
the lock, or the counter that makes a short secret survive did not exist, or
the caller was simply believed.

    python3 test_council_fixes.py
"""
import base64
import hashlib
import hmac
import os
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                              # noqa: E402
import bot_lab                                               # noqa: E402

tmp = tempfile.mkdtemp()
for name in ("RES_PATH", "RENTERS_PATH", "AGENTS_PATH", "OWNER_AUTH_PATH"):
    if hasattr(A, name):
        setattr(A, name, os.path.join(tmp, name.lower() + ".json"))
A.LAB = bot_lab.BotLab(os.path.join(tmp, "u.json"), os.path.join(tmp, "l.json"),
                       os.path.join(tmp, "k.json"))
A.app.config["TESTING"] = True
A._LOGIN_TRIES.clear()

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


# ---------------------------------------------------------------- finding 2
print("the open board no longer publishes an agent's sign-in code:")
board_row = A._reservation_for_board({
    "id": "R1", "pickup": "SEA",
    "client": {"name": "Jane Smith", "phone": "+12065550100", "email": "j@x.com"},
    "agent": {"id": "AGT_0001", "name": "Priya Raghavan", "code": "AGT-E469",
              "payout_email": "priya@x.com"},
})
chk("the agent's code is gone", "code" not in (board_row.get("agent") or {}))
chk("and their payout address with it",
    "payout_email" not in (board_row.get("agent") or {}))
chk("but the name stays — the board card renders 'Referred by'",
    (board_row.get("agent") or {}).get("name") == "Priya Raghavan")
chk("the customer is still redacted",
    "phone" not in board_row["client"] and "email" not in board_row["client"])
blob = str(board_row)
chk("no credential anywhere in the row (%s)" % ("clean" if "AGT-E469" not in blob else "LEAKED"),
    "AGT-E469" not in blob)

# ---------------------------------------------------------------- findings 3+5
print("\nguessing is now counted, on every sign-in:")
c = A.app.test_client()
A._LOGIN_TRIES.clear()
codes = [c.post("/api/renters/login",
                json={"vin": "1hgcm82633a004352", "dob": "0101%d" % (1970 + i)},
                headers={"X-Forwarded-For": "203.0.113.5"}).status_code
         for i in range(A.LOGIN_MAX_TRIES + 3)]
chk("the driver login stops answering (%d of %d attempts blocked)"
    % (codes.count(429), len(codes)), 429 in codes)
chk("and it lets a real number of tries through first",
    codes.count(429) <= 3 and len(codes) - codes.count(429) >= A.LOGIN_MAX_TRIES)

# One account, many guesses at its second factor — the per-account counter.
# (Many DIFFERENT codes from one address is a different attack and is caught
#  by the per-address counter, tested just below.)
A._LOGIN_TRIES.clear()
codes = [c.post("/api/agents/login", json={"code": "AGT-E469", "last_name": "guess%d" % i},
                headers={"X-Forwarded-For": "203.0.113.6"}).status_code
         for i in range(A.LOGIN_MAX_TRIES + 3)]
chk("the agent login stops answering too", 429 in codes)

A._LOGIN_TRIES.clear()
codes = [c.post("/api/owner/login", json={"username": "sean", "password": "wrong%d" % i},
                headers={"X-Forwarded-For": "203.0.113.7"}).status_code
         for i in range(A.LOGIN_MAX_TRIES + 3)]
chk("so does the owner login", 429 in codes)

print("\nspraying many accounts from one address is caught by the second counter:")
A._LOGIN_TRIES.clear()
codes = [c.post("/api/agents/login", json={"code": "SPRAY-%04d" % i, "last_name": "x"},
                headers={"X-Forwarded-For": "203.0.113.44"}).status_code
         for i in range(A.LOGIN_MAX_PER_IP + 4)]
chk("a run of unique codes from one address is cut off (%d blocked)" % codes.count(429),
    429 in codes)
chk("and the per-account limit alone would NOT have caught it",
    A.LOGIN_MAX_PER_IP > A.LOGIN_MAX_TRIES)

print("\nand a locked-out attacker does not lock out anyone else:")
A._LOGIN_TRIES.clear()
for i in range(A.LOGIN_MAX_TRIES + 2):
    c.post("/api/renters/login", json={"vin": "victimvin", "dob": "01011980"},
           headers={"X-Forwarded-For": "203.0.113.9"})
r = c.post("/api/renters/login", json={"vin": "victimvin", "dob": "01011980"},
           headers={"X-Forwarded-For": "198.51.100.4"})
chk("the same account from a different address is unaffected (%d)" % r.status_code,
    r.status_code != 429)
r = c.post("/api/renters/login", json={"vin": "othervin", "dob": "01011980"},
           headers={"X-Forwarded-For": "203.0.113.9"})
chk("and a different account from the blocked address is too (%d)" % r.status_code,
    r.status_code != 429)

# ---------------------------------------------------------------- finding 4
print("\nthe SMS webhook no longer believes whoever calls it:")
A._LOGIN_TRIES.clear()
os.environ.pop("TWILIO_AUTH_TOKEN", None)
r = c.post("/sms/reply", data={"From": "+12065550100", "Body": "YES"})
chk("unsigned, with no token configured, is refused (%d)" % r.status_code,
    r.status_code == 403)

os.environ["TWILIO_AUTH_TOKEN"] = "test-token-abc"
r = c.post("/sms/reply", data={"From": "+12065550100", "Body": "YES"})
chk("unsigned, with a token configured, is refused (%d)" % r.status_code,
    r.status_code == 403)
r = c.post("/sms/reply", data={"From": "+12065550100", "Body": "YES"},
           headers={"X-Twilio-Signature": "bm90LWEtcmVhbC1zaWc="})
chk("a wrong signature is refused (%d)" % r.status_code, r.status_code == 403)

with A.app.test_request_context("/sms/reply", method="POST",
                                data={"From": "+12065550100", "Body": "YES"}):
    url = A.request.url.replace("http://", "https://", 1)
    payload = url + "".join(k + A.request.form[k] for k in sorted(A.request.form))
good = base64.b64encode(hmac.new(b"test-token-abc", payload.encode(), hashlib.sha1).digest()).decode()
r = c.post("/sms/reply", data={"From": "+12065550100", "Body": "YES"},
           headers={"X-Twilio-Signature": good})
chk("a correctly signed request gets through (%d)" % r.status_code, r.status_code == 200)
os.environ.pop("TWILIO_AUTH_TOKEN", None)

# ---------------------------------------------------------------- finding 6
print("\nrevoking access now ends the session it was granted to:")
owner = A.app.test_client()
owner.post("/api/owner/setup", json={"username": "sean", "password": "hunter22"})
pw = owner.post("/api/access/users", json={"username": "reader1"}).get_json()["password"]
user = A.app.test_client()
A._LOGIN_TRIES.clear()
r = user.post("/api/access/login", json={"username": "reader1", "password": pw})
chk("they sign in (%d)" % r.status_code, r.status_code == 200)
key = A._share_key("robot")
user.get("/robot?k=" + key)
chk("and can read the page (%d)" % user.get("/robot").status_code,
    user.get("/robot").status_code == 200)
owner.post("/api/access/users/reader1/revoke", json={"revoked": True})
r = user.get("/robot")
chk("after revoking, the SAME session is shut out (%d)" % r.status_code,
    r.status_code == 401)

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
