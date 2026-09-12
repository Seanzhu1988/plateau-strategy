"""Read-only, aggregate summaries for the owner's mobile Pulse dashboard.

No worker is started, schema is migrated, source is refreshed, or paid service
is called here. Missing stores are unavailable, not an apparent count of zero.
"""
import contextlib
import datetime
import json
import math
from pathlib import Path
import sqlite3
import unicodedata


PERIODS = (1, 7, 30)
CONVERSIONS = {
    "booking": "bookings", "tour_inquiry": "tour_inquiries",
    "agent_signup": "agent_signups", "driver_signup": "driver_signups",
}
METRICS = ("pageviews", "visits", "visitors", *CONVERSIONS.values())
TEST_QUERIES = {"test", "testing", "zzzqqxnotathing", "asdf", "aaa", "xxx"}
SEARCH_TALLY_LIMIT = 5000
SEARCH_TALLY_BYTES = 4 * 1024 * 1024


def _count(value):
    try:
        number = float(value)
        return max(0, int(number)) if math.isfinite(number) else 0
    except (ValueError, TypeError, OverflowError):
        return 0


def _timestamp(value):
    try:
        number = float(value)
        return number if math.isfinite(number) and number > 0 else None
    except (ValueError, TypeError, OverflowError):
        return None


def _mapping(value):
    return value if isinstance(value, dict) else {}


def _normalize(value):
    return " ".join(unicodedata.normalize("NFKC", str(value or "")).casefold().split())


def _read_json(source):
    if isinstance(source, dict):
        return source, None
    if source is None:
        return None, "missing"
    try:
        with open(source, encoding="utf-8") as stream:
            data = json.load(stream)
        return (data, None) if isinstance(data, dict) else (None, "unavailable")
    except FileNotFoundError:
        return None, "missing"
    except (OSError, ValueError, TypeError):
        return None, "unavailable"


def read_search_log(tally_path, top=60):
    """Read the compact search tally, never the append-only raw search log.

    Missing, malformed or unexpectedly large tallies return None. An existing
    empty object is a valid tally containing zero searches.
    """
    try:
        with open(tally_path, "rb") as stream:
            raw = stream.read(SEARCH_TALLY_BYTES + 1)
        if len(raw) > SEARCH_TALLY_BYTES:
            return None
        tally = json.loads(raw)
        if not isinstance(tally, dict) or len(tally) > SEARCH_TALLY_LIMIT:
            return None
        rows = []
        for record in tally.values():
            if not isinstance(record, dict) or not isinstance(record.get("q"), str):
                return None
            if not record["q"].strip() or len(record["q"]) > 80:
                return None
            for field in ("count", "hits", "misses"):
                value = record.get(field)
                if (isinstance(value, bool) or not isinstance(value, (int, float))
                        or not math.isfinite(value) or value < 0 or value != int(value)):
                    return None
            last = record.get("last", 0)
            if (isinstance(last, bool) or not isinstance(last, (int, float))
                    or not math.isfinite(last) or last < 0):
                return None
            rows.append({"q": record["q"], "count": _count(record["count"]),
                         "hits": _count(record["hits"]), "misses": _count(record["misses"]),
                         "last": last})
    except (OSError, ValueError, TypeError, OverflowError):
        return None
    limit = max(1, min(_count(top), 100))
    rows.sort(key=lambda row: (-row["count"], -row["last"]))
    wanted = sorted((row for row in rows if row["misses"] > 0),
                    key=lambda row: (-row["misses"], -row["count"]))
    return {"searches_total": sum(row["count"] for row in rows), "distinct": len(rows),
            "unanswered": sum(row["misses"] for row in rows),
            "top": rows[:limit], "wanted": wanted[:limit]}


@contextlib.contextmanager
def _readonly_database(filename):
    # mode=ro is intentional: sqlite's ordinary connect creates missing files.
    db = sqlite3.connect(Path(filename).absolute().as_uri() + "?mode=ro", uri=True, timeout=2)
    db.row_factory = sqlite3.Row
    try:
        db.execute("PRAGMA query_only=ON")
        db.execute("BEGIN")
        yield db
    finally:
        db.close()


