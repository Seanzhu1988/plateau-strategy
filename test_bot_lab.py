# -*- coding: utf-8 -*-
"""The lab must not exist until it is switched on, and must not open early.

Three properties, in the order they matter.

OFF BY DEFAULT. The legal question — whether software may place orders in an
account belonging to someone other than its owner — is with an attorney and is
not answered. Sean's instruction was that nothing ships before that answer. So
the first assertions here are that with BOT_LAB_ENABLED unset, every route
answers 404: not 401, not 403, which would tell a stranger there is something
behind the door. This is what makes the code safe to have in the repository
while the question is open.

ONE DOOR. A credential exists because the owner minted it. There is no signup,
no reset, no recovery. The test cannot prove a route absent by asking for it,
so it does the next best thing: it asks the app for every rule it has and
fails if any of them looks like a way in that the owner did not open.

TWO KEYS TO UNLOCK. A strategy opens only when the record clears the bar AND
the owner then flips it. Each half is tested alone, and each alone must fail.
Kalshi is locked for a different reason — it lost money — and no amount of
record may reopen it.

    python3 test_bot_lab.py
"""
import importlib
import json
import os
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
os.environ.pop("BOT_LAB_ENABLED", None)
os.environ.pop("BOT_LAB_LIVE_OK", None)
os.environ.pop("BOT_LAB_ATTORNEY_CLEARED", None)

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import app as A                                              # noqa: E402
import bot_lab                                               # noqa: E402

tmp = tempfile.mkdtemp()
A.OWNER_AUTH_PATH = os.path.join(tmp, "owner_auth.json")
A.LAB = bot_lab.BotLab(os.path.join(tmp, "u.json"),
                       os.path.join(tmp, "l.json"),
                       os.path.join(tmp, "k.json"))
A.app.config["TESTING"] = True

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


def on():
    os.environ["BOT_LAB_ENABLED"] = "1"


def off():
    os.environ.pop("BOT_LAB_ENABLED", None)


# Only the lab's own surfaces. The account routes are deliberately NOT here:
# they moved to /api/access/* and out from behind this switch, because those
# accounts also open /robot — gating them on the lab meant that with the lab
# off the owner could not issue a credential for an unrelated page. They are
# protected by @owner_required, which does not depend on any switch, and they
# get their own assertions further down.
LAB_ROUTES = [("GET", "/lab"), ("GET", "/api/lab/board"),
              ("POST", "/api/lab/fills"),
              ("POST", "/api/lab/locks/strategy/farm"),
              ("POST", "/api/lab/locks/venue/kalshi")]

print("switched off, the lab does not exist:")
off()
c = A.app.test_client()
bad = []
for method, path in LAB_ROUTES:
    r = c.open(path, method=method, json={})
    if r.status_code != 404:
        bad.append("%s %s -> %d" % (method, path, r.status_code))
chk("every route answers 404 (%s)" % (bad or "all %d" % len(LAB_ROUTES)), not bad)
chk("404 rather than 401 — a refusal would confirm it is there",
    all(c.open(p, method=m, json={}).status_code != 401 for m, p in LAB_ROUTES))
chk("live execution is not allowed", bot_lab.live_execution_allowed() is False)

print("\nswitched on, live execution still is not:")
on()
chk("the lab answers", c.get("/lab").status_code == 200)
chk("but live execution needs two more switches",
    bot_lab.live_execution_allowed() is False)
os.environ["BOT_LAB_LIVE_OK"] = "1"
chk("one of them is not enough", bot_lab.live_execution_allowed() is False)
os.environ["BOT_LAB_ATTORNEY_CLEARED"] = "1"
chk("all three together would be needed", bot_lab.live_execution_allowed() is True)
os.environ.pop("BOT_LAB_LIVE_OK", None)
os.environ.pop("BOT_LAB_ATTORNEY_CLEARED", None)

print("\nthere is exactly one way to get a credential:")
rules = [str(r) for r in A.app.url_map.iter_rules()]
WAYS_IN = ("signup", "register", "reset", "forgot", "recover", "invite",
           "request-access", "magic")
leak = [r for r in rules if "lab" in r and any(w in r.lower() for w in WAYS_IN)]
chk("no signup/reset/recovery/invite route exists (%s)" % (leak or "none"), not leak)

r = c.post("/api/access/users", json={"username": "friend1"})
chk("a stranger cannot mint one (%d)" % r.status_code, r.status_code == 401)

own = A.app.test_client()
own.post("/api/owner/setup", json={"username": "sean", "password": "hunter22"})
r = own.post("/api/access/users", json={"username": "friend1", "note": "a friend"})
chk("the owner can (%d)" % r.status_code, r.status_code == 200)
pw = r.get_json()["password"]
chk("the password is strong enough to be sent by text (%d chars)" % len(pw), len(pw) >= 24)

