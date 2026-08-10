# -*- coding: utf-8 -*-
"""The idea board is a public write. Prove it stays open AND stays guarded.

Anyone can pitch a business idea with no account, and it publishes straight
away. That openness is the whole point of the board and this test exists to
keep it — the first case here is a stranger posting successfully, and it is
the one that must never start failing in the name of safety.

The rest is the other half. Measured before this test existed, one caller
posted five ideas in a row and every one was accepted, and nothing could take
any of them down afterwards. A public write on a company's own domain needs a
limit loose enough that a person never meets it and tight enough that a script
does, plus a way to remove what should not be there.

    python3 test_idea_board.py
"""
import datetime
import json
import os
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                              # noqa: E402

tmp = tempfile.mkdtemp()
A.ARTICLES_PATH = os.path.join(tmp, "articles.json")
A.OWNER_AUTH_PATH = os.path.join(tmp, "owner_auth.json")
A.app.config["TESTING"] = True

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


def post(c, title, ip="203.0.113.7"):
    return c.post("/api/articles", json={"author": "A Reader", "title": title,
                                         "body": "A idea worth reading."},
                  headers={"X-Forwarded-For": ip})


def public_titles(c):
    return [a["title"] for a in c.get("/api/articles").get_json()["articles"]]


print("anyone can pitch, with no account:")
c = A.app.test_client()
r = post(c, "Mobile EV detailing for gig drivers")
chk("a stranger's idea is accepted (%d)" % r.status_code, r.status_code == 200)
chk("and it is public immediately",
    "Mobile EV detailing for gig drivers" in public_titles(c))

print("\nnothing published leaks the address used to rate-limit:")
a = c.get("/api/articles").get_json()["articles"][0]
chk("no ip field on the public shape (%s)" % sorted(a)[:4], "ip" not in a)

print("\nbut one caller cannot flood it:")
codes = [post(c, "Flood %d" % i).status_code for i in range(2, 7)]
chk("the run is cut off, not all accepted (%s)" % codes, 429 in codes)
chk("the limit bites at the documented hourly figure",
    codes.count(200) == A.IDEA_MAX_PER_HOUR - 1)
r = post(c, "One more")
chk("the refusal explains itself rather than just failing",
    bool((r.get_json() or {}).get("error")))

print("\nand a different person is not punished for it:")
r = post(c, "Someone else entirely", ip="198.51.100.22")
chk("a second address still gets through (%d)" % r.status_code, r.status_code == 200)

print("\nthe owner can take something down, and put it back:")
titles_before = public_titles(c)
bad = c.get("/api/articles").get_json()["articles"][0]["id"]
r = c.post("/api/articles/%s/hide" % bad, json={"hidden": True})
chk("a stranger cannot hide anything (%d)" % r.status_code, r.status_code == 401)

own = A.app.test_client()
own.post("/api/owner/setup", json={"username": "sean", "password": "hunter22"})
r = own.post("/api/articles/%s/hide" % bad, json={"hidden": True})
chk("the owner can (%d)" % r.status_code, r.status_code == 200)
chk("it leaves the public board", len(public_titles(c)) == len(titles_before) - 1)

raw = json.load(open(A.ARTICLES_PATH))
chk("but the text is kept, not destroyed",
    any(x.get("id") == bad for x in raw))

r = own.post("/api/articles/%s/hide" % bad, json={"hidden": False})
chk("and it can be put back (%d)" % r.status_code, r.status_code == 200)
chk("it returns to the public board", len(public_titles(c)) == len(titles_before))

print("\nand delete is the other verb — gone, not archived:")
# Hide preserves the record because a takedown of someone ELSE's post may
# need showing later. Delete is the owner clearing their own drafts, where a
# tombstone serves nobody. Sean's first use: his June test post.
r = c.post("/api/articles/%s/delete" % bad)
chk("a stranger cannot delete (%d)" % r.status_code, r.status_code == 401)
chk("and it survived the attempt",
    any(x.get("id") == bad for x in json.load(open(A.ARTICLES_PATH))))
r = own.post("/api/articles/%s/delete" % bad)
chk("the owner can (%d)" % r.status_code, r.status_code == 200)
chk("it is gone from the file entirely — no tombstone",
    not any(x.get("id") == bad for x in json.load(open(A.ARTICLES_PATH))))
chk("gone from the board", len(public_titles(c)) == len(titles_before) - 1)
chk("its share page is gone too (%d)" % c.get("/idea/%s" % bad).status_code,
    c.get("/idea/%s" % bad).status_code == 404)
chk("and the sitemap no longer names it",
    ("/idea/%s" % bad) not in c.get("/sitemap.xml").get_data(as_text=True))
chk("deleting it twice is a 404, not a success",
    own.post("/api/articles/%s/delete" % bad).status_code == 404)

print("\nthe board draws the delete button for the owner alone:")
lp = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                       "landing-page.html"), encoding="utf-8").read()
chk("the button is gated on the owner check", "__ideaOwner" in lp
    and "ideaDelete" in lp)
chk("and asks before it acts", "confirm(" in lp.split("ideaDelete = ")[1][:400])

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
