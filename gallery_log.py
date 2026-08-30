#!/usr/bin/env python3
"""Every search in the Universal Gallery, kept.

[SEAN 2026-08-30: "make sure if there is search in the universal gallery I
need to make sure this data to be kept."]

What was kept before this, and what was not. A search that found NOTHING was
recorded once as a lead, and then deduped forever: ask for the same missing
artist five hundred times and the site knew about it once, with no count, so
the loudest demand on the site was indistinguishable from a single curious
visitor. A search that SUCCEEDED was not recorded at all. The museums and
artworks behind it were planted, which is why the Destination Book grows, but
the question itself, the thing a traveller actually typed while standing in a
gallery, was thrown away.

That question is the most valuable line of data this site produces. It says
which museum to build next, which artwork to write up, which language the
demand is arriving in. So it is now written down twice:

  gallery_searches.jsonl   append only, one line per search, in order.
                           The raw record. Nothing is ever rewritten here.
  gallery_search_tally.json  the same searches counted, so repeats are
                           visible and the top of the list is real demand.

Both live in DATA_DIR, which since 2026-08-28 is a Render disk that survives
deploys, so this record now accumulates instead of being wiped every time the
site ships.

PRIVACY, deliberately. We keep the words typed, the number of results, and
the time. We do not keep who typed them: no address, no session, no device.
A search is a question about an artwork, and the question is useful while the
asker is nobody's business.
"""
import json
import os
import re
import threading
import time

_LOCK = threading.Lock()
_DIR = os.environ.get("DATA_DIR") or os.path.dirname(os.path.abspath(__file__))
LOG_PATH = os.path.join(_DIR, "gallery_searches.jsonl")
TALLY_PATH = os.path.join(_DIR, "gallery_search_tally.json")

MAX_TALLY = 5000            # bound the file; the coldest queries age out first


def _clean(q):
    q = re.sub(r"<[^>]*>", "", (q or "")).strip()
    return re.sub(r"\s+", " ", q)[:80]


def _load_tally():
    try:
        with open(TALLY_PATH, encoding="utf-8") as f:
            d = json.load(f)
            return d if isinstance(d, dict) else {}
    except Exception:
        return {}


def _save_tally(d):
    tmp = TALLY_PATH + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=0)
    os.replace(tmp, TALLY_PATH)          # atomic: a crash never leaves half a file


def record(q, results=0, sources=None, cached=False, lang=""):
    """One search. Returns False only when there was nothing worth keeping."""
    q = _clean(q)
    if len(q) < 2:
        return False
    now = int(time.time())
    row = {"t": now, "q": q, "n": int(results or 0),
           "src": sorted(set(sources or []))[:6], "cached": bool(cached)}
    if lang:
        row["lang"] = lang[:5]
    try:
        with _LOCK:
            # the raw line first: if the tally write fails, the record survives
            with open(LOG_PATH, "a", encoding="utf-8") as f:
                f.write(json.dumps(row, ensure_ascii=False) + "\n")
            t = _load_tally()
            key = q.lower()
            e = t.get(key) or {"q": q, "count": 0, "first": now, "hits": 0, "misses": 0}
            e["count"] += 1
            e["last"] = now
            if row["n"] > 0:
                e["hits"] += 1
            else:
                e["misses"] += 1
            t[key] = e
            if len(t) > MAX_TALLY:       # drop the coldest, never the busiest
                for k in sorted(t, key=lambda k: (t[k]["count"], t[k]["last"]))[:len(t) - MAX_TALLY]:
                    t.pop(k, None)
            _save_tally(t)
        return True
    except Exception:
        return False                     # a search must never fail on its logging


def summary(top=40, recent=40):
    """What the record says, for the owner's eyes."""
    t = _load_tally()
    rows = sorted(t.values(), key=lambda e: (-e.get("count", 0), -e.get("last", 0)))
    wanted = [e for e in rows if e.get("misses", 0) > 0]
    wanted.sort(key=lambda e: (-e.get("misses", 0), -e.get("count", 0)))
    tail = []
    try:
        with open(LOG_PATH, encoding="utf-8") as f:
            lines = f.readlines()[-recent:]
        tail = [json.loads(x) for x in lines if x.strip()]
        tail.reverse()
    except Exception:
        pass
    total = sum(e.get("count", 0) for e in rows)
    return {
        "searches_total": total,
        "distinct": len(rows),
        "answered": sum(e.get("hits", 0) for e in rows),
        "unanswered": sum(e.get("misses", 0) for e in rows),
        "top": rows[:top],
        # The most valuable list on the page: what people asked for and we
        # could not answer. Each one is a museum or an artwork worth adding.
        "wanted": wanted[:top],
        "recent": tail,
    }
