"""Find museum-selected highlights and gather official facts without an AI key.

Popularity means the museums' own highlights/essentials, not visitor demand or
internet trends. An hourly caller is safe across processes: SQLite reserves a
six-hour scan before any request. Discovery never calls a paid model; the normal
archive queue owns writing, caching, generation leases and monthly spending.

Sources: https://api.artic.edu/docs/ and https://metmuseum.github.io/
"""
import contextlib
import datetime
from html.parser import HTMLParser
import json
import os
import re
import secrets
import time
import urllib.error
import urllib.parse
import urllib.request

import gallery_archive

INTERVAL = 6 * 3600
NETWORK_BUDGET = 45
MAX_DETAILS = 12
PAGE_SIZE = 24
MAX_RESPONSE = 2 * 1024 * 1024
PROVIDERS = ("aic", "met")
AIC = "https://api.artic.edu/api/v1/artworks"
MET = "https://collectionapi.metmuseum.org/public/collection"
_SCHEMA = """
CREATE TABLE IF NOT EXISTS scout_state (
 id INTEGER PRIMARY KEY CHECK(id=1), next_run REAL NOT NULL DEFAULT 0,
 last_started REAL NOT NULL DEFAULT 0, last_finished REAL NOT NULL DEFAULT 0,
 last_status TEXT NOT NULL DEFAULT 'never_run', last_error TEXT NOT NULL DEFAULT '',
 last_queued INTEGER NOT NULL DEFAULT 0, runs INTEGER NOT NULL DEFAULT 0,
 token TEXT NOT NULL DEFAULT '');
INSERT OR IGNORE INTO scout_state(id) VALUES(1);
CREATE TABLE IF NOT EXISTS scout_sources (
 provider TEXT PRIMARY KEY, cursor INTEGER NOT NULL DEFAULT 0,
 next_attempt REAL NOT NULL DEFAULT 0, failures INTEGER NOT NULL DEFAULT 0,
 last_success REAL NOT NULL DEFAULT 0, last_error TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS scout_candidates (
 provider TEXT NOT NULL, object_id TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending',
 priority INTEGER NOT NULL DEFAULT 0,
 attempts INTEGER NOT NULL DEFAULT 0, next_attempt REAL NOT NULL DEFAULT 0,
 last_error TEXT NOT NULL DEFAULT '', artifact_id TEXT NOT NULL DEFAULT '',
 created REAL NOT NULL, updated REAL NOT NULL, PRIMARY KEY(provider,object_id));
CREATE INDEX IF NOT EXISTS scout_candidate_due ON scout_candidates(status,next_attempt);
CREATE TABLE IF NOT EXISTS scout_daily (
 day TEXT PRIMARY KEY, queued INTEGER NOT NULL DEFAULT 0,
 reserved INTEGER NOT NULL DEFAULT 0);
"""


def enabled():
    return os.environ.get("GALLERY_SCOUT_ENABLED", "true").strip().lower() not in (
        "false", "0", "off", "no")


def _cap():
    try:
        return max(0, min(24, int(os.environ.get("GALLERY_SCOUT_DAILY_CAP", "4"))))
    except (TypeError, ValueError):
        return 4


def _day(now):
    return datetime.datetime.fromtimestamp(now, datetime.timezone.utc).strftime("%Y-%m-%d")


@contextlib.contextmanager
def _database():
    with gallery_archive.database() as db:
        db.executescript(_SCHEMA)
        yield db


class SourceError(Exception):
    """Only fixed, non-sensitive reason codes belong in durable status."""


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class _Client:
    def __init__(self):
        self.deadline = time.monotonic() + NETWORK_BUDGET
        self.last_request = 0
        self.opener = urllib.request.build_opener(_NoRedirect())

    def get(self, url):
        parsed = urllib.parse.urlsplit(url)
        if (parsed.scheme != "https" or parsed.hostname not in
                ("api.artic.edu", "collectionapi.metmuseum.org") or
                parsed.username or parsed.password or parsed.port or parsed.fragment):
            raise SourceError("unapproved_source")
        # AIC requests no more than one API request per second. Only one scout
        # process can claim the pass, and the client also bounds response size.
        pause = max(0, self.last_request + 1 - time.monotonic())
        if time.monotonic() + pause >= self.deadline:
            raise SourceError("network_budget")
        if pause:
            time.sleep(pause)
        remaining = self.deadline - time.monotonic()
        if remaining <= 0:
            raise SourceError("network_budget")
        self.last_request = time.monotonic()
        request = urllib.request.Request(url, headers={
            "User-Agent": "StJohnGalleryScout/1.0", "AIC-User-Agent": "StJohnGalleryScout/1.0",
            "Accept": "application/json", "Accept-Encoding": "identity"})
        try:
            with self.opener.open(request, timeout=min(6, remaining)) as response:
                chunks, length = [], 0
                while True:
                    if time.monotonic() >= self.deadline:
                        raise SourceError("network_budget")
                    chunk = response.read1(16384)
                    if not chunk:
                        break
                    length += len(chunk)
                    if length > MAX_RESPONSE:
                        raise SourceError("response_too_large")
                    chunks.append(chunk)
                value = json.loads(b"".join(chunks))
                if not isinstance(value, dict):
                    raise SourceError("invalid_response")
                return value
        except SourceError:
            raise
        except urllib.error.HTTPError as exc:
            raise SourceError("http_%d" % exc.code) from None
        except (ValueError, UnicodeError):
            raise SourceError("invalid_response") from None
        except Exception:
            raise SourceError("network_error") from None


