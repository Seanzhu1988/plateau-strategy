"""Durable, source-backed artifact identities and the stories written for them.

Search demand is private. Only actual source objects become artifacts; only
readable stories enter the public archive. SQLite transactions protect both the
archive and paid generation reservations across threads and web workers.
"""
import contextlib
import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import time
import unicodedata
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
import languages

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESEARCH_LIMIT = 1000
RESEARCH_FIELDS = {"historical_context", "research_source_url", "research_provider",
                   "researched_at", "discovery_origin"}
FIELDS = {
    "title": 400, "artist": 400, "date": 120, "museum": 240,
    "source": 240, "item_number": 160, "where": 300, "city": 160,
    "source_url": 1000, "image": 1000, "teaser": 1000,
    "wikidata": 32, "source_object_id": 160, "provider": 100,
    "gallery_key": 160, "audio": 1000, "dataset_date": 100,
    "source_kind": 80, "source_label": 160,
    "medium": 800, "culture": 300, "dimensions": 800, "credit_line": 1000,
    "period": 300, "discovery_origin": 80, "historical_context": 3500,
    "research_source_url": 1000, "research_provider": 160,
}
_MUSEUMS = {
    "the met new york": "met", "the metropolitan museum of art": "met",
    "metropolitan museum of art": "met", "the met": "met",
    "art institute of chicago": "aic", "the art institute of chicago": "aic",
    "museum of modern art": "moma", "the museum of modern art": "moma",
    "moma": "moma", "rijksmuseum": "rijksmuseum", "the rijksmuseum": "rijksmuseum",
    "louvre museum": "louvre", "musée du louvre": "louvre", "the louvre": "louvre",
    "british museum": "british-museum", "the british museum": "british-museum",
}


def normalize(value):
    return " ".join(unicodedata.normalize("NFKC", str(value or "")).casefold().split())


def institution(value):
    normalized = normalize(value)
    alias = re.sub(r"[^\w\s]", "", normalized)
    return _MUSEUMS.get(alias, normalized)


def _url(value):
    try:
        p = urlsplit(str(value or "").strip())
        if p.scheme not in ("http", "https") or not p.hostname or p.username:
            return ""
        query = urlencode(sorted((k, v) for k, v in parse_qsl(p.query, keep_blank_values=True)
                                 if not k.lower().startswith("utm_") and k.lower() not in ("gclid", "fbclid")))
        return urlunsplit((p.scheme, p.netloc.lower(), p.path.rstrip("/"), query, p.fragment))
    except ValueError:
        return ""


def clean_facts(facts):
    row = {k: str(facts[k]).replace("<", "").replace(">", "").strip()[:n]
           for k, n in FIELDS.items() if facts.get(k) is not None}
    row["museum"] = row.get("museum") or row.get("source") or ""
    row["source"] = row.get("source") or row["museum"]
    row["source_url"] = _url(row.get("source_url"))
    row["research_source_url"] = _url(row.get("research_source_url"))
    row["images"] = [str(v)[:1000] for v in (facts.get("images") or [])[:12]]
    for k in ("copyright", "on_view"):
        if isinstance(facts.get(k), bool):
            row[k] = bool(facts[k])
    for k in ("museum_lat", "museum_lon", "catalogue_observed_at", "researched_at"):
        if isinstance(facts.get(k), (int, float)):
            row[k] = facts[k]
    if not row.get("image") and row["images"] and not row.get("copyright"):
        row["image"] = row["images"][0]
    return row


def identities(facts):
    """Prefer a museum accession; titles never override a known object ID."""
    museum = institution(facts.get("museum") or facts.get("source"))
    accession = normalize(facts.get("item_number"))
    result = []
    if museum and museum != "wikidata" and accession:
        result.append("accession:" + museum + ":" + accession)
    if facts.get("source_object_id") and (facts.get("provider") or museum):
        result.append("object:" + museum + ":" + normalize(facts.get("provider") or museum)
                      + ":" + normalize(facts["source_object_id"]))
    if _url(facts.get("source_url")) and facts.get("source_kind") != "catalogue_search":
        result.append("url:" + museum + ":" + _url(facts["source_url"]))
    if re.fullmatch(r"Q[0-9]+", str(facts.get("wikidata") or "")):
        result.append("wikidata:" + museum + ":" + facts["wikidata"])
    if facts.get("gallery_key"):
        result.append("curated:" + facts["gallery_key"])
    if not result and facts.get("title") and museum:
        # Legacy records sometimes have no accession or URL. Preserve them,
        # but use their full descriptive identity rather than title alone.
        result.append("legacy:" + "|".join([museum, normalize(facts.get("title")),
                      normalize(facts.get("artist")), normalize(facts.get("date"))]))
    return result


def path():
    directory = os.environ.get("DATA_DIR", "").strip() or BASE_DIR
    os.makedirs(directory, exist_ok=True)
    return os.path.join(directory, "gallery_archive.sqlite3")


