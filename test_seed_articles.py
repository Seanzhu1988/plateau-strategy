# -*- coding: utf-8 -*-
"""Shipping an article in the code, so a deploy can put it back on the board.

The IP Launchpad proposal was lost when the data disk was being wiped on every
deploy, and recovered from its translations. It now ships in seed_articles.json
and is placed on the board at boot. The rules that keep that from becoming a
nuisance are what this proves:

  * it appears once on a fresh disk;
  * it never duplicates on the next boot;
  * once taken down with the Dispatch delete, it stays down, it does not
    resurrect on the next deploy;
  * it only ever runs where there is a real data disk, never in a working tree
    or a test's board by accident.

    python3 test_seed_articles.py
"""
import json
import os
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                            # noqa: E402

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


HERE = os.path.dirname(os.path.abspath(__file__))
STAMP = json.load(open(os.path.join(HERE, "seed_articles.json")))[0]["stamp"]
TITLE = json.load(open(os.path.join(HERE, "seed_articles.json")))[0]["title"]

print("the seed file is shipped and clean:")
chk("seed_articles.json is committed (a real file)",
    os.path.exists(os.path.join(HERE, "seed_articles.json")))
_seed = json.load(open(os.path.join(HERE, "seed_articles.json")))
chk("it carries at least the IP article", any(s.get("seed_id") == "ip-launchpad"
                                              for s in _seed))
chk("with a fixed stamp so re-seeding is a no-op", bool(STAMP) and len(STAMP) == 14)
chk("and no long dash in the shipped body",
    all("—" not in (s.get("body") or "") for s in _seed))

print("\nit does NOT run locally or in tests (no disk, not on Render):")
# DATA_DIR == BASE_DIR and no RENDER_GIT_COMMIT, so seeding must be a no-op.
tmp = tempfile.mkdtemp()
A.ARTICLES_PATH = os.path.join(tmp, "articles.json")
A.SEED_MARKER_PATH = os.path.join(tmp, "seeded.json")
saved_dir = A.DATA_DIR
saved_render = os.environ.pop("RENDER_GIT_COMMIT", None)
A.DATA_DIR = A.BASE_DIR
A._seed_articles_once()
chk("no board file is written locally", not os.path.exists(A.ARTICLES_PATH))

print("\nbut on Render with no disk yet, it DOES seed (so the article shows):")
# The exact situation behind "I don't see anything": on Render, disk not
# attached, DATA_DIR falls back to BASE_DIR. The paths are pointed at tmp so
# the test does not write into the working tree, but the guard must let it run.
os.environ["RENDER_GIT_COMMIT"] = "deadbeef"
A._seed_articles_once()
chk("the article seeds even with DATA_DIR == BASE_DIR on Render",
    any(a.get("stamp") == STAMP for a in A._load(A.ARTICLES_PATH)))
os.environ.pop("RENDER_GIT_COMMIT", None)
# Reset for the real-disk cases below.
os.remove(A.ARTICLES_PATH)
if os.path.exists(A.SEED_MARKER_PATH):
    os.remove(A.SEED_MARKER_PATH)

print("\non a real disk it seeds exactly once:")
A.DATA_DIR = tmp                         # pretend /var/data
A._seed_articles_once()
board = A._load(A.ARTICLES_PATH)
chk("the article is now on the board", any(a.get("stamp") == STAMP for a in board))
chk("its title is intact", any(a.get("title") == TITLE for a in board))
chk("it is marked as seeded", any(a.get("seeded") for a in board))
n1 = len(board)

A._seed_articles_once()                  # a second boot
board = A._load(A.ARTICLES_PATH)
chk("a second boot adds no duplicate (%d then %d)" % (n1, len(board)),
    len(board) == n1)
chk("still exactly one copy by stamp",
    sum(1 for a in board if a.get("stamp") == STAMP) == 1)

print("\nonce deleted, it stays deleted across the next deploy:")
board = [a for a in A._load(A.ARTICLES_PATH) if a.get("stamp") != STAMP]
A._save(A.ARTICLES_PATH, board)          # the owner presses delete
chk("it is off the board", not any(a.get("stamp") == STAMP for a in A._load(A.ARTICLES_PATH)))
A._seed_articles_once()                  # next deploy boots
chk("and the seed does NOT bring it back (the marker remembers)",
    not any(a.get("stamp") == STAMP for a in A._load(A.ARTICLES_PATH)))

print("\na fresh disk with no marker seeds again (a genuinely new environment):")
tmp2 = tempfile.mkdtemp()
A.DATA_DIR = tmp2
A.ARTICLES_PATH = os.path.join(tmp2, "articles.json")
A.SEED_MARKER_PATH = os.path.join(tmp2, "seeded.json")
A._seed_articles_once()
chk("the article seeds on the new disk",
    any(a.get("stamp") == STAMP for a in A._load(A.ARTICLES_PATH)))

A.DATA_DIR = saved_dir
if saved_render is not None:
    os.environ["RENDER_GIT_COMMIT"] = saved_render
shutil.rmtree(tmp, ignore_errors=True)
shutil.rmtree(tmp2, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
