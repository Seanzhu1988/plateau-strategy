# The bot lab

**Status: built, switched off, not cleared.** Nothing in here runs on the live
site. It is in the repository so it is not lost and so a lawyer can read it,
and it stays dark until somebody sets an environment variable on purpose.

---

## THE HARD CONSTRAINT: we hold no keys

Decided by Sean, 2026-08-08. Write it down here because it is the kind of
constraint that gets built over by someone who never heard it said.

> **This system never stores, receives, or transmits another person's exchange
> API key, OAuth token, or any other credential to their money.**

The key still has to exist — Coinbase will not accept an order without one.
The constraint is about *where it lives*: on the user's own machine, never on
ours. Automated trading still works exactly the same; we are simply not the
custodian.

**The shape that satisfies this** — a local agent:

```
their machine                          our server
┌──────────────────────┐
│ their exchange key   │ ── asks ──▶  "what is the signal?"
│ (never leaves)       │ ◀── reply ──  (the strategy lives here)
│ small local agent    │
│ places the order     │ ── reports ─▶ ledger: {strategy, pnl_usd}
└──────────────────────┘
```

The agent is deliberately stupid: ask, execute, report. It carries no
strategy, so it does not matter if a user reads every line of it. The strategy
never leaves our server; their credential never arrives at it.

**What this buys, and what it does not.** It removes the custody question
entirely, removes the breach exposure (there is nothing of theirs to steal),
and removes a large amount of engineering that would otherwise be mandatory:
encryption at rest, key-scope verification, rotation, revocation, breach
response. None of that has to be built correctly if the asset is never held.

It does **not** answer the adviser question. If the agent auto-executes, the
user is not deciding each trade — software is, on our instruction, and that is
still arguably discretionary. Not holding keys removes the sharpest edge; it
does not remove the need for the legal answer below.

**The cost, which users must be told:** the agent has to be running to trade.
That means their own always-on machine — a small VPS in their name, or a Pi at
home. A laptop that sleeps will miss trades. They own the box, the key, and
the uptime.

**So: any future design that asks a user to paste an API key into this site,
or connects their exchange account via OAuth to our server, contradicts this
decision.** Do not build it without Sean saying so explicitly and in writing.

---

## What it does today

- Accounts that **only the owner can create**. No signup, no password reset, no
  recovery link, no invite. If someone asks for access, the answer comes from
  Sean or it does not come.
- A **locked registry** of venues and strategies. Kalshi is locked. `farm` and
  `limit_order` are locked.
- A **ledger** of completed paper trades, which is the plug point for a bot.
- A page at `/lab` showing what is open, what is not, why, and how far a
  strategy is from qualifying.

## What it does not do, and has no code to do

It does not place an order, connect to an exchange, hold an API key, read a
balance, or move a dollar in any direction. Not "disabled" — absent. The live
execution path has not been written, because the question of whether it may
exist has not been answered.

---

## The switches

| Variable | Effect when unset |
|---|---|
| `BOT_LAB_ENABLED` | Every lab route answers **404**. The lab does not exist. |
| `BOT_LAB_LIVE_OK` | No live execution. |
| `BOT_LAB_ATTORNEY_CLEARED` | No live execution. |

All three must be set for `live_execution_allowed()` to return true, and even
then there is no code behind it. `404` rather than `401` is deliberate: a
refusal tells a stranger there is something worth finding.

**To turn the lab on** (only when you mean to): set `BOT_LAB_ENABLED=1` in
Render and redeploy. To turn it off, remove it. Nothing else changes.

---

## Issuing access

These accounts are **not** the lab's property — `/robot` uses them too, so
minting and sign-in deliberately sit outside `BOT_LAB_ENABLED`. Otherwise
switching the lab off would lock people out of an unrelated page.

```
POST /api/access/users       {"username": "friend1", "note": "optional"}
→ {"password": "cedar-yonder-fjord-anchor-997"}

POST /api/access/login       {"username": "...", "password": "..."}
POST /api/access/logout
```