@contextlib.contextmanager
def database():
    db = sqlite3.connect(path(), timeout=20)
    db.row_factory = sqlite3.Row
    try:
        db.execute("PRAGMA busy_timeout=20000")
        db.execute("PRAGMA foreign_keys=ON")
        db.executescript("""
          CREATE TABLE IF NOT EXISTS artifacts (
            id TEXT PRIMARY KEY, facts TEXT NOT NULL, search_text TEXT NOT NULL,
            institution TEXT NOT NULL, accession TEXT NOT NULL,
            first_seen REAL NOT NULL, last_seen REAL NOT NULL,
            demand_count INTEGER NOT NULL DEFAULT 0,
            confirmed_count INTEGER NOT NULL DEFAULT 0);
          CREATE TABLE IF NOT EXISTS identities (
            identity TEXT PRIMARY KEY, artifact_id TEXT NOT NULL REFERENCES artifacts(id));
          CREATE INDEX IF NOT EXISTS identities_artifact ON identities(artifact_id);
          CREATE TABLE IF NOT EXISTS stories (
            artifact_id TEXT NOT NULL REFERENCES artifacts(id), lang TEXT NOT NULL,
            text TEXT NOT NULL, minutes INTEGER NOT NULL, kind TEXT NOT NULL,
            model TEXT, created REAL NOT NULL, updated REAL NOT NULL,
            PRIMARY KEY(artifact_id, lang));
          CREATE INDEX IF NOT EXISTS stories_language ON stories(lang, updated);
          CREATE TABLE IF NOT EXISTS story_research (
            artifact_id TEXT NOT NULL, lang TEXT NOT NULL, source TEXT NOT NULL,
            PRIMARY KEY(artifact_id, lang),
            FOREIGN KEY(artifact_id,lang) REFERENCES stories(artifact_id,lang));
          CREATE TABLE IF NOT EXISTS queries (
            query TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0,
            misses INTEGER NOT NULL DEFAULT 0, last_seen REAL NOT NULL);
          CREATE TABLE IF NOT EXISTS query_artifacts (
            query TEXT NOT NULL, artifact_id TEXT NOT NULL REFERENCES artifacts(id),
            count INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(query, artifact_id));
          CREATE TABLE IF NOT EXISTS generation_leases (
            artifact_id TEXT NOT NULL, lang TEXT NOT NULL, token TEXT NOT NULL,
            expires REAL NOT NULL, PRIMARY KEY(artifact_id, lang));
          CREATE TABLE IF NOT EXISTS generation_spend (
            month TEXT PRIMARY KEY, attempted INTEGER NOT NULL DEFAULT 0);
          CREATE TABLE IF NOT EXISTS imports (name TEXT PRIMARY KEY, signature TEXT NOT NULL);
          CREATE TABLE IF NOT EXISTS legacy_unresolved (
            legacy_key TEXT NOT NULL, lang TEXT NOT NULL, record TEXT NOT NULL,
            PRIMARY KEY(legacy_key, lang));
          CREATE TABLE IF NOT EXISTS writing_queue (
            artifact_id TEXT NOT NULL REFERENCES artifacts(id), lang TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0,
            next_attempt REAL NOT NULL DEFAULT 0, last_reason TEXT NOT NULL DEFAULT '',
            created REAL NOT NULL, PRIMARY KEY(artifact_id, lang));
          CREATE TABLE IF NOT EXISTS writing_requests (
            artifact_id TEXT NOT NULL REFERENCES artifacts(id), lang TEXT NOT NULL,
            requested_at REAL NOT NULL, PRIMARY KEY(artifact_id, lang));
          CREATE TABLE IF NOT EXISTS research_queue (
            id TEXT PRIMARY KEY, dedupe_key TEXT NOT NULL UNIQUE,
            query TEXT NOT NULL, museum TEXT NOT NULL, languages TEXT NOT NULL,
            clues TEXT NOT NULL, label_text TEXT NOT NULL,
            visual_description TEXT NOT NULL DEFAULT '',
            status TEXT NOT NULL DEFAULT 'needs_research',
            first_seen REAL NOT NULL, last_seen REAL NOT NULL,
            sightings INTEGER NOT NULL DEFAULT 1);
          CREATE TABLE IF NOT EXISTS research_settings (
            name TEXT PRIMARY KEY, value TEXT NOT NULL);
          CREATE TABLE IF NOT EXISTS research_usage (
            hour INTEGER NOT NULL, client_hash TEXT NOT NULL,
            attempted INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(hour,client_hash));
          CREATE TABLE IF NOT EXISTS worker_state (name TEXT PRIMARY KEY, until REAL NOT NULL);
        """)
        if "visual_description" not in {r[1] for r in db.execute("PRAGMA table_info(research_queue)")}:
            # Another worker can reach the same migration concurrently. Take
            # the write lock, then recheck before adding the optional column.
            db.execute("BEGIN IMMEDIATE")
            if "visual_description" not in {r[1] for r in db.execute("PRAGMA table_info(research_queue)")}:
                db.execute("ALTER TABLE research_queue ADD COLUMN visual_description TEXT NOT NULL DEFAULT ''")
            db.commit()
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def _search_text(facts):
    return normalize(" ".join(str(facts.get(k) or "") for k in
                     ("title", "artist", "museum", "item_number", "city")))


