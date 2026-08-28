#!/usr/bin/env python3
"""Build moma.sqlite from MoMA's own open dataset.

    python3 build_moma_index.py            # download, trim, build, verify

WHY THIS SHAPE. MoMA's real API (api.moma.org) is staff and partners only,
but the museum publishes its whole collection on GitHub under CC0: 160,705
works, refreshed automatically (last update checked 2026-08-25), including
the three columns that matter to us: AccessionNumber, ImageURL, and OnView,
where OnView is not a flag but the actual location string, "MoMA, Floor 5,
501". That makes every label number in the building findable by the
Universal Gallery, and it means the museum itself tells us when a painting
moves rooms.

The index is SQLite, committed to the repo, because Render has no persistent
disk and the app must not swallow 160,705 rows into RAM at boot. FTS5 answers
name searches; a plain index answers the label-number lookup that wins every
ranking. The app treats the file as read-only; this script is the only
writer, and CI reruns it weekly so a rehang reaches the site without anyone
remembering to.

Attribution, per MoMA's request: the data is from The Museum of Modern Art
(MoMA) collection dataset, https://github.com/MuseumofModernArt/collection,
CC0. Images are the museum's own media URLs and remain theirs.
"""
import csv
import io
import os
import sqlite3
import sys
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "moma.sqlite")
CSV_URL = ("https://media.githubusercontent.com/media/"
           "MuseumofModernArt/collection/main/Artworks.csv")

# The dataset's commit date, so the site can say how fresh its answer is.
COMMITS_URL = ("https://api.github.com/repos/MuseumofModernArt/collection/"
               "commits?per_page=1&path=Artworks.csv")


def fetch(url):
    req = urllib.request.Request(url, headers={
        "User-Agent": "PlateauStrategy/1.0 (moma index; seanzhu1988115@gmail.com)"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return r.read()


def dataset_date():
    try:
        import json
        d = json.loads(fetch(COMMITS_URL).decode())
        return d[0]["commit"]["author"]["date"][:10]
    except Exception:
        return ""


def main():
    print("downloading Artworks.csv (large; MoMA serves it through LFS)…")
    raw = fetch(CSV_URL)
    print("  %.1f MB" % (len(raw) / 1048576))
    if raw[:12].startswith(b"version http"):
        print("Got an LFS pointer, not the file. The media URL changed; fix CSV_URL.")
        return 1

    tmp = OUT + ".tmp"
    if os.path.exists(tmp):
        os.remove(tmp)
    db = sqlite3.connect(tmp)
    db.executescript("""
        CREATE TABLE works (
            object_id INTEGER PRIMARY KEY,
            title TEXT, artist TEXT, date TEXT,
            accession TEXT, on_view TEXT, image TEXT
        );
        CREATE INDEX idx_accession ON works(accession);
        CREATE VIRTUAL TABLE works_fts USING fts5(
            title, artist, content='works', content_rowid='object_id');
        CREATE TABLE meta (k TEXT PRIMARY KEY, v TEXT);
    """)

    n = kept_img = onview = 0
    reader = csv.DictReader(io.StringIO(raw.decode("utf-8-sig", "replace")))
    rows = []
    for r in reader:
        try:
            oid = int(r.get("ObjectID") or 0)
        except ValueError:
            continue
        if not oid:
            continue
        # The CSV wraps location strings in literal quote characters,
        # '"MoMA, Floor 5, 501"'; strip them or every search result wears them.
        ov = (r.get("OnView") or "").strip().strip('"').strip()
        # ImageURL only for works on view: those are the rows a person standing
        # in the building will pull up, and storing 160,705 long media URLs
        # would triple the file for thumbnails almost nobody requests.
        img = (r.get("ImageURL") or "").strip() if ov else ""
        rows.append((oid,
                     (r.get("Title") or "").strip()[:300],
                     (r.get("Artist") or "").strip()[:200],
                     (r.get("Date") or "").strip()[:60],
                     (r.get("AccessionNumber") or "").strip()[:40],
                     ov[:80], img[:300]))
        n += 1
        if ov:
            onview += 1
        if img:
            kept_img += 1
    db.executemany("INSERT OR REPLACE INTO works VALUES (?,?,?,?,?,?,?)", rows)
    db.execute("INSERT INTO works_fts(rowid, title, artist) "
               "SELECT object_id, title, artist FROM works")
    stamp = dataset_date()
    db.execute("INSERT INTO meta VALUES ('dataset_date', ?)", (stamp,))
    db.execute("INSERT INTO meta VALUES ('rows', ?)", (str(n),))
    db.commit()
    db.execute("INSERT INTO works_fts(works_fts) VALUES ('optimize')")
    db.commit()
    db.close()
    os.replace(tmp, OUT)

    size = os.path.getsize(OUT) / 1048576
    print("built %s: %d works (%d on view, %d with images) · %.1f MB · dataset %s"
          % (os.path.basename(OUT), n, onview, kept_img, size, stamp or "date unknown"))

    # ---- the embarrassment check, on the freshly built file -----------------
    db = sqlite3.connect(OUT)
    row = db.execute("SELECT title, on_view FROM works WHERE accession='472.1941'").fetchone()
    if not row:
        print("VERIFY FAILED: The Starry Night (472.1941) is not in the index.")
        return 1
    print("verify: %s → %s" % (row[0], row[1] or "not on view"))
    hits = db.execute("SELECT count(*) FROM works_fts WHERE works_fts MATCH 'starry'").fetchone()[0]
    print("verify: FTS 'starry' matches %d rows" % hits)
    db.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
