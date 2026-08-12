# -*- coding: utf-8 -*-
"""The bot lab: owner-issued accounts, locked venues, and a record that has to
be earned before anything opens.

WHAT THIS IS NOT, AND CANNOT BECOME BY ACCIDENT
-----------------------------------------------
It does not place orders. It does not connect to an exchange. It does not hold
a key, a balance, or a dollar. There is no code path here that reaches a
broker, because the question of whether software may trade in somebody else's
account is with an attorney and is not answered yet.

What it is: the harness around that question. Accounts only the owner can
create, a registry of venues and strategies that ship locked, and a ledger
that accumulates a record. When there is a bot and an answer, the bot posts
its fills to the ledger and the ledger decides what may unlock.

THREE THINGS ARE DELIBERATELY DIFFICULT
---------------------------------------
1. The whole module is inert unless BOT_LAB_ENABLED is set. Unset, every route
   answers 404, not "unauthorised", which would confirm the thing exists.
   This is what makes it safe for the code to be pushed while the legal
   question is open: shipping it changes nothing until somebody deliberately
   turns it on.

2. There is no way to obtain a credential except the owner minting one. No
   signup, no invite link, no password reset, no "email me a recovery code".
   Those are the paths that get abused, and the instruction was that a
   password comes from Sean and nowhere else. A missing feature is the only
   kind that cannot be tricked.

3. Unlocking a strategy takes two independent keys: the recorded results must
   clear a threshold the code checks, AND the owner must then flip it by hand.
   Either alone is a way to open something on a lucky fortnight.

NO PERSONAL DATA
----------------
Nothing about the owner is stored or served here, no name, no email, no
phone, no location. A signed-in user sees the ledger and the lock state and
nothing else. The only personal datum in the file is a username the owner
chose, and its hash.
"""
import datetime
import hashlib
import hmac
import json
import os
import secrets
import threading

# --------------------------------------------------------------------------
# The master switch. Absent -> the lab does not exist as far as the site is
# concerned. Set it to "1" only on an instance that is meant to run the lab.
# --------------------------------------------------------------------------
def enabled():
    return (os.environ.get("BOT_LAB_ENABLED") or "").strip() in ("1", "true", "yes", "on")


# Live execution is a SEPARATE switch from the lab, and both are separate from
# the attorney's answer. All three must line up before a single real order
# could ever be sent, and the code that would send it does not exist yet.
def live_execution_allowed():
    return (enabled()
            and (os.environ.get("BOT_LAB_LIVE_OK") or "").strip() == "1"
            and (os.environ.get("BOT_LAB_ATTORNEY_CLEARED") or "").strip() == "1")


_LOCK = threading.RLock()          # reentrant: helpers below call each other

# --------------------------------------------------------------------------
# Passwords
#
# app.py's _hash_pw is one round of salted SHA-256. That is fine for what it
# guards and it is not being changed from here, but a single fast hash is the
# wrong tool for credentials protecting trading infrastructure: a leaked file
# is brute-forced at billions of guesses a second. PBKDF2 with a real
# iteration count makes each guess cost something.
# --------------------------------------------------------------------------
PBKDF2_ROUNDS = 200_000

# Two kinds of account, and the split is the point: a reader can open the
# pages and read the record; a bot can write to the ledger and nothing else
# needs it. One credential should never do both jobs, because the reading
# credential is the one that gets handed around.
ROLES = ("reader", "bot")


def hash_pw(password, salt=None):
    salt = salt or secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", (password or "").encode(),
                             salt.encode(), PBKDF2_ROUNDS)
    return salt, dk.hex()


def verify_pw(password, salt, want):
    dk = hashlib.pbkdf2_hmac("sha256", (password or "").encode(),
                             (salt or "").encode(), PBKDF2_ROUNDS)
    return hmac.compare_digest(dk.hex(), want or "")


# --------------------------------------------------------------------------
# Venues and strategies
#
# Everything ships locked. Kalshi is locked with its own reason and is not
# merely "not yet proven", it was losing money, which is a different fact and
# is recorded as one so nobody later mistakes it for a strategy that simply
# has not had its turn.
# --------------------------------------------------------------------------
VENUES = {
    "kalshi": {
        "title": "Kalshi (event contracts)",
        "locked": True,
        "why": "Unstable and losing money. Locked by the owner on 2026-08-08, "
               "not for want of a track record. Do not unlock on results alone.",
        "hard": True,          # the threshold cannot open this one; only the owner
    },
}

STRATEGIES = {
    "farm": {
        "title": "Farm",
        "locked": True,
        "why": "Unproven. Opens when the recorded results clear the threshold "
               "and the owner then flips it.",
        "hard": False,
    },
    "limit_order": {
        "title": "Limit order",
        "locked": True,
        "why": "Unproven. Opens when the recorded results clear the threshold "
               "and the owner then flips it.",
        "hard": False,
    },
}