def traffic_summary(source, days=7, today=None):
    """Daily visitor sums, time comparisons and audience counters, without IDs.

`source` is the existing traffic JSON path or an already-loaded dictionary.
Dates follow the server's traffic-recording calendar, not the phone's clock.
"""
    try:
        days = int(days)
    except (ValueError, TypeError):
        days = 7
    days = days if days in PERIODS else 7
    today = today or datetime.date.today()
    if isinstance(today, datetime.datetime):
        today = today.date()
    now = datetime.datetime.now(datetime.timezone.utc)
    data, reason = _read_json(source)
    available = data is not None and isinstance(data.get("days"), dict)
    if not available and reason is None:
        reason = "unavailable"
    records = _mapping((data or {}).get("days")) if available else {}

    def date_key(offset):
        return (today - datetime.timedelta(days=offset)).isoformat()

    def record(offset):
        return _mapping(records.get(date_key(offset)))

    def visitors(row):
        # Today's anonymous IDs are present; completed days only retain a count.
        if isinstance(row.get("visitor_ids"), list):
            return len(set(str(value) for value in row["visitor_ids"]))
        return _count(row.get("unique_visitors"))

    def window(length, offset=0):
        if not available:
            return dict.fromkeys(METRICS)
        result = dict.fromkeys(METRICS, 0)
        for i in range(offset, offset + length):
            row = record(i)
            result["pageviews"] += _count(row.get("pageviews"))
            result["visits"] += visitors(row)
            for kind, name in CONVERSIONS.items():
                result[name] += sum(_count(n) for n in _mapping(
                    _mapping(row.get("conversions")).get(kind)).values())
        result["visitors"] = result["visits"]
        return result

    def ranked(field, limit=8):
        counts = {}
        for i in range(days):
            for name, value in _mapping(record(i).get(field)).items():
                name = str(name)[:240]
                counts[name] = counts.get(name, 0) + _count(value)
        return [{"name": name, "n": n} for name, n in
                sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:limit] if n]

    dates = []
    for value in records:
        try:
            parsed = datetime.date.fromisoformat(value)
            if parsed <= today and isinstance(records[value], dict):
                dates.append(value)
        except (ValueError, TypeError):
            pass
    first_date = min(dates) if dates else None
    previous_available = bool(available and first_date and first_date <= date_key(days))
    previous_complete = bool(previous_available and first_date <= date_key(days * 2 - 1))
    selected = window(days)
    previous = window(days, days) if previous_available else dict.fromkeys(METRICS)
    comparison = {}
    for name in METRICS:
        current, prior = selected[name], previous[name]
        change = current - prior if current is not None and prior is not None else None
        comparison[name] = {
            "current": current, "previous": prior, "change": change,
            "pct": round(change * 100.0 / prior, 1) if prior and previous_complete else None,
            "comparable": previous_complete,
        }
    daily = [{"date": date_key(i), "pageviews": _count(record(i).get("pageviews")) if available else None,
              "visitors": visitors(record(i)) if available else None}
             for i in reversed(range(days))]
    today_values, week, month = window(1), window(7), window(30)
    return {
        "traffic_available": available, "traffic_reason": reason,
        "period": {
            "days": days, "label": "Today" if days == 1 else "Last %d days" % days,
            "start": date_key(days - 1), "end": date_key(0),
            "previous_start": date_key(days * 2 - 1), "previous_end": date_key(days),
            "visitor_convention": "Daily visitors" if days == 1 else "Visitor-days",
            "note": "Visitors are deduplicated within each day. Return visits on different days count again.",
            "comparison_note": "The current period includes today so far; the previous period uses full days.",
            "calendar": "Site reporting dates",
        },
        "coverage": {"counting_since": first_date, "previous_available": previous_available,
                     "previous_complete": previous_complete},
        "selected": selected, "previous": previous, "comparison": comparison,
        "today": {"pageviews": today_values["pageviews"], "visitors": today_values["visits"]},
        "d7": {"pageviews": week["pageviews"], "visits": week["visits"]},
        "d30": {"pageviews": month["pageviews"], "visits": month["visits"]},
        "channels": ranked("sources"), "pages": ranked("paths"),
        "landings": ranked("landings", 6), "places": ranked("places", 6),
        "languages": ranked("langs"), "devices": ranked("devices"),
        "daily": daily,
        "spark": [_count(record(i).get("pageviews")) if available else None for i in reversed(range(14))],
        "updated_at": now.isoformat(),
    }