r2 = own.get("/api/access/users").get_json()
chk("the owner's list never carries the hash or the salt",
    all("hash" not in u and "salt" not in u for u in r2["users"]))
raw = json.load(open(A.LAB.users_path))
chk("and the password itself is not stored anywhere",
    all(pw not in json.dumps(u) for u in raw))

# These accounts open /robot too. Gating them on BOT_LAB_ENABLED meant that
# with the lab off the owner could not issue a credential for an unrelated
# page — found by writing the /robot password test, not by reading the code.
print("\nthe accounts are not the lab's property:")
off()
r = own.post("/api/access/users", json={"username": "friend2"})
chk("the owner can still mint with the lab switched off (%d)" % r.status_code,
    r.status_code == 200)
pw2 = r.get_json()["password"]
other = A.app.test_client()
r = other.post("/api/access/login", json={"username": "friend2", "password": pw2})
chk("and that account can still sign in (%d)" % r.status_code, r.status_code == 200)
r = other.get("/api/lab/board")
chk("but the lab itself is still gone (%d)" % r.status_code, r.status_code == 404)
r = c.post("/api/access/users", json={"username": "sneaky"})
chk("a stranger still cannot mint, switch or no switch (%d)" % r.status_code,
    r.status_code == 401)
on()

print("\nsigning in:")
user = A.app.test_client()
r = user.post("/api/access/login", json={"username": "friend1", "password": "wrong"})
chk("a wrong password is refused (%d)" % r.status_code, r.status_code == 401)
wrong_user = user.post("/api/access/login", json={"username": "nobody", "password": "x"})
chk("an unknown user gets the SAME message — no way to enumerate accounts",
    wrong_user.get_json().get("error") == r.get_json().get("error"))
r = user.post("/api/access/login", json={"username": "friend1", "password": pw})
chk("the issued password works (%d)" % r.status_code, r.status_code == 200)
r = user.get("/api/lab/board")
chk("and the board opens (%d)" % r.status_code, r.status_code == 200)
board = r.get_json()

print("\nnothing on the board is the owner's business:")
blob = json.dumps(board).lower()
LEAKS = ["sean", "@", "seattle", "917", "gmail", "hash", "salt", "friend1@"]
hits = [w for w in LEAKS if w in blob.replace('"username": "friend1"', "")]
chk("no owner identity, contact or credential material (%s)" % (hits or "clean"), not hits)
chk("no other user is listed", "users" not in board)
chk("it says it is paper", board.get("mode") == "paper")
chk("and that live execution is off", board.get("live_execution") is False)

print("\nKalshi is locked, and results cannot reopen it:")
k = [v for v in board["venues"] if v["key"] == "kalshi"][0]
chk("it is locked", k["locked"] is True)
chk("for its own stated reason, not for want of a record",
    "losing money" in k["why"].lower())
r = own.post("/api/lab/locks/venue/kalshi", json={"locked": False})
chk("even the owner cannot unlock it from the console (%d)" % r.status_code,
    r.status_code == 400)

print("\nunlocking a strategy takes two keys, and one is never enough:")
chk("farm starts locked", A.LAB.is_locked("strategy", "farm") is True)
r = own.post("/api/lab/locks/strategy/farm", json={"locked": False})
chk("the owner's key alone is refused (%d)" % r.status_code, r.status_code == 400)
chk("and the refusal says what is missing",
    "eligible" in (r.get_json().get("error") or "").lower())

# Build a record that clears the bar: enough trades, enough days, net positive.
for i in range(bot_lab.UNLOCK_RULE["min_fills"]):
    day = "2026-0%d-%02d" % (1 + i % 5, 1 + i % 28)
    A.LAB.record_fill("farm", 1.25, when=day + "T12:00:00")
el = A.LAB.eligibility("farm")
chk("the record now clears the bar (%s)" % el.get("blockers"), el["eligible"] is True)
chk("but the record alone did not open it",
    A.LAB.is_locked("strategy", "farm") is True)
r = own.post("/api/lab/locks/strategy/farm", json={"locked": False})
chk("with both keys it opens (%d)" % r.status_code, r.status_code == 200)
chk("and it reads as open", A.LAB.is_locked("strategy", "farm") is False)

print("\na losing record cannot open anything:")
for i in range(bot_lab.UNLOCK_RULE["min_fills"]):
    day = "2026-0%d-%02d" % (1 + i % 5, 1 + i % 28)
    A.LAB.record_fill("limit_order", -2.00, when=day + "T12:00:00")