# What "proven" means, in numbers, so it is not decided by a good fortnight.
# These are starting values and the owner may raise them; lowering them is a
# decision that should be made deliberately and in daylight, not mid-drawdown.
UNLOCK_RULE = {
    "min_fills": 200,           # enough trades that variance is not the story
    "min_days": 90,             # over enough time that one regime is not the story
    "require_net_positive": True,   # after costs, not before
}


class BotLab(object):
    """State lives in one object so the Flask layer stays thin and the tests
    can point it at a temporary directory."""

    def __init__(self, users_path, ledger_path, locks_path):
        self.users_path = users_path
        self.ledger_path = ledger_path
        self.locks_path = locks_path

    # ---------------- storage ----------------
    def _read(self, path, default):
        try:
            with open(path) as f:
                return json.load(f)
        except Exception:
            return default

    def _write(self, path, data):
        tmp = path + ".tmp"
        with open(tmp, "w") as f:
            json.dump(data, f, indent=2)
        os.replace(tmp, path)

    # ---------------- accounts ----------------
    def users(self):
        return self._read(self.users_path, [])

    def mint_user(self, username, note="", role="reader"):
        """Create an account and return the password ONCE.

        The password is generated here rather than chosen: a password the
        owner invents for somebody else is a password the owner reuses. It is
        returned exactly once, in this call's reply, and only its hash is
        stored, so it cannot be looked up later, by anyone, including the
        owner. Losing it means minting a new one, which is the correct
        recovery story for a system with no reset.

        The role decides who may WRITE. Readers read; a bot writes; nobody
        does both. Without this every account that could open the page could
        also post fills, so anybody given a password to read the concept
        could have filed fabricated winning trades into the ledger, and the
        ledger is the entire basis for deciding what has earned an unlock.
        A poisoned scoreboard is worse than no scoreboard.

        'reader' is the default deliberately: a role has to be asked for."""
        username = (username or "").strip().lower()
        if not username or len(username) < 3:
            return None, "A username of at least 3 characters is required."
        role = (role or "reader").strip().lower()
        if role not in ROLES:
            return None, "Role must be one of: %s." % ", ".join(ROLES)
        with _LOCK:
            users = self.users()
            if any(u.get("username") == username for u in users):
                return None, "That username already exists."
            password = _readable_password()
            salt, h = hash_pw(password)
            users.append({
                "username": username,
                "salt": salt, "hash": h,
                "role": role,
                "note": (note or "").strip()[:120],
                "created_at": _now(),
                "revoked": False,
                "last_seen": None,
            })
            self._write(self.users_path, users)
        return password, None

    def role_of(self, username):
        """The role of a live account, or None if there isn't one.

        An account stored before roles existed has no role field. It is read
        as 'reader', not as 'bot', an unknown permission has to fail closed,
        or adding the check would have silently granted write access to every
        account that predates it."""
        for u in self.users():
            if u.get("username") == (username or "").strip().lower() and not u.get("revoked"):
                return u.get("role") or "reader"
        return None

    def may_write(self, username):
        return self.role_of(username) == "bot"

    def check_login(self, username, password):
        username = (username or "").strip().lower()
        for u in self.users():
            if u.get("username") == username and not u.get("revoked"):
                if verify_pw(password, u.get("salt"), u.get("hash")):
                    return True
                return False
        # Hash anyway against a throwaway salt so a missing username and a
        # wrong password take the same time to answer. Otherwise the login
        # form doubles as a way to enumerate who has an account.
        verify_pw(password, "0" * 32, "")
        return False

    def touch(self, username):
        with _LOCK:
            users = self.users()
            for u in users:
                if u.get("username") == username:
                    u["last_seen"] = _now()
            self._write(self.users_path, users)

    def revoke(self, username, revoked=True):
        with _LOCK:
            users = self.users()
            hit = False
            for u in users:
                if u.get("username") == (username or "").strip().lower():
                    u["revoked"] = bool(revoked)
                    hit = True
            if hit:
                self._write(self.users_path, users)
            return hit

    def public_users(self):
        """The owner's list. Never the hash, never the salt."""
        return [{"username": u.get("username"), "note": u.get("note"),
                 "role": u.get("role") or "reader",
                 "created_at": u.get("created_at"), "revoked": bool(u.get("revoked")),
                 "last_seen": u.get("last_seen")}
                for u in self.users()]

    # ---------------- the record ----------------
    def fills(self):
        return self._read(self.ledger_path, [])

    def record_fill(self, strategy, pnl_usd, when=None, note=""):
        """One completed paper trade. This is the plug point: when the bot
        exists it posts here, and nothing it posts can move money."""
        if strategy not in STRATEGIES:
            return None, "Unknown strategy."
        try:
            pnl = float(pnl_usd)
        except (TypeError, ValueError):
            return None, "pnl_usd must be a number."
        row = {"strategy": strategy, "pnl_usd": round(pnl, 2),
               "at": when or _now(), "mode": "paper",
               "note": (note or "").strip()[:200]}
        with _LOCK:
            rows = self.fills()
            rows.append(row)
            self._write(self.ledger_path, rows)
        return row, None

    def stats(self, strategy):
        rows = [r for r in self.fills() if r.get("strategy") == strategy]
        if not rows:
            return {"fills": 0, "net_usd": 0.0, "days": 0, "first": None, "last": None}
        dates = sorted(r.get("at", "")[:10] for r in rows if r.get("at"))
        days = 0
        if dates and dates[0] and dates[-1]:
            try:
                days = (datetime.date.fromisoformat(dates[-1])
                        - datetime.date.fromisoformat(dates[0])).days
            except ValueError:
                days = 0
        return {"fills": len(rows),
                "net_usd": round(sum(float(r.get("pnl_usd") or 0) for r in rows), 2),
                "days": days, "first": dates[0] if dates else None,
                "last": dates[-1] if dates else None}

    # ---------------- locks ----------------
    def _overrides(self):
        return self._read(self.locks_path, {})

    def is_locked(self, kind, key):
        table = VENUES if kind == "venue" else STRATEGIES
        if key not in table:
            return True
        ov = self._overrides().get("%s:%s" % (kind, key))
        if ov is None:
            return bool(table[key]["locked"])
        return bool(ov)

    def eligibility(self, key):
        """Has the record earned the right to be considered? This is only the
        first of the two keys, it never unlocks anything by itself."""
        spec = STRATEGIES.get(key)
        if not spec:
            return {"eligible": False, "blockers": ["Unknown strategy."]}
        if spec.get("hard"):
            return {"eligible": False,
                    "blockers": ["Locked by the owner for a stated reason; "
                                 "results cannot open this one."]}
        s = self.stats(key)
        blockers = []
        if s["fills"] < UNLOCK_RULE["min_fills"]:
            blockers.append("%d of %d recorded trades."
                            % (s["fills"], UNLOCK_RULE["min_fills"]))
        if s["days"] < UNLOCK_RULE["min_days"]:
            blockers.append("%d of %d days of record."
                            % (s["days"], UNLOCK_RULE["min_days"]))
        if UNLOCK_RULE["require_net_positive"] and s["net_usd"] <= 0:
            blockers.append("Net result is %+.2f; it must be positive after costs."
                            % s["net_usd"])
        return {"eligible": not blockers, "blockers": blockers, "stats": s}

    def set_lock(self, kind, key, locked):
        """The owner's key. Locking is always allowed, shutting something off
        should never be the hard direction. Unlocking a strategy requires the
        record to have earned it first; unlocking a hard-locked venue is
        refused outright, so Kalshi cannot be reopened by this route at all."""
        table = VENUES if kind == "venue" else STRATEGIES
        if key not in table:
            return False, "Unknown %s." % kind
        if not locked:
            if table[key].get("hard"):
                return False, ("%s is locked for a stated reason, not for want "
                               "of a record. Change it in the code, deliberately."
                               % table[key]["title"])
            if kind == "strategy":
                el = self.eligibility(key)
                if not el["eligible"]:
                    return False, "Not eligible yet: " + " ".join(el["blockers"])
        with _LOCK:
            ov = self._overrides()
            ov["%s:%s" % (kind, key)] = bool(locked)
            self._write(self.locks_path, ov)
        return True, None

    def board(self):
        """Everything a signed-in user may see. No owner data, no user list."""
        return {
            "live_execution": live_execution_allowed(),
            "mode": "paper",
            "rule": dict(UNLOCK_RULE),
            "venues": [{"key": k, "title": v["title"], "why": v["why"],
                        "locked": self.is_locked("venue", k)}
                       for k, v in sorted(VENUES.items())],
            "strategies": [dict({"key": k, "title": v["title"], "why": v["why"],
                                 "locked": self.is_locked("strategy", k)},
                                **{"progress": self.eligibility(k)})
                           for k, v in sorted(STRATEGIES.items())],
        }


# --------------------------------------------------------------------------
def _now():
    return datetime.datetime.now().isoformat(timespec="seconds")


_WORDS = ("anchor basin cedar delta ember fjord gable harbor inlet jetty kelp "
          "lumen mesa north orbit prairie quarry ridge summit tundra umber "
          "vault willow xenon yonder zenith").split()


def _readable_password():
    """Four words and a number: strong enough to resist guessing, short enough
    that Sean can read it down a phone line without spelling every character.
    ~26^4 * 900 combinations from a CSPRNG."""
    return "-".join(secrets.choice(_WORDS) for _ in range(4)) + "-" + str(secrets.randbelow(900) + 100)
