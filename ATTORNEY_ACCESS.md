# Everybody's Business Attorney — what is built, and what must be answered first

A place where attorneys read the business ideas people post and write back a
legal view; that view is locked until it is paid for, so the attorney is paid
fairly. Later, other kinds of writing get the same lock.

The lock is built and tested. **The money is not, and should not be, until the
question in the next section has a lawyer's answer.** This file exists so that
decision is made deliberately rather than discovered later.

---

## The question that decides the architecture

**Washington RPC 5.4(a): a lawyer shall not share legal fees with a
non-lawyer.**

If Plateau Strategy takes a percentage of what an attorney is paid for legal
advice, the rule is aimed at the attorney, not at us. The exposure lands on
their licence. An attorney who understands the rule will decline to
participate; one who does not is being put at risk by our design. Neither is a
business.

Related, and in the same family:

- **RPC 7.2** limits what may be given for recommending a lawyer's services.
- A non-lawyer entity that organises and charges for legal services can be
  found to be practising law without a licence, or running an unregistered
  lawyer referral service.
- Money held on an attorney's behalf raises trust-accounting (IOLTA)
  questions that a Square account does not answer.
- Advice given here is not generic. An answer to *this* person's *specific*
  business forms an attorney-client relationship, which brings conflict
  checking, confidentiality, and malpractice cover with it.

None of this makes the idea unworkable. Platforms in this space exist. They
are structured carefully, and the structure is the product.

### The three shapes, and what each costs

**A. Plateau takes a cut of the legal fee.** Simplest to build, and the one to
avoid. This is the fee-split the rule names.

**B. The reader pays the attorney directly; Plateau charges the attorney a
flat listing or software fee.** The fee is for software and audience, not for
legal work, and it does not vary with what the attorney earns. This is how the
established platforms are built. Costs: we never touch the money, so the
"locked until paid" moment has to be driven by the attorney confirming payment
rather than by our checkout.

**C. Plateau charges the reader a flat platform fee for access to the board,
and attorneys are paid separately.** Keeps our billing simple and never prices
per answer, but it is further from "the attorney gets paid for this answer".

I would put money on **B**, and it is the one this code is shaped for — the
grant step is separate from any checkout precisely so that whoever confirms
payment can be someone other than us. But this is a question for an attorney
in Washington, and it should cost one hour of somebody's time to answer
properly before any payment code is written.

---

## What is built

A general lock on any piece of writing. Nothing in it knows about attorneys —
"other ideas locked too" is the same mechanism, not a second one.

| Endpoint | Who | What |
|---|---|---|
| `POST /api/articles/<id>/lock` | owner | set `price_usd`, `teaser`, `by`; or `unlock_forever` |
| `POST /api/articles/<id>/grant` | owner | give one reader id access |
| `GET /api/articles` | anyone | locked pieces come back as teaser only |

The important property, and the only one worth defending:

> **A locked body is never sent to a reader who has not paid.**

Not hidden with CSS, not removed by a script after render, not present in the
JSON and ignored by the page. The substitution happens in `_public_article`
before the response is written. `test_locked_content.py` asserts it by reading
the raw bytes of the API response and checking the protected sentence does not
appear anywhere in them — because every weaker form of this is defeated by
View Source or the Network tab, and each of those is how real paywalls leak.

A lock also requires a teaser. A price on nothing is not an offer, and a
reader deciding whether to pay is entitled to see the shape of what they are
buying.

---

## What is deliberately NOT built

- **Taking payment.** Blocked on the question above.
- **Attorney accounts and self-service locking.** An attorney locking their
  own answer is the obvious next step and it is the wrong thing to build
  first: whether they are a seller on this platform or a professional whose
  fee never touches it is exactly what shape B versus A decides.
- **Verification that an attorney is real.** A WSBA number in a text field is
  a claim, not a credential. Before anyone pays for advice on this site, the
  bar number needs checking against the WSBA directory, and the jurisdiction
  needs to match the reader's. Publishing unverified legal advice under this
  company's domain is worse than not offering it.
- **Recovering access on a new device.** Entitlement is keyed to the anonymous
  visitor cookie the site already sets. Clear cookies, lose access to
  something paid for. Acceptable while nothing is actually being sold; not
  acceptable the day it is, and the fix is an emailed link rather than an
  account.
- **Disclaimers and engagement terms.** Whether an answer here is legal advice
  or general information changes what has to be said around it, and that text
  should be written by the attorney whose licence it is.

---

## Suggested order

1. One hour with a Washington attorney on RPC 5.4 and the three shapes above.
2. Pick the shape. It decides who charges whom, and everything else follows.
3. WSBA verification before any attorney answer is published.
4. Payment, calling `grant` only after money has settled.
5. Email-based access recovery, at the same time as payment, not after.
