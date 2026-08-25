#!/usr/bin/env python3
"""Customer names, split in half and locked in two vaults with two keys.

THE IDEA, IN ONE LINE: a stolen vault should be worth nothing.

A name is not one secret, it is two. "Chen" on its own is one of the most
common surnames on earth and points at nobody. "Sarah" on its own points at
nobody. Bound together, and sitting next to a phone number and the address
where somebody will not be home on Tuesday, they point at a specific person.
So the two halves are encrypted separately, with two different keys, and the
keys are never held in the same place. Someone who walks off with one vault is
holding a list of surnames. [SEAN]

WHY THIS IS ENCRYPTION AND NOT HASHING. A hash is one-way: nothing reads it
back, us included, and a driver cannot collect a passenger whose name the
system has permanently destroyed. Sean's original sketch said "two hashes",
and the instinct underneath it was right while the primitive was wrong. There
IS a hash here, in the two places a one-way function actually belongs:

  THE BLIND INDEX. Dispatch has to be able to find "the Chen booking" without
  opening anything. So the surname is also stored as an HMAC under a third key.
  Equal names give equal index values, which is enough to search on, and the
  index cannot be turned back into a name. A stolen index is a list of numbers.

  THE AUDIT CHAIN. Every entry carries the hash of the entry before it, so the
  entries form a chain. Alter or remove any one of them and every hash after it
  stops matching, and the tampering is provable rather than merely unlikely.
  That is what makes "a history that cannot be erased" true instead of a claim.

IT FAILS CLOSED. With no keys configured, seal() raises. It does not quietly
store the name in plain text and carry on, because the failure mode of a
privacy feature that silently stops working is the worst one available: the
promise stays on the website while the protection is gone.

Keys live in the host environment, never in git:
    NAME_KEY_A       given names       base64, 32 bytes
    NAME_KEY_B       family names      base64, 32 bytes
    NAME_INDEX_KEY   the blind index   base64, 32 bytes
Generate a set with:  python3 name_vault.py --keys
"""

import base64
import datetime
import hashlib
import hmac
import json
import os
import threading

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

BASE = os.path.dirname(os.path.abspath(__file__))
_LOCK = threading.Lock()

GENESIS = "0" * 64          # what the first audit entry points back at


def _data_dir():
    """Wherever this deployment keeps its state; the audit log lives beside it."""
    for d in (os.environ.get("DATA_DIR"), "/var/data", BASE):
        if d and os.path.isdir(d):
            return d
    return BASE


def audit_path():
    return os.path.join(_data_dir(), "name_access_log.jsonl")


def _key(name):
    raw = (os.environ.get(name) or "").strip()
    if not raw:
        return None
    try:
        k = base64.b64decode(raw)
    except Exception:
        return None
    return k if len(k) == 32 else None


def configured():
    """True when all three keys are present and the right length."""
    return all(_key(n) for n in ("NAME_KEY_A", "NAME_KEY_B", "NAME_INDEX_KEY"))


def split_name(full):
    """'Sarah Chen' -> ('Sarah', 'Chen'). One word is a given name with no
    family name, which is a real way for a person to be called and not an
    error. Everything between first and last stays with the given name, so
    'Maria de la Cruz' keeps 'Cruz' as the half that goes in vault B."""
    parts = (full or "").strip().split()
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return " ".join(parts[:-1]), parts[-1]


def _seal_one(plain, key_name):
    k = _key(key_name)
    if not k:
        raise RuntimeError("name vault is not configured: %s is missing" % key_name)
    nonce = os.urandom(12)
    ct = AESGCM(k).encrypt(nonce, (plain or "").encode("utf-8"), None)
    return base64.b64encode(nonce + ct).decode("ascii")


def _open_one(blob, key_name):
    k = _key(key_name)
    if not k:
        raise RuntimeError("name vault is not configured: %s is missing" % key_name)
    raw = base64.b64decode(blob)
    return AESGCM(k).decrypt(raw[:12], raw[12:], None).decode("utf-8")