Owner-authenticated. The password is **generated, not chosen**, shown **once**,
and stored only as a PBKDF2 hash — nobody can read it back, including you.
Lost means reissue. That is the correct recovery story for a system with no
reset: the alternative is a route that can be tricked.

Four words and a number, so it can be read down a phone without spelling every
character.

```
POST /api/access/users/<username>/revoke   {"revoked": true}
```

## Wiring a bot

The lab does not run a bot. It keeps the record one produces.

```
POST /api/lab/fills
{"strategy": "farm", "pnl_usd": -12.40, "note": "optional"}
```

Every fill is recorded as `paper`. A caller asking for `"mode": "live"` is
ignored, not obeyed. An unknown strategy is rejected rather than silently
created. **Post the losses too** — a bot that reports only its winners builds a
record that unlocks something it should not.

## Unlocking

Two independent keys, and neither works alone:

1. **The record clears the bar** — at least 200 fills, spanning at least 90
   days, net positive after costs (`bot_lab.UNLOCK_RULE`).
2. **The owner then flips it by hand** — `POST /api/lab/locks/strategy/<key>`.

Locking is always allowed without conditions. Shutting something off should
never be the hard direction.

**Kalshi cannot be unlocked this way at all.** It is marked `hard`, because it
is not locked for want of a record — it was losing money. Reopening it means
editing the code deliberately, which is the point.

---

## The legal question — open

The blocking question, in one sentence:

> May software we control place orders in an account belonging to somebody
> other than us?

Everything else follows from the answer. Some notes for the conversation, from
an engineer, not a lawyer:

- **Discretion is the regulated act, not custody.** Placing orders in another
  person's account is discretionary trading authority over it. "We never touch
  the funds" answers a different question (custody) with its own separate rules.
  Both need answering; neither answers the other.
- **Compensation is the hinge.** The federal adviser definition and Washington's
  both turn on being in the business of advising *for compensation*. Genuinely
  free is the strongest fact we have. It is also fragile: compensation is read
  broadly, and "free now, priced later" tends to collapse it.
- **A disclaimer is not a shield.** Advisers Act §215, Exchange Act §29(a) and
  Securities Act §14 void agreements purporting to waive compliance. Fraud
  cannot be disclaimed. Disclosures are worth writing and are written into
  `/lab` — but if the safety of the plan rests on them, the plan has no safety.
  This matters because "no liabilities or obligations from our side" was the
  original instruction, and it is the part that does the least work.
- **Kalshi is CFTC territory.** Event contracts raise commodity-trading-advisor
  questions separate from the securities ones.
- **API keys with withdrawal permission are effectively custody**, which is a
  much larger undertaking than discretion. Trade-only keys are still a serious
  secret to hold on someone's behalf.

### To ask, in one paid hour

1. Does a free automated bot trading in others' accounts make us an investment
   adviser under the Advisers Act, or under RCW 21.20?
2. Do trade-only exchange API keys constitute custody?
3. Does trading event contracts for others trigger CTA registration?
4. Is the no-compensation position durable if we intend to charge later?
5. What must be disclosed, what cannot be disclaimed, and what should the user
   agreement actually say?
6. Entity structure and E&O insurance before any of this goes live?

Until there are answers: the lab stays off, and the live path stays unwritten.

---

## Files

| Path | What |
|---|---|
| `bot_lab.py` | Accounts, locks, ledger, unlock rule. No Flask. |
| `access-gate.html` | The sign-in shown when a by-link page needs a password. |
| `app.py` | Routes, all behind `@lab_enabled`. |
| `bot-lab.html` | The console at `/lab`. |
| `test_bot_lab.py` | 43 checks. Leads with "switched off, the lab does not exist". |

Written to `/var/data` and **gitignored** — this repo is public:
`bot_users.json` (password hashes), `bot_ledger.json`, `bot_locks.json`.
