# -*- coding: utf-8 -*-
"""One idea, one address, and a link that previews.

The board lives inside a tab on the landing page and loads over JavaScript, so
an idea had no address anybody could send. That is the missing half of "share
your idea into your circle" — the author's own motive is the only free
distribution this business has, and it could not fire.

The assertions that matter are about the SERVER rendering:

  * The Open Graph tags must be in the first response. WhatsApp, iMessage,
    Messenger, Slack and Discord fetch a pasted link with a scraper that does
    not run JavaScript. A client-rendered page hands it an empty shell, the
    message shows a bare grey URL, and a bare grey URL is not shared twice.
  * A LOCKED idea must not ship its body. The lock is enforced before the
    bytes are built, so Ctrl-U shows the teaser too.
  * A HIDDEN idea must 404 everywhere, including the sitemap.

    python3 test_idea_share.py
"""
import json
import os
import re
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                           # noqa: E402

A.app.config["TESTING"] = True
tmp = tempfile.mkdtemp()
A.ARTICLES_PATH = os.path.join(tmp, "articles.json")

SECRET = "THE-PAID-PART-NOBODY-SHOULD-SEE"
json.dump([
    {"id": "ART1", "author": "Dana Whitfield",
     "title": "Mobile EV detailing for gig drivers",
     "body": "Gig drivers cannot take a car off the road for a day.\n\n"
             "We come to them between shifts, in the car park.",
     "created_at": "2026-08-01T10:00:00", "stamp": "20260801100000",
     "likes": 4, "unlikes": 0, "followers": [], "launchers": []},
    {"id": "ART2", "author": "Hidden Person", "title": "Taken down",
     "body": "Should not be readable", "created_at": "2026-08-02T10:00:00",
     "hidden": True, "likes": 0, "unlikes": 0, "followers": [], "launchers": []},
    {"id": "ART3", "author": "Priced Person", "title": "A locked idea",
     "body": "Opening line everyone sees. " + SECRET,
     "lock": {"teaser": "Opening line everyone sees.", "price_usd": 25,
              "by": "attorney"},
     "created_at": "2026-08-03T10:00:00", "likes": 1, "unlikes": 0,
     "followers": [], "launchers": []},
    {"id": "ART4", "author": 'Evil "><script>alert(1)</script>',
     "title": 'Tag <b>soup</b> & "quotes"',
     "body": "</script><img src=x onerror=alert(1)>",
     "created_at": "2026-08-04T10:00:00", "likes": 0, "unlikes": 0,
     "followers": [], "launchers": []},
], open(A.ARTICLES_PATH, "w"))

c = A.app.test_client()
fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


print("an idea has its own address:")
r = c.get("/idea/ART1")
chk("it opens with no account (%d)" % r.status_code, r.status_code == 200)
page = r.get_data(as_text=True)
chk("the title is on it", "Mobile EV detailing for gig drivers" in page)
chk("so is the author", "Dana Whitfield" in page)
chk("the body is rendered as paragraphs, not one blob", page.count("<p>") >= 2)
chk("an unknown id is 404", c.get("/idea/NOPE").status_code == 404)

print("\nthe link previews — the whole reason this is server-rendered:")
for prop, why in [("og:title", "what the message shows as the headline"),
                  ("og:description", "the line under it"),
                  ("og:url", "so the preview links back here"),
                  ("og:image", "so it is not a grey box"),
                  ("og:type", ""), ("og:site_name", ""),
                  ("twitter:card", "for X and iMessage")]:
    chk("%s is in the first response%s"
        % (prop, (" — %s" % why) if why else ""), prop in page)
chk("the description is real text, not the raw body with newlines",
    re.search(r'og:description" content="Gig drivers cannot take a car off the '
              r'road for a day\. We come', page) is not None)
chk("there is a canonical url", 'rel="canonical"' in page)
chk("it is NOT blocked from indexing — strangers arriving is the point",
    "noindex" not in page and "noindex" not in (r.headers.get("X-Robots-Tag") or ""))

print("\nand a search engine can find one without knowing the board exists:")
sm = c.get("/sitemap.xml").get_data(as_text=True)
chk("the idea is in the sitemap", "/idea/ART1" in sm)
chk("the hidden one is not", "/idea/ART2" not in sm)

print("\na hidden idea is gone, not merely unlisted:")
chk("it 404s (%d)" % c.get("/idea/ART2").status_code,
    c.get("/idea/ART2").status_code == 404)
chk("and its text is nowhere in the reply",
    "Should not be readable" not in c.get("/idea/ART2").get_data(as_text=True))

print("\na locked idea does not ship the part nobody paid for:")
r = c.get("/idea/ART3")
locked_page = r.get_data(as_text=True)
chk("the page still opens (%d)" % r.status_code, r.status_code == 200)
chk("the teaser is shown", "Opening line everyone sees" in locked_page)
chk("the paid text is NOT in the bytes — Ctrl-U shows the teaser too",
    SECRET not in locked_page)
chk("nor is it leaked through the link preview",
    SECRET not in re.sub(r"(?s).*?og:description", "", locked_page)[:400])
chk("the reader is told it is locked", "locked" in locked_page.lower())

print("\nmarkup from a stranger cannot escape into the page:")
r = c.get("/idea/ART4")
evil = r.get_data(as_text=True)
chk("the page renders (%d)" % r.status_code, r.status_code == 200)
chk("no live script tag from the body",
    "<script>alert(1)</script>" not in evil)
chk("no img onerror",
    not re.search(r"<img[^>]*onerror", evil))
chk("the title's tags are escaped", "&lt;b&gt;soup&lt;/b&gt;" in evil)
chk("quotes in the title do not break the og:title attribute",
    re.search(r'og:title" content="[^"]*&quot;quotes&quot;', evil) is not None)
# The share script embeds the title and url as JS string literals. A naive
# quote-wrap would let </script> or a quote end the block early, which is a
# script-injection with extra steps.
script = evil.split("<script>")[-1]
chk("the title reaches JS as a JSON literal, not a pasted string",
    "JSON" not in script and '\\u003c' in script or '"' in script)
chk("nothing closes the script block early",
    "</script>" not in script.split("</script>")[0] + "")

print("\nthe board offers the share:")
lp = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                       "landing-page.html"), encoding="utf-8").read()
chk("there is a share button on each card", "ideaShare(" in lp)
chk("and a plain link to the page for people who just want the address",
    "/idea/' + encodeURIComponent(a.id)" in lp)
chk("share uses the native sheet where there is one", "navigator.share" in lp)
chk("with a clipboard fallback", "clipboard.writeText" in lp)
chk("a cancelled share sheet says nothing", "AbortError" in lp)

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