def gallery_summary(archive_path, *, can_generate=None, monthly_cap=None,
                    scout_enabled=None, scout_daily_cap=None, discovery_path=None, now=None):
    """Aggregate persisted gallery state; never expose clues, text or tokens.

Configuration booleans/caps are supplied by the caller. Configured means a
writer is configured, not that a credential or provider has been validated.
"""
    now = _timestamp(now) or datetime.datetime.now(datetime.timezone.utc).timestamp()
    date = datetime.datetime.fromtimestamp(now, datetime.timezone.utc)
    configured = can_generate if isinstance(can_generate, bool) else None
    result = {
        "available": False, "reason": "missing",
        "artifacts": None, "written_artifacts": None, "stories": None, "english_stories": None,
        "writing": dict(available=False, pending=None, retry=None, processing=None, backlog=None,
                        complete=None, next_attempt=None, last_story_at=None),
        "research": dict(available=False, pending=None, total=None),
        "generation": {"available": False, "configured": configured,
            "status": "unknown" if configured is None else "configured" if configured else "not_configured",
            "attempted": None, "monthly_cap": _count(monthly_cap) if monthly_cap is not None else None,
            "remaining": None, "month": date.strftime("%Y-%m")},
        "scout": dict(available=False, enabled=scout_enabled if isinstance(scout_enabled, bool) else None,
                      status="unavailable", last_started=None, last_finished=None, next_run=None,
                      queued_today=None, daily_cap=_count(scout_daily_cap) if scout_daily_cap is not None else None,
                      sources=[]),
        "worker": dict(available=False, last_run=None, last_result_at=None, status="unavailable", next_attempt=None),
    }
    try:
        with _readonly_database(archive_path) as db:
            tables = {row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            if {"artifacts", "stories"} <= tables:
                result.update(available=True, reason=None,
                    artifacts=db.execute("SELECT COUNT(*) FROM artifacts").fetchone()[0],
                    written_artifacts=db.execute("SELECT COUNT(DISTINCT artifact_id) FROM stories").fetchone()[0],
                    stories=db.execute("SELECT COUNT(*) FROM stories").fetchone()[0],
                    english_stories=db.execute("SELECT COUNT(*) FROM stories WHERE lang='en'").fetchone()[0])
                result["writing"]["last_story_at"] = _timestamp(db.execute("SELECT MAX(updated) FROM stories").fetchone()[0])
            else:
                result["reason"] = "unavailable"
            if {"writing_queue", "stories"} <= tables:
                # An on-demand story can have completed since the last queue tick.
                # Count actual text as complete without repairing queue rows here.
                rows = db.execute("SELECT CASE WHEN EXISTS (SELECT 1 FROM stories s "
                    "WHERE s.artifact_id=q.artifact_id AND s.lang=q.lang) THEN 'complete' ELSE q.status END status,"
                    "COUNT(*) n FROM writing_queue q GROUP BY 1").fetchall()
                counts = {}
                for row in rows:
                    counts[row[0]] = counts.get(row[0], 0) + row[1]
                writing = result["writing"]
                writing.update(available=True, **{key: counts.get(key, 0) for key in ("pending", "retry", "processing", "complete")})
                writing["backlog"] = sum(n for status, n in counts.items() if status != "complete")
                due = db.execute("SELECT MIN(next_attempt) FROM writing_queue q WHERE status!='complete' "
                    "AND NOT EXISTS(SELECT 1 FROM stories s WHERE s.artifact_id=q.artifact_id AND s.lang=q.lang)").fetchone()[0]
                writing["next_attempt"] = _timestamp(due)
            if "research_queue" in tables:
                counts = {row[0]: row[1] for row in db.execute("SELECT status,COUNT(*) FROM research_queue GROUP BY status")}
                result["research"].update(available=True, total=sum(counts.values()),
                    pending=sum(n for status, n in counts.items() if status not in ("complete", "resolved", "dismissed")))
            if "generation_spend" in tables:
                row = db.execute("SELECT attempted FROM generation_spend WHERE month=?", (date.strftime("%Y-%m"),)).fetchone()
                spent = _count(row[0]) if row else 0
                cap = result["generation"]["monthly_cap"]
                result["generation"].update(available=True, attempted=spent,
                    remaining=max(0, cap - spent) if cap is not None else None)
            if "worker_state" in tables:
                row = db.execute("SELECT until FROM worker_state WHERE name='writing'").fetchone()
                result["worker"]["next_attempt"] = _timestamp(row[0]) if row else None
            if "scout_state" in tables:
                row = db.execute("SELECT last_status,last_started,last_finished,next_run FROM scout_state WHERE id=1").fetchone()
                if row:
                    result["scout"].update(available=True, status=row[0], last_started=_timestamp(row[1]),
                        last_finished=_timestamp(row[2]), next_run=_timestamp(row[3]))
            if "scout_daily" in tables:
                row = db.execute("SELECT queued FROM scout_daily WHERE day=?", (date.strftime("%Y-%m-%d"),)).fetchone()
                result["scout"]["queued_today"] = _count(row[0]) if row else 0
            if "scout_sources" in tables:
                result["scout"]["sources"] = [{
                    "provider": row[0], "last_success": _timestamp(row[1]), "failures": _count(row[2]),
                    "next_attempt": _timestamp(row[3]),
                    "status": "retry" if _count(row[2]) else "ready" if _timestamp(row[1]) else "not_started",
                } for row in db.execute("SELECT provider,last_success,failures,next_attempt FROM scout_sources ORDER BY provider")]
    except (OSError, sqlite3.Error, ValueError, TypeError):
        result["reason"] = "missing" if archive_path is not None and not Path(archive_path).exists() else "unavailable"
    worker, _ = _read_json(discovery_path)
    if worker is not None:
        recorded = _mapping(worker.get("last_gallery_result"))
        attempted_at = _timestamp(worker.get("last_gallery"))
        result_at = _timestamp(recorded.get("at"))
        # The scheduler stamps its attempt before starting any network work.
        # A result from the previous attempt must not look newly completed.
        status = "pending" if attempted_at else "not_started"
        if result_at is not None and (attempted_at is None or result_at >= attempted_at):
            status = str(recorded.get("status") or "unknown")[:80]
        result["worker"].update(available=True, last_run=attempted_at,
            last_result_at=result_at, status=status)
    return result


def search_summary(log_summary, archive_path, *, curated_items=None, n=6, lang="en"):
    """Classify saved search demand using canonical objects and actual stories.

An artist's name is never treated as proof that every work is written. Exact
query/object links win; accession matches never borrow another object's story.
"""
    if not isinstance(log_summary, dict):
        return {"ok": False, "available": False, "canonical_available": False,
                "total": None, "distinct": None, "unanswered": None, "missed": [], "unwritten": []}
    n = max(1, min(_count(n), 30))
    top = [row for row in (log_summary.get("top") or [])[:100] if isinstance(row, dict)]
    wanted = [row for row in (log_summary.get("wanted") or [])[:100] if isinstance(row, dict)]
    result = {"ok": True, "available": True, "canonical_available": False,
        "total": _count(log_summary.get("searches_total")), "distinct": _count(log_summary.get("distinct")),
        "unanswered": _count(log_summary.get("unanswered")), "timeframe": "All recorded searches",
        "missed": [{"q": str(row.get("q") or "")[:80], "n": _count(row.get("misses"))}
                   for row in wanted if _normalize(row.get("q")) and _normalize(row.get("q")) not in TEST_QUERIES][:n],
        "unwritten": []}
    curated = _mapping(curated_items)
    curated = _mapping(curated.get("items", curated))
    curated_queries = {_normalize(row.get(key)) for row in curated.values() if isinstance(row, dict)
                       for key in ("title", "item_number") if row.get(key)}
    try:
        with _readonly_database(archive_path) as db:
            tables = {row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            if not {"artifacts", "stories", "query_artifacts"} <= tables:
                return result
            result["canonical_available"] = True
            for row in top:
                query = _normalize(row.get("q"))[:80]
                if not query or query in TEST_QUERIES or not _count(row.get("hits")):
                    continue
                # Exact accessions override the broader result list a prior
                # search may have returned alongside this particular object.
                matches = db.execute("SELECT a.id,EXISTS(SELECT 1 FROM stories s WHERE s.artifact_id=a.id AND s.lang=?) "
                                     "FROM artifacts a WHERE a.accession=?", (lang, query)).fetchall()
                if not matches:
                    matches = db.execute("SELECT a.id,EXISTS(SELECT 1 FROM stories s WHERE s.artifact_id=a.id AND s.lang=?) "
                        "FROM artifacts a JOIN query_artifacts qa ON qa.artifact_id=a.id WHERE qa.query=?",
                        (lang, query)).fetchall()
                if not matches:
                    tokens = query.split()[:8]
                    where = " AND ".join("instr(a.search_text,?)>0" for _ in tokens)
                    matches = db.execute("SELECT a.id,EXISTS(SELECT 1 FROM stories s WHERE s.artifact_id=a.id AND s.lang=?) "
                        "FROM artifacts a WHERE " + where + " LIMIT 100", [lang] + tokens).fetchall()
                if matches:
                    missing = sum(not record[1] for record in matches)
                    if not missing:
                        continue
                    evidence = "canonical_archive"
                elif query in curated_queries and lang == "en":
                    continue
                else:
                    # Preserve historical successful search demand even if its
                    # old provider record predates the canonical archive.
                    missing, evidence = None, "historical_search_log"
                result["unwritten"].append({"q": str(row.get("q") or "")[:80],
                    "n": _count(row.get("count")), "unwritten_artifacts": missing, "basis": evidence})
                if len(result["unwritten"]) >= n:
                    break
    except (OSError, sqlite3.Error, ValueError, TypeError):
        result["canonical_available"] = False
        result["unwritten"] = []
    return result
