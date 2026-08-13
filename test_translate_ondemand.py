# -*- coding: utf-8 -*-
"""Translate an article the moment a reader needs it, not a reload later.

The board translated every label on the page when the language switched and
left the articles themselves in English, because a piece only carried a
translation if one had been pre-built. This proves the on-demand path: the
server translates one article into one language on request, hands back a
cached one for free, refuses to leak a locked body, and says so plainly when
there is no translator behind the button instead of failing silent.

    python3 test_translate_ondemand.py
"""
import os
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
os.environ.pop("ANTHROPIC_API_KEY", None)          # default state: no engine
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                                # noqa: E402
import translator as T                                         # noqa: E402

tmp = tempfile.mkdtemp()
A.ARTICLES_PATH = os.path.join(tmp, "articles.json")
A.OWNER_AUTH_PATH = os.path.join(tmp, "owner_auth.json")
A.app.config["TESTING"] = True

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


def post_idea(c, title="A tool I would use every day",
              body="Line one.\nLine two."):
    return c.post("/api/articles", json={"author": "A Reader", "title": title,
                                         "body": body},
                  headers={"X-Forwarded-For": "203.0.113.9"})


c = A.app.test_client()
aid = post_idea(c).get_json()["article"]["id"]

print("validation:")
r = c.post("/api/idea/%s/translate" % aid, json={"lang": "en"})
chk("english is not a translation target (400)", r.status_code == 400)
r = c.post("/api/idea/%s/translate" % aid, json={"lang": "zz"})
chk("an unsupported language is refused (400)", r.status_code == 400)
r = c.post("/api/idea/NOPE/translate", json={"lang": "zh"})
chk("a missing article is 404", r.status_code == 404)

print("no engine configured:")
r = c.post("/api/idea/%s/translate" % aid, json={"lang": "zh"})
j = r.get_json()
chk("reports no_key, does not pretend (200, ok False)",
    r.status_code == 200 and j.get("ok") is False and j.get("reason") == "no_key")

print("engine present, first ask translates:")
_orig_avail, _orig_now = T.available, T.translate_now
T.available = lambda: True
T.translate_now = lambda title, body, lang: {
    "title": "标题", "paras": ["第一行。", "第二行。"], "body": "第一行。\n\n第二行。"}
try:
    r = c.post("/api/idea/%s/translate" % aid, json={"lang": "zh"})
    j = r.get_json()
    chk("returns the translation (ok True)", r.status_code == 200 and j.get("ok") is True)
    chk("translation carries a title and body",
        bool(j.get("translation", {}).get("title")) and
        bool(j.get("translation", {}).get("body")))
finally:
    T.available, T.translate_now = _orig_avail, _orig_now

print("a cached translation is free, no second model call:")
_orig_for = A._translations_for
A._translations_for = lambda title, body: {"zh": {"title": "标题",
                                                  "body": "第一行。\n\n第二行。",
                                                  "paras": ["第一行。", "第二行。"]}}


def _boom(*a, **k):
    raise AssertionError("translate_now must not run when the store already has it")


_orig_now2 = T.translate_now
T.translate_now = _boom
try:
    r = c.post("/api/idea/%s/translate" % aid, json={"lang": "zh"})
    j = r.get_json()
    chk("served from store (ok True, cached True)",
        r.status_code == 200 and j.get("ok") is True and j.get("cached") is True)
finally:
    A._translations_for = _orig_for
    T.translate_now = _orig_now2

print("a locked piece never ships a translation of its body:")
import json as _json                                          # noqa: E402
locked = {"id": "ART_lock1", "author": "Owner", "title": "A locked idea",
          "body": "Secret line one.\nSecret line two.", "likes": 0, "unlikes": 0,
          "lock": {"teaser": "Buy to read", "price_usd": 5, "by": "owner"}}
with open(A.ARTICLES_PATH, "w", encoding="utf-8") as f:
    _json.dump([locked], f)
r = c.post("/api/idea/ART_lock1/translate", json={"lang": "zh"})
chk("a locked article is refused (403)", r.status_code == 403)

print()
if fails:
    print("FAILED: %d" % len(fails))
    sys.exit(1)
print("all good")
