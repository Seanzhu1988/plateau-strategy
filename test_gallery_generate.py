# -*- coding: utf-8 -*-
"""Write a reading of any searched work, on the spot, in the reader's language.

The curated gallery is the few works somebody wrote a guide for by hand. This
proves the moat: a traveller points at a work nobody here has ever written
about, and the server writes them a real reading of it, in their language,
caches it for the next traveller free, refuses arbitrary junk, and says so
plainly when there is no engine behind the button instead of failing silent.

    python3 test_gallery_generate.py
"""
import os
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
os.environ.pop("ANTHROPIC_API_KEY", None)          # default state: no engine
tmp = tempfile.mkdtemp()
os.environ["DATA_DIR"] = tmp                        # store lands in a throwaway dir
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                                # noqa: E402
import gallery_reader as GR                                    # noqa: E402

A.app.config["TESTING"] = True
fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


c = A.app.test_client()
MET = {"title": "Autumn Rhythm", "museum": "The Met, New York",
       "item_number": "57.92", "artist": "Jackson Pollock", "lang": "ko"}

print("validation:")
r = c.post("/api/gallery/generate", json={})
chk("empty body is refused (400 need_work)",
    r.status_code == 400 and r.get_json().get("reason") == "need_work")
r = c.post("/api/gallery/generate", json={"title": "A painting"})
chk("a title with no museum is refused (400)",
    r.status_code == 400 and r.get_json().get("reason") == "need_work")

print("no engine configured:")
r = c.post("/api/gallery/generate", json=MET)
j = r.get_json()
chk("reports no_engine, does not pretend (200, ok False)",
    r.status_code == 200 and j.get("ok") is False and j.get("reason") == "no_engine")

print("search tells the page an engine is missing:")
r = c.get("/api/gallery/search?q=" + "starrynightxyzzy")
chk("search payload carries can_generate False when no key",
    r.get_json().get("can_generate") is False)

print("engine present, first ask writes a reading:")
_avail, _read = GR.available, GR.read_for
GR.available = lambda: True
GR.read_for = lambda facts, lang: {
    "text": "Autumn Rhythm, by Jackson Pollock. It hangs at the Met. " * 8,
    "minutes": 3, "cached": False}
try:
    r = c.post("/api/gallery/generate", json=MET)
    j = r.get_json()
    chk("returns the reading (ok True)", r.status_code == 200 and j.get("ok") is True)
    chk("reading carries text and minutes",
        bool(j.get("text")) and j.get("minutes") == 3 and j.get("cached") is False)
finally:
    GR.available, GR.read_for = _avail, _read

print("a stored reading is free, no second model call:")
# Seed the store the reader reads, then forbid the network. A hit must not call.
key = GR.work_key(MET)
GR._save_store({"by_key": {key: {"ko": {"text": "이미 저장된 해설. " * 20,
                                        "minutes": 3}}}, "spend": {}})
import gallery_reader as _grmod                                # noqa: E402


class _Boom:
    def post(self, *a, **k):
        raise AssertionError("no network call when the store already has it")


_orig_rq, _orig_avail = _grmod.requests, GR.available
_grmod.requests = _Boom()
GR.available = lambda: True
try:
    got = GR.read_for(MET, "ko")
    chk("served from store (cached True, no call)",
        bool(got) and got.get("cached") is True and bool(got.get("text")))
finally:
    _grmod.requests = _orig_rq
    GR.available = _orig_avail

print("the house rule against long dashes is enforced on output:")
chk("em dash, en dash and their doubles are gone",
    "—" not in GR._no_dashes("a — b – c —— d"))

print()
if fails:
    print("FAILED: %d" % len(fails))
    sys.exit(1)
print("all good")