def _remember(db, facts):
    facts = clean_facts(facts)
    keys = identities(facts)
    if not keys or len(facts.get("title", "")) < 2:
        return None, False
    inst = institution(facts["museum"])
    accession = normalize(facts.get("item_number"))
    found = None
    for key in keys:
        candidate = db.execute("SELECT a.* FROM artifacts a JOIN identities i "
                               "ON i.artifact_id=a.id WHERE i.identity=?", (key,)).fetchone()
        if candidate:
            # A shared secondary Wikidata/URL identifier must never merge two
            # separately accessioned works or works held by different museums.
            if candidate["institution"] != inst and inst and candidate["institution"]:
                continue
            if accession and candidate["accession"] and accession != candidate["accession"]:
                continue
            found = candidate
            break
    now = time.time()
    artifact_id = found["id"] if found else "a_" + hashlib.sha256(keys[0].encode()).hexdigest()[:24]
    is_new = found is None
    if found:
        merged = json.loads(found["facts"])
        # Do not erase a known source URL/photo/curated description with an
        # empty field from a less detailed search provider.
        incoming = {k: v for k, v in facts.items() if v not in (None, "", [])}
        # Research and catalogue refreshes have independent clocks. Updating
        # a room cannot roll back a newer historical source, or prevent fresh
        # research from being attached to an already-known museum object.
        fresh_research = facts.get("researched_at", 0) > merged.get("researched_at", 0)
        if merged.get("researched_at", 0) > facts.get("researched_at", 0):
            incoming = {k: v for k, v in incoming.items() if k not in RESEARCH_FIELDS}
        if merged.get("catalogue_observed_at", 0) > facts.get("catalogue_observed_at", 0):
            # A provider response cached for another query cannot roll back
            # newer catalogue facts. Editorial fields are independently owned.
            incoming = {k: v for k, v in incoming.items()
                        if k in ("gallery_key", "teaser", "audio") or (fresh_research and k in RESEARCH_FIELDS)}
        else:
            if facts.get("copyright"):
                incoming.update(image="", images=[])
            if facts.get("on_view") is False:
                incoming["where"] = facts.get("where") or ""
        merged.update(incoming)
        facts = merged
        db.execute("UPDATE artifacts SET facts=?,search_text=?,last_seen=?,institution=?,accession=? WHERE id=?",
                   (json.dumps(facts, ensure_ascii=False), _search_text(facts), now,
                    inst or found["institution"], accession or found["accession"], artifact_id))
    else:
        db.execute("INSERT INTO artifacts(id,facts,search_text,institution,accession,first_seen,last_seen) "
                   "VALUES(?,?,?,?,?,?,?)", (artifact_id, json.dumps(facts, ensure_ascii=False),
                   _search_text(facts), inst, accession, now, now))
    for key in keys:
        db.execute("INSERT OR IGNORE INTO identities VALUES(?,?)", (key, artifact_id))
    return artifact_id, is_new


def _story_put(db, artifact_id, lang, text, minutes, kind, model="", replace=False):
    now = time.time()
    if replace:
        db.execute("DELETE FROM story_research WHERE artifact_id=? AND lang=?", (artifact_id, lang))
        db.execute("INSERT INTO stories VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(artifact_id,lang) "
                   "DO UPDATE SET text=excluded.text, minutes=excluded.minutes,kind=excluded.kind,"
                   "model=excluded.model,updated=excluded.updated", (artifact_id, lang, text,
                   minutes, kind, model, now, now,))
    else:
        db.execute("INSERT OR IGNORE INTO stories VALUES(?,?,?,?,?,?,?,?)",
                   (artifact_id, lang, text, minutes, kind, model, now, now))


def _signature(files):
    parts = []
    for filename in files:
        try:
            stat = os.stat(filename)
            parts.append("%s:%s:%s" % (filename, stat.st_size, stat.st_mtime_ns))
        except OSError:
            parts.append(filename + ":missing")
    return hashlib.sha256("|".join(parts).encode()).hexdigest()


def sync_sources():
    """Import without deleting either original. Re-run safely when files change."""
    curated = os.path.join(BASE_DIR, "gallery_items.json")
    try:
        with open(curated, encoding="utf-8") as f:
            items = json.load(f).get("items", {})
    except (OSError, ValueError):
        items = {}
    scripts = [os.path.join(BASE_DIR, str(v.get("script") or "")) for v in items.values()]
    sources = [("curated", _signature([curated] + scripts))]
    runtime = os.path.join(os.path.dirname(path()), "gallery_readings_runtime.json")
    sources.append(("legacy:" + runtime, _signature([runtime])))
    shipped_runtime = os.path.join(BASE_DIR, "gallery_readings_runtime.json")
    if shipped_runtime != runtime:
        sources.append(("legacy:" + shipped_runtime, _signature([shipped_runtime])))
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        for name, signature in sources:
            previous = db.execute("SELECT signature FROM imports WHERE name=?", (name,)).fetchone()
            if previous and previous[0] == signature:
                continue
            if name == "curated":
                for key, row in items.items():
                    facts = dict(row, gallery_key=key)
                    artifact_id, _ = _remember(db, facts)
                    if not artifact_id:
                        continue
                    filename = os.path.realpath(os.path.join(BASE_DIR, row.get("script") or ""))
                    allowed = os.path.realpath(os.path.join(BASE_DIR, "gallery_scripts")) + os.sep
                    if not filename.startswith(allowed):
                        continue
                    try:
                        with open(filename, encoding="utf-8") as f:
                            text = f.read().strip()
                    except OSError:
                        continue
                    if text:
                        # Authorship of older files is not asserted to be human;
                        # editorial means site-curated, distinct from on-demand AI.
                        _story_put(db, artifact_id, "en", text, int(row.get("minutes") or 3), "editorial", replace=True)
            else:
                try:
                    with open(name[len("legacy:"):], encoding="utf-8") as f:
                        old = json.load(f)
                except (OSError, ValueError):
                    old = {}
                for key, translations in old.get("by_key", {}).items():
                    for lang, record in translations.items():
                        if not isinstance(record, dict) or not record.get("text"):
                            continue
                        artifact_id, _ = _remember(db, record)
                        if artifact_id:
                            _story_put(db, artifact_id, lang, record["text"],
                                       int(record.get("minutes") or 3), "ai_assisted", "legacy")
                            db.execute("INSERT OR IGNORE INTO identities VALUES(?,?)", ("old:" + key, artifact_id))
                        else:
                            db.execute("INSERT OR REPLACE INTO legacy_unresolved VALUES(?,?,?)",
                                       (key, lang, json.dumps(record, ensure_ascii=False)))
                for month, used in old.get("spend", {}).items():
                    db.execute("INSERT INTO generation_spend VALUES(?,?) ON CONFLICT(month) "
                               "DO UPDATE SET attempted=MAX(attempted,excluded.attempted)",
                               (month, max(0, int(used))))
            db.execute("INSERT OR REPLACE INTO imports VALUES(?,?)", (name, signature))


