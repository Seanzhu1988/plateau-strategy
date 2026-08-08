# -*- coding: utf-8 -*-
"""A link shared with friends has two jobs, and this proves both.

The first is that it opens for the people who were sent it and for nobody
else. That half is ordinary.

The second is the half worth having a test for. The page describes automated
trading, and the one promise made to everyone who receives it is that it takes
nothing from them: no money, no bank details, no account. A promise like that
decays — somebody adds a "reserve your spot" button, an email box, a Stripe
link, and the sentence at the top of the page quietly stops being true. So the
assertions below read the served bytes and refuse any form, any payment
element, and any of the phrases that turn a description into an offer.

"Your principal is never at risk" is on that list for a reason. It appears on
the live landing page today, it is not true of any strategy that holds a
position, and it is close enough to the wording used in real enforcement
actions that it must not spread to a new page by copy-and-paste.

    python3 test_share_link.py
"""
import os
import re
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                              # noqa: E402

tmp = tempfile.mkdtemp()
A.SHARE_KEYS_PATH = os.path.join(tmp, "share_keys.json")
A.OWNER_AUTH_PATH = os.path.join(tmp, "owner_auth.json")
A.app.config["TESTING"] = True
os.environ.pop("ROBOT_SHARE_KEY", None)          # exercise the generated key

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


KEY = A._share_key("robot")

print("the key is worth having:")
chk("it is long enough not to be guessed (%d chars)" % len(KEY), len(KEY) >= 16)
chk("it survives a restart", A._share_key("robot") == KEY)
chk("it is not in the repo",
    not os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                    "share_keys.json")))

print("\nwithout the link, there is nothing to find:")
c = A.app.test_client()
r = c.get("/robot")
chk("a bare visit is refused (%d)" % r.status_code, r.status_code == 404)
chk("the refusal says how to get in, not what is inside",
    b"shared by link" in r.get_data().lower() and b"trading" not in r.get_data().lower())
chk("the refusal is not indexable",
    "noindex" in (r.headers.get("X-Robots-Tag") or ""))
r = c.get("/robot?k=" + KEY[:-1] + ("z" if KEY[-1] != "z" else "y"))
chk("a wrong key is refused (%d)" % r.status_code, r.status_code == 404)

print("\nwith the link, a friend gets in and stays in:")
r = c.get("/robot?k=" + KEY)
chk("the key opens it (%d)" % r.status_code, r.status_code in (301, 302))
chk("and the key is dropped from the address bar",
    "?" not in (r.headers.get("Location") or "?"))
r = c.get("/robot")
chk("the next click needs no key (%d)" % r.status_code, r.status_code == 200)
body = r.get_data(as_text=True)
chk("the page is not indexable", "noindex" in (r.headers.get("X-Robots-Tag") or ""))
chk("and is not cached by anything in between",
    "no-store" in (r.headers.get("Cache-Control") or ""))

print("\nthe page takes nothing from the reader:")
low = body.lower()
chk("no form to submit", "<form" not in low)
chk("no input, textarea or select", not re.search(r"<(input|textarea|select)\b", low))
chk("no button", "<button" not in low)
MONEY = ["stripe", "paypal", "square", "checkout", "plaid", "venmo", "cash app",
         "routing number", "account number", "credit card number", "deposit",
         "wire transfer", "invest now", "buy in", "minimum investment"]
hits = [w for w in MONEY if w in low]
chk("nothing that could move money (%s)" % (hits or "clean"), not hits)

print("\nand it does not promise what nobody can promise:")
PROMISES = [
    "principal is never at risk", "principal always protected",
    "principal returns intact", "never at risk", "no risk",
    "guaranteed return", "guaranteed profit", "risk-free", "risk free",
    "never sells at loss", "never sell at a loss", "can't lose", "cannot lose",
]
hits = [p for p in PROMISES if p in low]
chk("no promise of safety (%s)" % (hits or "clean"), not hits)
chk("no monthly return figure (%s)" % (re.findall(r"\d+\s*[-–]?\s*\d*\s*%\s*/?\s*(?:mo|month)", low) or "clean"),
    not re.search(r"\d+\s*[-–]?\s*\d*\s*%\s*/?\s*(?:mo|month)", low))
chk("it says outright that it is not an offer",
    "not an offer" in low)
chk("it says outright that automated trading can lose money",
    "lose money" in low)

print("\nit stays off the map:")
sm = c.get("/sitemap.xml").get_data(as_text=True)
chk("not in the sitemap", "/robot" not in sm)
rb = c.get("/robots.txt").get_data(as_text=True)
chk("not named in robots.txt either — that file is public", "/robot" not in rb)

print("\nonly the owner can read the key back:")
r = c.get("/api/share-links")
chk("a stranger is refused (%d)" % r.status_code, r.status_code == 401)
own = A.app.test_client()
own.post("/api/owner/setup", json={"username": "sean", "password": "hunter22"})
r = own.get("/api/share-links")
chk("the owner gets the link to send (%d)" % r.status_code, r.status_code == 200)
url = (r.get_json()["links"][0] or {}).get("url", "")
chk("and it is the whole link, ready to paste (%s...)" % url[:34],
    url.startswith("http") and url.endswith("/robot?k=" + KEY))

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