el = A.LAB.eligibility("limit_order")
chk("net-negative is not eligible (%s)" % el["blockers"], el["eligible"] is False)
r = own.post("/api/lab/locks/strategy/limit_order", json={"locked": False})
chk("and the owner cannot force it (%d)" % r.status_code, r.status_code == 400)

print("\nlocking is always allowed — shutting off is never the hard direction:")
r = own.post("/api/lab/locks/strategy/farm", json={"locked": True})
chk("farm can be shut again at once (%d)" % r.status_code, r.status_code == 200)
chk("and it is shut", A.LAB.is_locked("strategy", "farm") is True)

print("\nreading the record and writing to it are different permissions:")
chk("an account is a reader unless asked otherwise",
    A.LAB.role_of("friend1") == "reader")
r = user.post("/api/lab/fills", json={"strategy": "farm", "pnl_usd": 99})
chk("a reader cannot file a trade (%d)" % r.status_code, r.status_code == 403)
chk("and is told why, not just refused",
    "bot account" in (r.get_json().get("error") or ""))
chk("nothing was written", A.LAB.stats("farm")["fills"] == bot_lab.UNLOCK_RULE["min_fills"])

r = own.post("/api/access/users", json={"username": "thebot", "role": "bot"})
chk("the owner can mint a bot account (%d)" % r.status_code, r.status_code == 200)
bot_pw = r.get_json()["password"]
chk("and it is labelled as one", r.get_json().get("role") == "bot")
botc = A.app.test_client()
botc.post("/api/access/login", json={"username": "thebot", "password": bot_pw})
r = botc.post("/api/lab/fills", json={"strategy": "farm", "pnl_usd": 1.0})
chk("the bot account can file a trade (%d)" % r.status_code, r.status_code == 200)

r = own.post("/api/access/users", json={"username": "nonsense", "role": "admin"})
chk("an unknown role is refused rather than ignored (%d)" % r.status_code,
    r.status_code == 400)

# An account written before roles existed has no role field at all. Reading a
# missing permission as "bot" would have handed write access to every account
# that predates the check — the exact way a security fix becomes a hole.
raw = json.load(open(A.LAB.users_path))
for u in raw:
    u.pop("role", None)
A.LAB._write(A.LAB.users_path, raw)
chk("an account from before roles existed reads as a reader, not a bot",
    A.LAB.role_of("thebot") == "reader")
r = botc.post("/api/lab/fills", json={"strategy": "farm", "pnl_usd": 1.0})
chk("so it can no longer write either (%d)" % r.status_code, r.status_code == 403)
for u in raw:
    u["role"] = "bot" if u.get("username") == "thebot" else "reader"
A.LAB._write(A.LAB.users_path, raw)

r = own.post("/api/lab/fills", json={"strategy": "farm", "pnl_usd": 500})
chk("even the owner cannot write without a bot account (%d)" % r.status_code,
    r.status_code in (401, 403))

own.post("/api/access/users/thebot/revoke", json={"revoked": True})
r = botc.post("/api/lab/fills", json={"strategy": "farm", "pnl_usd": 1.0})
chk("a revoked bot stops writing (%d)" % r.status_code, r.status_code in (401, 403))
own.post("/api/access/users/thebot/revoke", json={"revoked": False})

print("\nthe fill endpoint cannot be used to invent a live trade:")
user = botc                      # the remaining write checks need a writer
r = user.post("/api/lab/fills", json={"strategy": "farm", "pnl_usd": 5, "mode": "live"})
chk("a mode the caller asks for is ignored (%s)" % r.get_json()["fill"]["mode"],
    r.get_json()["fill"]["mode"] == "paper")
r = user.post("/api/lab/fills", json={"strategy": "made_up", "pnl_usd": 5})
chk("an unknown strategy is rejected, not created (%d)" % r.status_code,
    r.status_code == 400)
r = user.post("/api/lab/fills", json={"strategy": "farm", "pnl_usd": "abc"})
chk("a non-numeric result is rejected (%d)" % r.status_code, r.status_code == 400)

print("\na revoked account stops working:")
own.post("/api/access/users/friend1/revoke", json={"revoked": True})
fresh = A.app.test_client()
r = fresh.post("/api/access/login", json={"username": "friend1", "password": pw})
chk("the password no longer signs in (%d)" % r.status_code, r.status_code == 401)

print("\nand it is not indexable:")
r = c.get("/lab")
chk("noindex header", "noindex" in (r.headers.get("X-Robots-Tag") or ""))
chk("not in the sitemap", "/lab" not in c.get("/sitemap.xml").get_data(as_text=True))

off()
shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
