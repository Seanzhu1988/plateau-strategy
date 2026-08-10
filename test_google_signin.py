"""Google sign-in on the booking form: optional, and impossible to forge.

The whole security of this feature is that the token is checked on the server
against Google's signing keys. A browser can claim to be anyone; these tests
make sure claiming is not enough.
"""
import os, sys, json, importlib
from unittest import mock

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A

fails = []
def chk(label, cond):
    print(f"  {'OK  ' if cond else 'FAIL'} {label}")
    if not cond: fails.append(label)

c = A.app.test_client()
A.app.config["TESTING"] = True

# ---------------------------------------------------------------- feature off
print("with no client id configured (today's live state):")
A.GOOGLE_CLIENT_ID = ""
cfg = c.get("/api/auth/google/config").get_json()
chk("config says disabled", cfg["enabled"] is False)
chk("no client id is published", not cfg["client_id"])
r = c.post("/api/auth/google", json={"credential": "anything"})
chk(f"the endpoint refuses rather than half-working ({r.status_code})", r.status_code == 503)

FORMS = ["/book", "/renter", "/agent"]
for _p in FORMS:
    _page = c.get(_p).get_data(as_text=True)
    chk(f"{_p}: the button markup is hidden by default", 'id="gsiBox" hidden' in _page)
    chk(f"{_p}: it loads the shared implementation", 'src="/google-signin.js"' in _page)
    # The reason the shared file exists. Three copies of a routine whose whole
    # security is "never decode the credential here" is three chances to get it
    # wrong, and the next person fixing a bug in it would fix one of them.
    chk(f"{_p}: and carries no inline copy of it",
        "accounts.google.com/gsi/client" not in _page)

js = c.get("/google-signin.js")
chk(f"the shared file is served ({js.status_code})", js.status_code == 200)
js = js.get_data(as_text=True)
chk("nothing is loaded from Google unless configured",
    "accounts.google.com/gsi/client" in js and "cfg.enabled" in js)
# The client-side half of the security. Everything else here tests that the
# server refuses a forged token; this tests that the browser never gets the
# chance to skip asking. A copy that decoded the JWT itself would pass every
# assertion above and hand the form to whoever typed the loudest.
for _forbidden in ("atob(", "decodeJwt", "JSON.parse(resp.credential",
                   "credential.split"):
    chk(f"the credential is never decoded in the browser (no {_forbidden})",
        _forbidden not in js)
chk("it is POSTed to the server for checking", "/api/auth/google" in js)

# ----------------------------------------------------------------- forgeries
print("\nwith a client id set, a forged or bad token gets nothing:")
A.GOOGLE_CLIENT_ID = "1234567890-abc.apps.googleusercontent.com"

r = c.post("/api/auth/google", json={})
chk(f"no credential -> 400 ({r.status_code})", r.status_code == 400)

# A token that is well-formed base64 nonsense: real verification must reject it.
fake = ("eyJhbGciOiJSUzI1NiJ9."
        "eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiZW1haWwiOiJ2aWN0aW1AZXhhbXBsZS5jb20iLCJlbWFpb"
        "F92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IlZpY3RpbSJ9.not-a-real-signature")
r = c.post("/api/auth/google", json={"credential": fake})
body = r.get_data(as_text=True)
chk(f"a self-made token is rejected ({r.status_code})", r.status_code == 401)
chk("and its claims are never echoed back", "victim@example.com" not in body)

# The library raising for ANY reason must not fall through to trusting claims.
with mock.patch("google.oauth2.id_token.verify_oauth2_token",
                side_effect=ValueError("Token has wrong audience")):
    r = c.post("/api/auth/google", json={"credential": fake})
chk(f"wrong audience is rejected ({r.status_code})", r.status_code == 401)

with mock.patch("google.oauth2.id_token.verify_oauth2_token",
                side_effect=Exception("connection refused")):
    r = c.post("/api/auth/google", json={"credential": fake})
chk("Google being unreachable fails closed, not open", r.status_code == 401)

# A validly-signed token that is NOT from Google's issuer
with mock.patch("google.oauth2.id_token.verify_oauth2_token",
                return_value={"iss": "evil.example.com", "email": "victim@example.com",
                              "email_verified": True, "name": "Victim"}):
    r = c.post("/api/auth/google", json={"credential": fake})
chk(f"a non-Google issuer is rejected ({r.status_code})", r.status_code == 401)

# Verified signature, but the address was never confirmed
with mock.patch("google.oauth2.id_token.verify_oauth2_token",
                return_value={"iss": "https://accounts.google.com",
                              "email": "victim@example.com", "email_verified": False,
                              "name": "Victim"}):
    r = c.post("/api/auth/google", json={"credential": fake})
chk(f"an unverified email is rejected ({r.status_code})", r.status_code == 401)
chk("because that is where the invoice would be sent",
    "victim@example.com" not in r.get_data(as_text=True))

# ------------------------------------------------------------- the happy path
print("\na genuine, verified sign-in:")
with mock.patch("google.oauth2.id_token.verify_oauth2_token",
                return_value={"iss": "https://accounts.google.com",
                              "aud": A.GOOGLE_CLIENT_ID,
                              "email": "dana@example.com", "email_verified": True,
                              "name": "Dana Whitfield", "sub": "10987"}):
    r = c.post("/api/auth/google", json={"credential": fake})
d = r.get_json()
chk(f"accepted ({r.status_code})", r.status_code == 200 and d["ok"])
chk("returns the name to prefill", d["name"] == "Dana Whitfield")
chk("returns the email to prefill", d["email"] == "dana@example.com")
chk("returns nothing else — no id, no token, no picture",
    set(d) == {"ok", "name", "email"})

# ------------------------------------------------- it must never be a barrier
print("\nit stays optional:")
import tempfile, shutil
tmp = tempfile.mkdtemp()
for attr in ("RES_PATH", "CUSTOMERS_PATH", "AGENTS_PATH", "RENTERS_PATH"):
    p = os.path.join(tmp, attr.lower() + ".json")
    setattr(A, attr, p)
    json.dump([], open(p, "w"))
r = c.post("/api/book", json={
    "name": "Someone Who Never Signed In", "email": "walkup@example.com",
    "phone": "206-555-0142", "pickup": "1200 Pine St, Seattle",
    "dropoff": "SeaTac", "date": "2027-03-04", "time": "05:00", "passengers": 1})
chk(f"booking without ever touching Google still works ({r.status_code})",
    r.status_code == 200 and (r.get_json() or {}).get("ok") is True)

shutil.rmtree(tmp, ignore_errors=True)
A.GOOGLE_CLIENT_ID = ""
print("\nPASSED" if not fails else f"\nFAILED: {fails}")
raise SystemExit(1 if fails else 0)