def remember(facts):
    sync_sources()
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        artifact_id, is_new = _remember(db, facts)
    return {"artifact_id": artifact_id, "new_discovery": is_new}


def research_source(facts):
    """Attribution for supported museum evidence, without republishing excerpts."""
    provider = facts.get("provider")
    oid = str(facts.get("source_object_id") or "")
    if not oid.isdigit():
        return None
    expected = {"aic": "https://www.artic.edu/artworks/" + oid,
                "met": "https://www.metmuseum.org/art/collection/search/" + oid}.get(provider)
    if not expected or _url(facts.get("research_source_url")) != expected:
        return None
    label = "Art Institute of Chicago" if provider == "aic" else "The Metropolitan Museum of Art"
    has_description = provider == "aic" and bool(facts.get("historical_context"))
    return {"label": label, "url": expected,
            "license": "CC BY 4.0" if has_description else "CC0",
            "license_url": "https://creativecommons.org/licenses/by/4.0/" if has_description
                           else "https://creativecommons.org/publicdomain/zero/1.0/",
            "adapted": True}


def queue_background(facts):
    """Queue museum-backed English writing without inventing visitor demand."""
    facts = clean_facts(facts)
    if (not research_source(facts) or not facts.get("title") or
            not facts.get("item_number") or not facts.get("date") or
            not (facts.get("medium") or facts.get("historical_context"))):
        return {"queued": False, "reason": "insufficient_evidence"}
    facts["discovery_origin"] = "museum_highlights"
    sync_sources()
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        if db.execute("SELECT COUNT(*) FROM writing_queue WHERE status!='complete'").fetchone()[0] >= 200:
            return {"queued": False, "reason": "queue_full"}
        artifact_id, _ = _remember(db, facts)
        if db.execute("SELECT 1 FROM stories WHERE artifact_id=? AND lang='en'", (artifact_id,)).fetchone():
            return {"queued": False, "artifact_id": artifact_id, "reason": "cached"}
        inserted = db.execute("INSERT OR IGNORE INTO writing_queue(artifact_id,lang,created) VALUES(?,'en',?)",
                              (artifact_id, time.time())).rowcount
    return {"queued": bool(inserted), "artifact_id": artifact_id,
            "reason": "queued" if inserted else "already_queued"}


def generation_facts(artifact_id):
    """Private persisted research goes to the writer, not the public API."""
    with database() as db:
        row = db.execute("SELECT facts FROM artifacts WHERE id=?", (artifact_id,)).fetchone()
        return dict(json.loads(row[0]), artifact_id=artifact_id) if row else None


def resolve(facts):
    """Find persisted facts. Never let a public generation request insert facts."""
    sync_sources()
    if facts.get("artifact_id"):
        return get_artifact(str(facts["artifact_id"]))
    with database() as db:
        for key in identities(clean_facts(facts)):
            row = db.execute("SELECT artifact_id FROM identities WHERE identity=?", (key,)).fetchone()
            if row:
                return _artifact(db, row[0], "en")
    return None


def provenance(story):
    kind = story["kind"]
    return {"kind": kind, "label": "Provided by us", "publisher": "Plateau Strategy Solution Lab",
            "authoring": "Site-curated editorial story" if kind == "editorial" else "AI-assisted original story",
            "model": story["model"] or None,
            "review_status": "site_curated" if kind == "editorial" else "not_human_reviewed"}


def _story_research(db, artifact_id, lang):
    row = db.execute("SELECT source FROM story_research WHERE artifact_id=? AND lang=?",
                     (artifact_id, lang)).fetchone()
    return json.loads(row[0]) if row else None