def _object_id(value):
    text = str(value or "")
    return text if re.fullmatch(r"[1-9][0-9]{0,9}", text) else ""


class _Text(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts, self.hidden = [], 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.hidden += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.hidden = max(0, self.hidden - 1)
        if tag in ("p", "div", "br", "li") and not self.hidden:
            self.parts.append(" ")

    def handle_data(self, data):
        if not self.hidden:
            self.parts.append(data)


def _plain(value, limit=3500):
    parser = _Text()
    parser.feed(str(value or "")[:30000])
    return " ".join("".join(parser.parts).split())[:limit]


def _image(value):
    try:
        parsed = urllib.parse.urlsplit(str(value or ""))
        if (parsed.scheme == "https" and parsed.hostname == "images.metmuseum.org"
                and not parsed.username and not parsed.port):
            return str(value)[:1000]
    except ValueError:
        pass
    return ""


def _fetch_feed(client, provider, cursor):
    if provider == "aic":
        page = max(1, min(416, cursor + 1))
        query = {"query": {"term": {"is_boosted": True}},
                 "fields": ["id", "title", "boost_rank"],
                 "sort": [{"boost_rank": {"order": "asc"}}, {"id": {"order": "asc"}}],
                 "limit": PAGE_SIZE, "page": page}
        data = client.get(AIC + "/search?" + urllib.parse.urlencode({
            "params": json.dumps(query, separators=(",", ":"))}))
        if not isinstance(data.get("data"), list):
            raise SourceError("invalid_feed")
        ids = [row.get("id") for row in data["data"][:PAGE_SIZE] if isinstance(row, dict)]
        total = int((data.get("pagination") or {}).get("total_pages") or page)
        next_cursor = page if ids and page < min(total, 416) else 0
    else:
        offset = max(0, min(9960, cursor))
        # The documented v1.1 endpoint remains supported after v1/search retires.
        data = client.get(MET + "/v1.1/search?" + urllib.parse.urlencode({
            "isHighlight": "true", "q": "*", "offset": offset, "limit": PAGE_SIZE}))
        if not isinstance(data.get("objectIDs"), list) and data.get("total") != 0:
            raise SourceError("invalid_feed")
        ids = (data.get("objectIDs") or [])[:PAGE_SIZE]
        total = int(data.get("total") or 0)
        next_cursor = offset + PAGE_SIZE if ids and offset + PAGE_SIZE < min(total, 9984) else 0
    return list(dict.fromkeys(i for i in map(_object_id, ids) if i)), next_cursor


def _fetch_facts(client, provider, oid, now):
    if not _object_id(oid):
        raise SourceError("invalid_object_id")
    if provider == "aic":
        fields = ("id,title,artist_title,artist_display,date_display,main_reference_number,"
                  "gallery_title,is_on_view,image_id,alt_image_ids,is_public_domain,"
                  "description,short_description,medium_display,dimensions,credit_line,place_of_origin")
        row = client.get(AIC + "/" + oid + "?fields=" + fields).get("data")
        if not isinstance(row, dict) or _object_id(row.get("id")) != oid:
            raise SourceError("invalid_object")
        museum = "Art Institute of Chicago"
        public = row.get("is_public_domain") is True
        image_ids = [i for i in [row.get("image_id")] + (row.get("alt_image_ids") or [])
                     if isinstance(i, str) and re.fullmatch(r"[a-zA-Z0-9-]{1,100}", i)] if public else []
        images = ["https://www.artic.edu/iiif/2/%s/full/843,/0/default.jpg" % i
                  for i in list(dict.fromkeys(image_ids))[:12]]
        facts = {"title": row.get("title"), "artist": row.get("artist_display") or row.get("artist_title"),
                 "date": row.get("date_display"), "item_number": row.get("main_reference_number"),
                 "where": row.get("gallery_title"), "on_view": row.get("is_on_view") is True,
                 "medium": row.get("medium_display"), "dimensions": row.get("dimensions"),
                 "credit_line": row.get("credit_line"), "city": "Chicago",
                 "historical_context": _plain(row.get("description") or row.get("short_description")),
                 "source_url": "https://www.artic.edu/artworks/" + oid,
                 "research_provider": museum, "museum_lat": 41.8796, "museum_lon": -87.6237}
        # place_of_origin is a geographic fact, not an inferred cultural identity.
        if row.get("place_of_origin"):
            facts["historical_context"] = (facts["historical_context"] + "\nPlace of origin: " +
                                           _plain(row["place_of_origin"], 200)).strip()[:3500]
    else:
        row = client.get(MET + "/v1/objects/" + oid)
        if _object_id(row.get("objectID")) != oid:
            raise SourceError("invalid_object")
        museum, public = "The Met, New York", row.get("isPublicDomain") is True
        images = list(dict.fromkeys(filter(None, map(_image,
                    [row.get("primaryImage")] + (row.get("additionalImages") or [])))))[:12] if public else []
        facts = {"title": row.get("title"), "artist": row.get("artistDisplayName"),
                 "date": row.get("objectDate"), "item_number": row.get("accessionNumber"),
                 "where": "Gallery " + str(row["GalleryNumber"]) if row.get("GalleryNumber") else "",
                 "on_view": bool(row.get("GalleryNumber")), "medium": row.get("medium"),
                 "culture": row.get("culture"), "dimensions": row.get("dimensions"),
                 "period": row.get("period") or row.get("dynasty"), "credit_line": row.get("creditLine"),
                 "city": "New York", "historical_context": "",
                 "source_url": "https://www.metmuseum.org/art/collection/search/" + oid,
                 "research_provider": "The Metropolitan Museum of Art",
                 "museum_lat": 40.7794, "museum_lon": -73.9632}
    if not _plain(facts.get("title"), 400):
        raise SourceError("missing_title")
    facts = {key: _plain(value, 3500 if key == "historical_context" else 1000)
             if isinstance(value, str) else value for key, value in facts.items()}
    facts.update(museum=museum, source=museum, provider=provider, source_object_id=oid,
                 source_kind="museum_catalogue", images=images, image=images[0] if images else "",
                 copyright=not public, discovery_origin="museum_highlights",
                 research_source_url=facts["source_url"], researched_at=now, catalogue_observed_at=now)
    return facts


def _reason(exc):
    return str(exc)[:80] if isinstance(exc, SourceError) else "source_unavailable"


def _refresh(client, provider, now):
    with _database() as db:
        db.execute("INSERT OR IGNORE INTO scout_sources(provider) VALUES(?)", (provider,))
        source = dict(db.execute("SELECT * FROM scout_sources WHERE provider=?", (provider,)).fetchone())
        backlog = db.execute("SELECT COUNT(*) FROM scout_candidates WHERE provider=? AND status!='done'",
                             (provider,)).fetchone()[0]
    if source["next_attempt"] > now:
        return
    # A four-story daily budget must not accumulate thousands of unresearched
    # candidates. Resume this live feed's saved cursor once its backlog drains.
    if backlog >= PAGE_SIZE * 2:
        return
    try:
        ids, cursor = _fetch_feed(client, provider, source["cursor"])
    except Exception as exc:
        failures = source["failures"] + 1
        with _database() as db:
            db.execute("UPDATE scout_sources SET failures=?,next_attempt=?,last_error=? WHERE provider=?",
                       (failures, now + min(48 * 3600, INTERVAL * 2 ** min(failures - 1, 3)),
                        _reason(exc), provider))
        return
    with _database() as db:
        for priority, oid in enumerate(ids):
            db.execute("INSERT OR IGNORE INTO scout_candidates(provider,object_id,priority,created,updated) "
                       "VALUES(?,?,?,?,?)", (provider, oid, priority, now, now))
        db.execute("UPDATE scout_sources SET cursor=?,failures=0,next_attempt=?,last_success=?,last_error='' "
                   "WHERE provider=?", (cursor, now + INTERVAL, now, provider))


def _slot(day, token):
    with _database() as db:
        db.execute("BEGIN IMMEDIATE")
        owner = db.execute("SELECT token FROM scout_state WHERE id=1").fetchone()[0]
        if owner != token or not enabled():
            return False
        db.execute("INSERT OR IGNORE INTO scout_daily(day) VALUES(?)", (day,))
        return db.execute("UPDATE scout_daily SET reserved=reserved+1 WHERE day=? AND queued+reserved<?",
                          (day, _cap())).rowcount == 1


def _capacity(day):
    with _database() as db:
        usage = db.execute("SELECT queued+reserved FROM scout_daily WHERE day=?", (day,)).fetchone()
        return (usage[0] if usage else 0) < _cap()


def _settle(day, queued):
    with _database() as db:
        db.execute("UPDATE scout_daily SET reserved=MAX(0,reserved-1),queued=queued+? WHERE day=?",
                   (int(queued), day))


def status():
    """Owner diagnostics only; no visitor searches or raw source errors."""
    with _database() as db:
        result = dict(db.execute("SELECT * FROM scout_state WHERE id=1").fetchone())
        result.pop("token", None)
        day = db.execute("SELECT queued,reserved FROM scout_daily WHERE day=?", (_day(time.time()),)).fetchone()
        result.update(enabled=enabled(), interval_hours=6, daily_cap=_cap(),
                      queued_today=day[0] if day else 0, reserved_today=day[1] if day else 0,
                      popularity_basis="museum_selected_highlights",
                      sources=[dict(r) for r in db.execute("SELECT * FROM scout_sources ORDER BY provider")],
                      candidates={r[0]: r[1] for r in db.execute(
                          "SELECT status,COUNT(*) FROM scout_candidates GROUP BY status")})
        return result


def run_once():
    """Bounded free discovery; safe to call hourly and concurrently after restart."""
    if not enabled():
        return {"status": "disabled", "queued": 0}
    now, token = time.time(), secrets.token_hex(16)
    day = _day(now)
    with _database() as db:
        db.execute("BEGIN IMMEDIATE")
        state = db.execute("SELECT * FROM scout_state WHERE id=1").fetchone()
        if state["next_run"] > now:
            return {"status": "waiting", "queued": 0, "next_run": state["next_run"]}
        usage = db.execute("SELECT queued+reserved FROM scout_daily WHERE day=?", (day,)).fetchone()
        if (usage[0] if usage else 0) >= _cap():
            return {"status": "daily_cap", "queued": 0}
        run = state["runs"]
        db.execute("UPDATE scout_state SET next_run=?,last_started=?,last_status='running',last_error='',"
                   "last_queued=0,runs=runs+1,token=? WHERE id=1", (now + INTERVAL, now, token))
    queued, checked, last_error = 0, 0, ""
    try:
        client = _Client()
        for provider in PROVIDERS:
            _refresh(client, provider, now)
        with _database() as db:
            batches = {provider: [dict(r) for r in db.execute(
                "SELECT * FROM scout_candidates WHERE provider=? AND status!='done' AND next_attempt<=? "
                "ORDER BY created,priority,object_id LIMIT ?", (provider, now, MAX_DETAILS))] for provider in PROVIDERS}
        order = PROVIDERS[run % 2:] + PROVIDERS[:run % 2]
        candidates = [batch[index] for index in range(MAX_DETAILS) for provider in order
                      for batch in [batches[provider]] if index < len(batch)][:MAX_DETAILS]
        for candidate in candidates:
            if not enabled() or time.monotonic() >= client.deadline:
                break
            if not _capacity(_day(time.time())):
                break
            provider, oid = candidate["provider"], candidate["object_id"]
            queue_started = False
            try:
                facts = _fetch_facts(client, provider, oid, time.time())
                checked += 1
                # Charge the current UTC day after the request, so a slow
                # response crossing midnight cannot consume yesterday's slots.
                # A crash after queue insertion retains an uncertain slot.
                day = _day(time.time())
                if not _slot(day, token):
                    break
                queue_started = True
                result = gallery_archive.queue_background(facts)
                added = result.get("queued") is True
                _settle(day, added)
                queued += int(added)
                if result.get("reason") == "queue_full":
                    raise SourceError("queue_full")
                with _database() as db:
                    db.execute("UPDATE scout_candidates SET status='done',artifact_id=?,last_error='',updated=? "
                               "WHERE provider=? AND object_id=?",
                               (result.get("artifact_id") or "", time.time(), provider, oid))
            except Exception as exc:
                last_error = _reason(exc) if isinstance(exc, SourceError) or not queue_started else "queue_unavailable"
                attempts = candidate["attempts"] + 1
                with _database() as db:
                    db.execute("UPDATE scout_candidates SET status='retry',attempts=?,next_attempt=?,last_error=?,"
                               "updated=? WHERE provider=? AND object_id=?",
                               (attempts, now + min(7 * 86400, INTERVAL * 2 ** min(attempts - 1, 5)),
                                last_error, time.time(), provider, oid))
        with _database() as db:
            source_failed = db.execute("SELECT COUNT(*) FROM scout_sources WHERE last_error!=''").fetchone()[0]
        outcome = "partial" if source_failed or last_error else "complete"
    except Exception:
        outcome, last_error = "error", "scout_unavailable"
    with _database() as db:
        db.execute("UPDATE scout_state SET last_finished=?,last_status=?,last_error=?,last_queued=? "
                   "WHERE id=1 AND token=?", (time.time(), outcome, last_error, queued, token))
    return {"status": outcome, "queued": queued, "checked": checked, "next_run": now + INTERVAL}
