# -*- coding: utf-8 -*-
"""The Finance tab has to tell the truth about two things: the price and the clock.

The price, because for a week this page quoted $170/year and offered a
30-day free trial for a product that does not exist, with "Principal always
protected" listed as one of its features. The billing behind those buttons had
already been closed server-side on 2026-08-01, so the only thing a visitor
could actually get was "Could not enroll" — the page went on advertising a
purchase that could not happen. Sean's instruction was plain: we are not for
sale for now. These assertions make that structural, so it cannot drift back
by way of a copy-and-paste.

The clock, because a number presented as live has to be one. The debt figure
comes from Treasury's "Debt to the Penny", which is a daily close published a
business day behind, and the page ticks it forward between fetches. Two things
were wrong with that: the ticker discarded the as_of date it was given, so it
started from a stale figure and never caught up, and it ticked at a rate typed
in by hand — the comment beside it said ~$90k/sec while the code did ~$62.5k,
so the two had drifted 44% apart from each other before you even compare them
to the debt.

    python3 test_finance_truth.py
"""
import datetime
import os
import re
import sys

os.environ["DISPATCH_REMINDERS"] = "false"
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import app as A                                              # noqa: E402

A.app.config["TESTING"] = True
fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


page = open(os.path.join(HERE, "landing-page.html"), encoding="utf-8").read()
# Strip HTML comments before reading prose: the removals above left notes
# explaining what used to be here, and those quote the very strings being
# banned. A comment is not something a visitor reads.
prose = re.sub(r"<!--.*?-->", "", page, flags=re.S)

print("nothing on the page can sell the debt product:")
# Checked against the comment-stripped page: the removals left notes naming
# what used to be here, and a note is not a working button. Live JS is not
# inside an HTML comment, so a real openEnroll coming back is still caught.
for frag in ("openEnroll", "submitEnroll", 'id="financeModal"',
             'id="fin_email"', 'class="price-btn"', "price-card best"):
    chk("no %s" % frag, frag not in prose)
chk("no 30-day free trial offered", "free trial" not in prose.lower())
chk("no annual price", "$170" not in prose)
chk("no monthly price", "14.17" not in prose)
chk("it says outright that it is not for sale", "not for sale" in prose.lower())

print("\nand it does not promise what nobody can promise:")
PROMISES = ["principal is never at risk", "principal always protected",
            "principal returns intact", "principal is never spent",
            "no risk", "risk-free", "guaranteed return"]
low = prose.lower()
hits = [p for p in PROMISES if p in low]
chk("no promise of safety (%s)" % (hits or "clean"), not hits)
chk("no monthly return target (%s)"
    % (re.findall(r"\d+\s*[-–]\s*\d+\s*%\s*/?\s*mo", low) or "clean"),
    not re.search(r"\d+\s*[-–]\s*\d+\s*%\s*/?\s*mo", low))
chk("it says trading can lose money", "lose money" in low or "lose" in low)

print("\nthe server refuses to enrol anyone either:")
c = A.app.test_client()
r = c.post("/api/finance/enroll",
           json={"name": "A Visitor", "email": "a@b.com", "plan": "annual"})
chk("a visitor is refused (%d)" % r.status_code, r.status_code == 404)
# Only the text handed to Square, not the whole function: the docstring above
# it quotes the old claim while explaining why the endpoint was closed, and
# that history is worth keeping. What must stay clean is the sentence the
# customer would read on their bill.
src = open(os.path.join(HERE, "app.py"), encoding="utf-8").read()
charge = src.split("square_client.create_charge(", 1)[1].split("with _LOCK:", 1)[0]
charge_live = "\n".join(l for l in charge.splitlines()
                        if not l.strip().startswith("#")).lower()
chk("the charge description carries no guarantee",
    not any(p in charge_live for p in
            ("always protected", "never at risk", "no risk", "guaranteed")))

print("\nthe wish box still works — wanting it is not buying it:")
chk("the interest form is still there", 'id="wish_email"' in page)
r = c.post("/api/finance/wish", json={"email": "someone@example.com"})
chk("and still accepts an email (%d)" % r.status_code, r.status_code == 200)

print("\nthe debt clock's rate is measured, not typed in:")


def rows(pairs):
    return [{"record_date": d, "tot_pub_debt_out_amt": str(v)} for d, v in pairs]


got = A._debt_per_sec(rows([("2026-08-07", 39_000_000_000_000),
                            ("2026-07-08", 38_900_000_000_000)]))
want = 100_000_000_000 / (30 * 86400.0)
chk("a known window gives the right rate (%.0f/sec vs %.0f)" % (got or -1, want),
    got is not None and abs(got - want) < 1)
chk("one row cannot make a rate", A._debt_per_sec(rows([("2026-08-07", 1)])) is None)
chk("a same-day window cannot make a rate",
    A._debt_per_sec(rows([("2026-08-07", 2), ("2026-08-07", 1)])) is None)
chk("a falling window ticks at zero rather than inventing growth",
    A._debt_per_sec(rows([("2026-08-07", 38_000_000_000_000),
                          ("2026-07-08", 39_000_000_000_000)])) == 0.0)

print("\nthe endpoint hands the browser what it needs to be accurate:")


class _Resp(object):
    def __init__(self, payload):
        self._p = payload

    def json(self):
        return self._p


import requests                                              # noqa: E402
_real_get = requests.get
requests.get = lambda *a, **k: _Resp({"data": rows(
    [("2026-08-07", 39_000_000_000_000), ("2026-07-08", 38_900_000_000_000)])})
try:
    A._DEBT_CACHE.update({"amount": None, "ts": 0})
    j = c.get("/api/national-debt").get_json()
finally:
    requests.get = _real_get

chk("it answers ok", j.get("ok") is True)
chk("with the figure (%s)" % j.get("amount"), j.get("amount") == 39_000_000_000_000)
chk("with the date Treasury stamped it (%s)" % j.get("as_of"), j.get("as_of") == "2026-08-07")
chk("and with the measured rate (%s)" % j.get("per_sec"), (j.get("per_sec") or 0) > 0)

print("\nthe page actually uses the date rather than discarding it:")
js = page.split("var segEls", 1)[1].split("</script>", 1)[0]
chk("it reads as_of (it used to fetch it and throw it away)", "d.as_of" in js)
chk("it reads the measured rate", "d.per_sec" in js)
chk("the tick rate is a named constant, not a bare literal",
    "ndPerSec" in js and "7000 + Math.random() * 11000" not in js)
chk("a stale-looking date cannot fast-forward the clock by years",
    "30 * 86400" in js)

print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