def _artifact(db, artifact_id, lang):
    row = db.execute("SELECT * FROM artifacts WHERE id=?", (artifact_id,)).fetchone()
    if not row:
        return None
    facts = json.loads(row["facts"])
    evidence = _story_research(db, artifact_id, lang)
    facts.pop("historical_context", None)
    if not facts.get("source_url"):
        # A catalogue search is clearly labelled; it is not an invented object
        # record URL. Accession provenance remains visible beside the link.
        catalogue = {
            "met": ("https://www.metmuseum.org/art/collection/search", "q"),
            "aic": ("https://www.artic.edu/collection", "q"),
            "moma": ("https://www.moma.org/collection/", "q"),
        }.get(row["institution"])
        if not catalogue and (facts.get("gallery_key") or "").startswith("si-"):
            catalogue = ("https://www.si.edu/search", "edan_q")
        if catalogue:
            facts["source_url"] = catalogue[0] + "?" + urlencode({catalogue[1]: facts.get("item_number") or facts.get("title")})
            facts["source_kind"] = "catalogue_search"
            facts["source_label"] = "Search the museum catalogue"
    stories = db.execute("SELECT lang,kind,model,minutes,updated FROM stories WHERE artifact_id=?",
                         (artifact_id,)).fetchall()
    story = next((s for s in stories if s["lang"] == lang), None)
    queued = db.execute("SELECT status FROM writing_queue WHERE artifact_id=? AND lang=?",
                        (artifact_id, lang)).fetchone()
    community_photos = []
    try:
        import gallery_photos
        community_photos = gallery_photos.list_photos(artifact_id)
    except (ImportError, OSError, sqlite3.Error):
        # A missing optional photo module or unavailable image store must not
        # prevent visitors from reading the original catalogue and its story.
        pass
    return dict(facts, artifact_id=artifact_id, first_discovered_at=row["first_seen"],
                last_seen_at=row["last_seen"], discovery_status="remembered", new_discovery=False,
                written=bool(story), story_available=bool(story), has_narrative=bool(story),
                story_languages=[s["lang"] for s in stories],
                writing_status="complete" if story else (queued[0] if queued else "not_queued"),
                community_photos=community_photos,
                story_url="/api/gallery/artifacts/%s/story?lang=%s" % (artifact_id, lang) if story else None,
                artifact_url="/universal-gallery/artifacts/" + artifact_id,
                provenance=provenance(story) if story else None, research_source=evidence,
                audio=facts.get("audio") if story and story["kind"] == "editorial" and lang == "en" else None,
                stories=[{"lang": s["lang"], "minutes": s["minutes"], "provenance": provenance(s),
                          "url": "/api/gallery/artifacts/%s/story?lang=%s" % (artifact_id, s["lang"])} for s in stories])


def get_artifact(artifact_id, lang="en"):
    sync_sources()
    with database() as db:
        return _artifact(db, artifact_id, lang)


def get_story(artifact_id, lang="en"):
    sync_sources()
    with database() as db:
        story = db.execute("SELECT * FROM stories WHERE artifact_id=? AND lang=?", (artifact_id, lang)).fetchone()
        if not story:
            return None
        facts = json.loads(db.execute("SELECT facts FROM artifacts WHERE id=?", (artifact_id,)).fetchone()[0])
        return {"artifact_id": artifact_id, "lang": lang, "text": story["text"],
                "minutes": story["minutes"], "cached": True, "provenance": provenance(story),
                "audio": facts.get("audio") if story["kind"] == "editorial" and lang == "en" else None,
                "source_url": facts.get("source_url") or None,
                "research_source": _story_research(db, artifact_id, lang)}


def adopt_legacy(facts, old_key, lang):
    """Resolve old entries lacking facts only when their exact old hash matches."""
    sync_sources()
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        row = db.execute("SELECT record FROM legacy_unresolved WHERE legacy_key=? AND lang=?",
                         (old_key, lang)).fetchone()
        if not row:
            return None
        artifact_id, _ = _remember(db, facts)
        if artifact_id:
            record = json.loads(row[0])
            _story_put(db, artifact_id, lang, record["text"], int(record.get("minutes") or 3), "ai_assisted", "legacy")
            db.execute("DELETE FROM legacy_unresolved WHERE legacy_key=? AND lang=?", (old_key, lang))
    return get_story(artifact_id, lang) if artifact_id else None


def _stats(db):
    return {"artifacts": db.execute("SELECT COUNT(*) FROM artifacts").fetchone()[0],
            "written_artifacts": db.execute("SELECT COUNT(DISTINCT artifact_id) FROM stories").fetchone()[0],
            "stories": db.execute("SELECT COUNT(*) FROM stories").fetchone()[0],
            "discoveries": db.execute("SELECT COUNT(*) FROM artifacts WHERE demand_count>0").fetchone()[0]}


def enrich(rows, q="", lang="en", count=True):
    sync_sources()
    q = normalize(q)[:80]
    out, ordered, new_ids = [], [], set()
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        for row in rows:
            # Search snapshots are pointers to saved artifacts, not new
            # catalogue observations. Reimporting them would overwrite a
            # fresh source row with the old metadata loaded before search.
            artifact_id, is_new = None, False
            if row.get("artifact_id"):
                found = db.execute("SELECT id FROM artifacts WHERE id=?", (row["artifact_id"],)).fetchone()
                artifact_id = found[0] if found else None
            elif row.get("gallery_key"):
                found = db.execute("SELECT artifact_id FROM identities WHERE identity=?",
                                   ("curated:" + row["gallery_key"],)).fetchone()
                artifact_id = found[0] if found else None
            if not artifact_id:
                artifact_id, is_new = _remember(db, row)
            if not artifact_id:
                continue
            if artifact_id not in ordered:
                ordered.append(artifact_id)
            if is_new:
                new_ids.add(artifact_id)
        # Render after all genuine source merges, so every duplicate refers
        # to the final facts regardless of provider/ranking order.
        for artifact_id in ordered:
            is_new = artifact_id in new_ids
            result = _artifact(db, artifact_id, lang)
            result.update(new_discovery=is_new, discovery_status="new" if is_new else "remembered")
            out.append(result)
            if count:
                db.execute("UPDATE artifacts SET demand_count=demand_count+1 WHERE id=?", (artifact_id,))
                if q:
                    db.execute("INSERT INTO query_artifacts VALUES(?,?,1) ON CONFLICT(query,artifact_id) "
                               "DO UPDATE SET count=count+1", (q, artifact_id))
                if "en" not in result["story_languages"] and any(not key.startswith("legacy:") for key in identities(result)):
                    db.execute("INSERT OR IGNORE INTO writing_queue(artifact_id,lang,created) VALUES(?,'en',?)",
                               (artifact_id, time.time()))
        if q and count:
            db.execute("INSERT INTO queries VALUES(?,1,?,?) ON CONFLICT(query) DO UPDATE SET "
                       "count=count+1,misses=misses+excluded.misses,last_seen=excluded.last_seen",
                       (q, int(not out), time.time()))
        stats = _stats(db)
    return {"results": out, "stats": stats, "new_discoveries": sum(r["new_discovery"] for r in out)}