def blind_index(family):
    """A searchable fingerprint of a surname that cannot be read backwards.
    Case and surrounding space are normalised so 'chen' and ' Chen ' match."""
    k = _key("NAME_INDEX_KEY")
    if not k:
        raise RuntimeError("name vault is not configured: NAME_INDEX_KEY is missing")
    norm = (family or "").strip().lower().encode("utf-8")
    return hmac.new(k, norm, hashlib.sha256).hexdigest()


def initials(full):
    """What the screens show when nobody has asked to see the name: enough to
    tell two bookings apart, not enough to identify anyone."""
    given, family = split_name(full)
    a = (given[:1] or "").upper()
    b = (family[:1] or "").upper()
    return (a + " " + b).strip() if b else a


def seal(full_name):
    """A name in, a sealed record out. The plain name is not in the result."""
    given, family = split_name(full_name)
    return {
        "v": 1,
        "a": _seal_one(given, "NAME_KEY_A"),
        "b": _seal_one(family, "NAME_KEY_B"),
        "idx": blind_index(family),
        "mask": initials(full_name),
    }


def unseal(sealed):
    """Both halves, put back together. Callers must go through reveal()."""
    given = _open_one(sealed["a"], "NAME_KEY_A")
    family = _open_one(sealed["b"], "NAME_KEY_B")
    return (given + " " + family).strip()


def _entry_hash(e):
    """The hash covers everything that matters, INCLUDING the previous hash,
    which is what links the chain."""
    canon = json.dumps({k: e[k] for k in ("ts", "who", "reason", "subject", "action", "prev")},
                       sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canon.encode("utf-8")).hexdigest()


def _last_hash():
    p = audit_path()
    if not os.path.exists(p):
        return GENESIS
    last = None
    with open(p, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                last = line
    if not last:
        return GENESIS
    try:
        return json.loads(last)["hash"]
    except Exception:
        return GENESIS


def record_access(who, reason, subject, action="reveal"):
    """Append one link to the chain. Returns the written entry.

    Append only, and fsynced, because an access record that is lost in a crash
    is an access that never happened as far as anyone can later tell."""
    with _LOCK:
        prev = _last_hash()
        e = {"ts": datetime.datetime.now(datetime.timezone.utc).isoformat(),
             "who": who or "unknown", "reason": (reason or "").strip()[:200],
             "subject": subject or "", "action": action, "prev": prev}
        e["hash"] = _entry_hash(e)
        with open(audit_path(), "a", encoding="utf-8") as f:
            f.write(json.dumps(e, sort_keys=True) + "\n")
            f.flush()
            os.fsync(f.fileno())
    return e


def verify_chain():
    """Walk the whole log and prove it has not been edited.

    Returns (ok, checked, first_bad_line). A single altered character anywhere
    breaks its own hash and every link after it."""
    p = audit_path()
    if not os.path.exists(p):
        return True, 0, None
    prev = GENESIS
    n = 0
    with open(p, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            n += 1
            try:
                e = json.loads(line)
            except Exception:
                return False, n, i
            if e.get("prev") != prev or _entry_hash(e) != e.get("hash"):
                return False, n, i
            prev = e["hash"]
    return True, n, None


def reveal(sealed, who, reason, subject=""):
    """THE ONLY DOOR. Opening a name and recording that it was opened are one
    operation, so there is no code path that reads a name without leaving a
    mark. The record is written BEFORE the name is returned: if the write
    fails, the caller gets an error instead of an unrecorded name."""
    entry = record_access(who, reason, subject or sealed.get("idx", "")[:16])
    return unseal(sealed), entry


if __name__ == "__main__":
    import sys
    if "--keys" in sys.argv:
        print("Put these in the host environment. Never in git.\n")
        for n in ("NAME_KEY_A", "NAME_KEY_B", "NAME_INDEX_KEY"):
            print("%s=%s" % (n, base64.b64encode(os.urandom(32)).decode()))
    elif "--verify" in sys.argv:
        ok, n, bad = verify_chain()
        print("chain intact: %s (%d entries)" % (ok, n)
              + ("" if ok else ", first bad line %s" % bad))
    else:
        print(__doc__)