def search_known(q, limit=16, lang="en"):
    sync_sources()
    q = normalize(q)[:80]
    tokens = q.split()[:8]
    if not tokens:
        return []
    with database() as db:
        # Tokens use instr rather than LIKE, so % and _ remain literal.
        where = " AND ".join("instr(search_text,?)>0" for _ in tokens)
        rows = db.execute("SELECT DISTINCT a.id FROM artifacts a LEFT JOIN query_artifacts qa "
                          "ON qa.artifact_id=a.id AND qa.query=? WHERE (" + where + ") OR qa.query=? "
                          "ORDER BY CASE WHEN a.accession=? THEN 0 ELSE 1 END, "
                          "EXISTS(SELECT 1 FROM stories s WHERE s.artifact_id=a.id AND s.lang=?) DESC, "
                          "demand_count DESC,last_seen DESC LIMIT ?",
                          [q] + tokens + [q, q, lang, max(1, min(int(limit), 100))]).fetchall()
        return [_artifact(db, row[0], lang) for row in rows]


def archive(q="", lang="en", page=1, per_page=24):
    sync_sources()
    page, per_page = max(1, min(int(page), 10000)), max(1, min(int(per_page), 48))
    tokens = normalize(q)[:80].split()[:8]
    where, args = "s.lang=?", [lang]
    for token in tokens:
        where += " AND instr(a.search_text,?)>0"
        args.append(token)
    with database() as db:
        total = db.execute("SELECT COUNT(*) FROM artifacts a JOIN stories s ON s.artifact_id=a.id WHERE " + where, args).fetchone()[0]
        rows = db.execute("SELECT a.id FROM artifacts a JOIN stories s ON s.artifact_id=a.id WHERE " + where
                          + " ORDER BY s.updated DESC,a.id LIMIT ? OFFSET ?", args + [per_page, (page-1)*per_page]).fetchall()
        return {"ok": True, "items": [_artifact(db, r[0], lang) for r in rows], "total": total,
                "page": page, "has_more": page*per_page < total, "lang": lang, "stats": _stats(db)}


def confirm(artifact_id, lang="en"):
    if lang not in languages.CODES:
        raise ValueError("Unsupported story language")
    sync_sources()
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        if not db.execute("SELECT 1 FROM artifacts WHERE id=?", (artifact_id,)).fetchone():
            return None
        db.execute("UPDATE artifacts SET confirmed_count=confirmed_count+1,last_seen=? WHERE id=?", (time.time(), artifact_id))
        if not db.execute("SELECT 1 FROM stories WHERE artifact_id=? AND lang=?", (artifact_id, lang)).fetchone():
            now = time.time()
            db.execute("INSERT INTO writing_queue(artifact_id,lang,created) VALUES(?,?,?) "
                       "ON CONFLICT(artifact_id,lang) DO UPDATE SET status=CASE "
                       "WHEN status='complete' THEN 'pending' ELSE status END", (artifact_id, lang, now))
            db.execute("INSERT OR IGNORE INTO writing_requests VALUES(?,?,?)", (artifact_id, lang, now))
        return _artifact(db, artifact_id, lang)


class ResearchQueueFull(Exception):
    """Keep existing discoveries intact when the private research inbox is full."""


def allow_research_attempt(client_address):
    """Count every attempt, including invalid bodies, without retaining an IP.

    The server's secret salt and hour form an unlinkable per-hour client key.
    Old counters expire after 24 hours, and transactions prevent racing limits.
    """
    try:
        limit = max(1, min(int(os.environ.get("GALLERY_RESEARCH_HOURLY_LIMIT", "12")), 1000))
    except (TypeError, ValueError):
        limit = 12
    hour = int(time.time() // 3600)
    address = str(client_address or "unknown")[:256]
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        db.execute("INSERT OR IGNORE INTO research_settings VALUES('client_salt',?)", (secrets.token_hex(32),))
        salt = db.execute("SELECT value FROM research_settings WHERE name='client_salt'").fetchone()[0]
        client_hash = hmac.new(salt.encode(), (str(hour) + "|" + address).encode(), hashlib.sha256).hexdigest()
        db.execute("DELETE FROM research_usage WHERE hour<=?", (hour - 24,))
        row = db.execute("SELECT attempted FROM research_usage WHERE hour=? AND client_hash=?",
                         (hour, client_hash)).fetchone()
        attempted = row[0] if row else 0
        db.execute("INSERT INTO research_usage VALUES(?,?,1) ON CONFLICT(hour,client_hash) "
                   "DO UPDATE SET attempted=MIN(attempted+1,?)", (hour, client_hash, limit + 1))
        return attempted < limit


def _research_text(value, limit):
    if not isinstance(value, str):
        return ""
    value = unicodedata.normalize("NFKC", value[:limit * 2])
    value = "".join(c for c in value if c in "\n\t" or not unicodedata.category(c).startswith("C"))
    value = re.sub(r"[<>]", "", value).replace("\u2014", ",").replace("\u2013", ",")
    return " ".join(value.split())[:limit]


def save_research(query, museum="", lang="en", candidate_clues=None, label_text="", visual_description=""):
    """Keep unverified textual clues privately, never publish an invented work.

    No photographs, file names, source URLs or visitor identifiers are accepted.
    Repeat submissions update demand and requested languages, not public facts.
    """
    if lang not in languages.CODES:
        raise ValueError("Unsupported story language")
    query, museum = _research_text(query, 240), _research_text(museum, 240)
    label_text = _research_text(label_text, 1200)
    visual_description = _research_text(visual_description, 1200)
    fields = {"title": 240, "artist": 240, "museum": 240, "item_number": 160,
              "query": 240, "confidence": 20, "reason": 500}
    clues = []
    for clue in (candidate_clues if isinstance(candidate_clues, list) else [])[:3]:
        if not isinstance(clue, dict):
            continue
        clean = {key: _research_text(clue.get(key), limit) for key, limit in fields.items()}
        clean = {key: value for key, value in clean.items() if value}
        if clean.get("confidence") not in (None, "low", "medium", "high"):
            clean.pop("confidence", None)
        if any(clean.get(key) for key in ("title", "query", "item_number")):
            clues.append(clean)
    if not query:
        query = next((c.get("query") or " ".join(c.get(k, "") for k in
                     ("title", "artist", "item_number")).strip() for c in clues), "")[:240]
    if not query:
        query = label_text[:240]
    description_only = not query and len(normalize(visual_description)) >= 20
    if description_only:
        query = "Unidentified artifact"
    if len(normalize(query)) < 2:
        raise ValueError("Add an artifact name, label text, or useful search clue")
    if not museum:
        museum = next((c["museum"] for c in clues if c.get("museum")), "")
    # A generic display title is not an identity. Different unidentified
    # objects remain separate research drafts even at the same museum.
    identity = "visual:" + normalize(visual_description) if description_only else normalize(query)
    key = identity + "|" + institution(museum)
    research_id = "r_" + hashlib.sha256(key.encode()).hexdigest()[:24]
    now = time.time()
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        previous = db.execute("SELECT * FROM research_queue WHERE dedupe_key=?", (key,)).fetchone()
        if previous:
            requested = list(dict.fromkeys(json.loads(previous["languages"]) + [lang]))
            visual_description = previous["visual_description"] or visual_description
            db.execute("UPDATE research_queue SET last_seen=?,sightings=sightings+1,languages=?,"
                       "visual_description=? WHERE id=?",
                       (now, json.dumps(requested), visual_description, previous["id"]))
            research_id, duplicate = previous["id"], True
        else:
            if db.execute("SELECT COUNT(*) FROM research_queue").fetchone()[0] >= RESEARCH_LIMIT:
                raise ResearchQueueFull("The research inbox is full. Please try again later")
            db.execute("INSERT INTO research_queue(id,dedupe_key,query,museum,languages,clues,label_text,"
                       "visual_description,first_seen,last_seen) VALUES(?,?,?,?,?,?,?,?,?,?)",
                       (research_id, key, query, museum, json.dumps([lang]),
                        json.dumps(clues, ensure_ascii=False), label_text, visual_description, now, now))
            duplicate = False
    return {"id": research_id, "status": "needs_research", "saved": True, "duplicate": duplicate,
            "visual_description": visual_description,
            "message": "Saved for research. The artifact has not been verified and no story has been published."}


def reserve(artifact_id, lang, cap):
    """Reserve before a paid request. Failed attempts also count toward budget."""
    import secrets
    sync_sources()
    now, month = time.time(), time.strftime("%Y-%m", time.gmtime())
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        if db.execute("SELECT 1 FROM stories WHERE artifact_id=? AND lang=?", (artifact_id, lang)).fetchone():
            return {"status": "cached"}
        db.execute("DELETE FROM generation_leases WHERE expires<?", (now,))
        if db.execute("SELECT 1 FROM generation_leases WHERE artifact_id=? AND lang=?", (artifact_id, lang)).fetchone():
            return {"status": "in_progress"}
        row = db.execute("SELECT attempted FROM generation_spend WHERE month=?", (month,)).fetchone()
        if (row[0] if row else 0) >= cap:
            return {"status": "monthly_limit"}
        token = secrets.token_hex(16)
        db.execute("INSERT INTO generation_leases VALUES(?,?,?,?)", (artifact_id, lang, token, now+180))
        db.execute("INSERT INTO generation_spend VALUES(?,1) ON CONFLICT(month) DO UPDATE SET attempted=attempted+1", (month,))
        return {"status": "reserved", "token": token}


def finish(artifact_id, lang, token, text=None, minutes=3, model="", research=None):
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        lease = db.execute("SELECT token FROM generation_leases WHERE artifact_id=? AND lang=?", (artifact_id, lang)).fetchone()
        if not lease or lease[0] != token:
            return False
        if text:
            existed = db.execute("SELECT 1 FROM stories WHERE artifact_id=? AND lang=?",
                                  (artifact_id, lang)).fetchone()
            _story_put(db, artifact_id, lang, text, minutes, "ai_assisted", model)
            if not existed and research:
                # Credit the exact evidence used by this generation, never
                # newer artifact facts attached after this story was written.
                db.execute("INSERT OR IGNORE INTO story_research VALUES(?,?,?)",
                           (artifact_id, lang, json.dumps(research, ensure_ascii=False)))
            db.execute("UPDATE writing_queue SET status='complete',last_reason='' WHERE artifact_id=? AND lang=?",
                       (artifact_id, lang))
        db.execute("DELETE FROM generation_leases WHERE artifact_id=? AND lang=? AND token=?", (artifact_id, lang, token))
        return True


def queue_status(limit=30):
    """Owner-only inbox with submitted research clues, never visitor identities."""
    sync_sources()
    with database() as db:
        counts = {row[0]: row[1] for row in db.execute("SELECT status,COUNT(*) FROM writing_queue GROUP BY status")}
        rows = db.execute("SELECT q.*,a.facts FROM writing_queue q JOIN artifacts a ON a.id=q.artifact_id "
                          "ORDER BY q.created DESC LIMIT ?", (max(1, min(limit, 100)),)).fetchall()
        research_counts = {row[0]: row[1] for row in db.execute("SELECT status,COUNT(*) FROM research_queue GROUP BY status")}
        research_rows = db.execute("SELECT * FROM research_queue ORDER BY last_seen DESC,id LIMIT ?",
                                   (max(1, min(limit, 100)),)).fetchall()
        return {"counts": counts, "items": [{"artifact_id": r["artifact_id"],
                "title": json.loads(r["facts"]).get("title"), "lang": r["lang"],
                "status": r["status"], "attempts": r["attempts"], "last_reason": r["last_reason"],
                "next_attempt": r["next_attempt"]} for r in rows],
                "research": {"counts": research_counts, "capacity": RESEARCH_LIMIT,
                    "items": [{"id": r["id"], "status": r["status"], "query": r["query"],
                               "museum": r["museum"], "languages": json.loads(r["languages"]),
                               "candidate_clues": json.loads(r["clues"]), "label_text": r["label_text"],
                               "visual_description": r["visual_description"],
                               "first_seen": r["first_seen"], "last_seen": r["last_seen"],
                               "sightings": r["sightings"]} for r in research_rows]}}


def process_next():
    """One source-backed guide per hour, across processes; failed jobs back off.

    Called by the existing discovery worker, never by search itself. A missing
    engine leaves the queue intact for the next configured run.
    """
    import gallery_reader
    if not gallery_reader.available():
        return {"status": "no_engine"}
    sync_sources()
    now = time.time()
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        gate = db.execute("SELECT until FROM worker_state WHERE name='writing'", ()).fetchone()
        if gate and gate[0] > now:
            return {"status": "waiting"}
        # A crashed worker's job becomes retryable; the model lease has its own
        # shorter expiration so recovery cannot launch concurrent paid calls.
        db.execute("UPDATE writing_queue SET status='retry' WHERE status='processing' AND next_attempt<?", (now,))
        db.execute("UPDATE writing_queue SET status='complete' WHERE EXISTS "
                   "(SELECT 1 FROM stories s WHERE s.artifact_id=writing_queue.artifact_id AND s.lang=writing_queue.lang)")
        job = db.execute("SELECT q.* FROM writing_queue q JOIN artifacts a ON a.id=q.artifact_id "
                         "LEFT JOIN writing_requests r ON r.artifact_id=q.artifact_id AND r.lang=q.lang "
                         "WHERE q.status IN ('pending','retry') AND q.next_attempt<=? "
                         "ORDER BY CASE WHEN r.requested_at IS NOT NULL THEN 0 ELSE 1 END, "
                         "a.confirmed_count DESC,r.requested_at,a.demand_count DESC,q.created LIMIT 1", (now,)).fetchone()
        if not job:
            return {"status": "idle"}
        artifact_id, lang = job["artifact_id"], job["lang"]
        db.execute("INSERT OR REPLACE INTO worker_state VALUES('writing',?)", (now + 3600,))
        db.execute("UPDATE writing_queue SET status='processing',attempts=attempts+1,next_attempt=? "
                   "WHERE artifact_id=? AND lang=?", (now+3600, artifact_id, lang))
    facts = get_artifact(artifact_id, lang)
    try:
        result = gallery_reader.read_for(facts, lang)
    except Exception:
        result = {"reason": "failed"}
    attempts = job["attempts"] + 1
    with database() as db:
        db.execute("BEGIN IMMEDIATE")
        # Only durable text completes a job. A response lost before saving is
        # retryable, and a concurrent successful visitor request wins a race
        # against this worker's failed or in-progress response.
        success = bool(db.execute("SELECT 1 FROM stories WHERE artifact_id=? AND lang=?",
                                  (artifact_id, lang)).fetchone())
        reason = "" if success else (result or {}).get("reason", "failed")
        status = "complete" if success else "retry"
        delay = 86400 if reason == "monthly_limit" else min(86400, 3600 * 2 ** min(attempts, 5))
        db.execute("UPDATE writing_queue SET status=?,last_reason=?,next_attempt=? WHERE artifact_id=? AND lang=?",
                   (status, reason, time.time()+delay, artifact_id, lang))
    return {"status": status, "artifact_id": artifact_id, "reason": reason}
