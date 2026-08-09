# Reinvestment USA — framework

*Drafted 2026-08-07. This is the plan, not the build. Nothing here ships until the
sections marked BLOCKED have an answer from a lawyer.*

---

## What it is, in one line

A launchpad where somebody with an idea and no money can get a real professional
opinion on it, and where that opinion is what everyone pays for.

## Who is on it

| Role | What they come for | What they give |
|---|---|---|
| **Founder** | Has an idea, no company, no money, no idea what it would cost | The idea, in confidence |
| **Professional** | A CPA, attorney, insurance broker, licensed trade — looking for work | An assessment, priced |
| **Backer** | Wants to put money behind something real | Interest, then capital |
| **Operator** | Wants to *run* a business, not invent one | Their time |
| **Plateau** | Runs the board, curates, takes a cut | The platform |

The insight worth protecting: **the professional is the product.** Anyone can host
a board of ideas — they are worth nothing and there are thousands of them. What a
founder cannot get is a CPA telling them "this is a $4,200 setup, an S-corp, you
need a WA reseller permit and a $1M liability policy, here is the 90-day path."
That is the thing people pay for, and the thing you can charge on.

## The object at the centre: **the File**

Not a comment, not a rating — a *file*, the way a professional would actually open
one on a client.

A File is one professional's work on one idea:

- what entity, and why
- what it costs to stand up properly, itemised
- licences, permits, insurance actually required
- the tax treatment, plainly
- what kills it — the honest risk
- a 90-day path to trading

The File is **written first and locked**. The founder sees that a File exists, who
opened it, their credentials, and a one-paragraph preview. The body unlocks on
payment.

That single mechanic does three jobs at once: the professional is paid for work
already done, the founder pays only when there is something real to buy, and
Plateau takes its cut at the moment value is delivered rather than promised.


## The professional's account

Professionals do not browse anonymously. Each one holds an account, and everything
they do on the board is signed with it.

**Registering** — name, firm, licence type and number, state, and what they do.
Credentials are checked by hand at the start; there is no self-serve badge. An
unverified account can look but cannot comment or open a File.

**Their profile** — a public page carrying their name, firm, licence, states they
are admitted in, specialities, and their work on the board. This is the thing that
makes the account worth having: a founder choosing between two CPAs is choosing on
what they can see here.

**Commenting** — a professional can comment on a specific idea from their account,
and the comment carries their name and credential. Not a forum handle, not
anonymous. That is the whole value: "a licensed WA CPA said this about your idea."
Founders may reply; other professionals may add their own view. A short public
exchange is often what converts a founder into a paying client.

**Their own price** — the professional sets it, not Plateau.

  · a rate for a full File on an idea
  · optionally an hourly rate shown on the profile
  · optionally a free first comment, as a way of winning the work

This matters more than it looks. Platform-set pricing turns professionals into
interchangeable labour and they leave. Letting them price their own work makes it
their practice, and it lets the market sort out what a File is worth instead of me
guessing. Plateau takes a percentage of whatever they set.

**What the founder sees before paying** — who opened the File, their licence, their
price, their previous work on the board, and a one-paragraph preview. Enough to
judge whether it is worth the money.

**Standards.** A licence number is checkable — spot-check them. An attorney
commenting on a specific person's situation can create duties they did not intend,
so the terms need a line making clear that a board comment is general information
and not the formation of a professional relationship. That line protects the
professional, and professionals will not join a platform that exposes them.

## The stages

```
1  PITCHED      public summary + timestamp. Founder chooses what is public.
2  UNDER REVIEW a verified professional has opened a File.
3  FILED        the File exists, locked. Founder sees preview + credentials.
4  UNLOCKED     paid. Founder has a roadmap they can act on.
5  BACKED       backers register interest.               ← regulated boundary
6  LAUNCHED     the business exists. Plateau's services follow it.
```

## Where the money comes from

Three lines that are safe to build now, because each sells a **service**:

1. **Unlock fee** on a File — split with the professional. The core.
2. **Professional subscription** — access to the queue, a verified badge, a
   profile. Pros pay for deal flow; that is a normal market.
3. **Formation and service revenue** downstream — the founder needs a registered
   agent, bookkeeping, insurance, a website. Plateau already does some of this.
   ⚠️ Referral fees involving attorneys are restricted in most states, WA included.
   Fee-sharing with a lawyer needs checking before a dollar moves.

## What "protected" actually means — say it exactly

The word "protected" will be read by founders as "you cannot steal my idea." It has
to mean something specific or it is a promise that breaks:

- **Timestamp.** A hash of the full text, recorded at submission. The board already
  stamps ideas; that becomes evidence of *when*, and it is genuinely useful.
- **Two layers.** The public sees only the summary the founder writes. The full
  text is visible only to professionals who have accepted written confidentiality.
- **Access log.** The founder sees exactly who opened their idea, and when.
- **Named terms.** The founder keeps ownership. Plateau gets a licence to display
  the summary, nothing more.

And one thing said plainly to every founder before they post:

> **A public post can destroy your patent rights.** In the US you have twelve
> months after a public disclosure to file; in most of the rest of the world you
> have none. If your idea is genuinely patentable, see a patent attorney *before*
> you post it here, not after.

Saying that will lose a few posts. Not saying it is how a platform gets sued by
the one founder who had something real.

## 🚫 BLOCKED — the public-funding half

> "The money will be funded either from us or the general public."

Those are two completely different legal objects.

**From Plateau** — you investing your own money, or lending it, is ordinary
business. Build freely.

**From the general public** — the moment strangers put money into someone else's
business expecting a return, that is a **securities offering**, and running the
place where it happens is a **funding portal**. In the US that means one of:

- **Reg CF** — the portal must be registered with the SEC *and* be a FINRA member.
  This is the route small platforms take. It is months and real legal spend.
- **Reg D** — accredited investors only. No general public, by definition.
- **Intrastate** — Washington residents only, both sides, with its own rules.

Operating it unregistered is not a technicality. It carries SEC enforcement,
rescission rights for every investor, and personal liability for whoever ran it.

**So the boundary is this:** stages 1–4 are buildable now. Stage 5 stays exactly
what the board already does — *register interest*, no money, no equity, no promise
of return — until a securities lawyer says otherwise.

You already emailed a business attorney (Eric M, moberlylaw.net) in June. This is
the question to take back to him, and it is worth paying for the hour.

## What I would build first

Not the whole thing. The narrowest slice that proves the one assumption everything
else rests on — **will a professional actually open a File?**

1. Founder submits: summary (public) + full detail (confidential) + timestamp.
2. Professional applies, credentials checked by hand at first. No self-serve.
3. Professional sees the queue, opens a File against a template.
4. Founder gets notified, sees preview + credentials, pays to unlock.
5. Nothing else.

If ten founders post and no professional opens a File, no amount of funding
mechanics saves it. If three professionals open Files in a week, the rest is worth
building.

## Honest risks

- **Empty-room problem.** Two-sided markets die without one side. Seed it — bring
  two professionals you already pay for your own business before opening it.
- **Quality.** One lazy File and the product is worthless. Template it, review the
  first ones yourself.
- **Founder distrust.** They are handing over an idea. The protection page has to
  be the most convincing page on the site.
- **Focus.** You run rides, rentals and tours, and cash is tight. This is a second
  company, not a page. Worth being honest with yourself about which one is paying
  the bills this quarter.

---

## CORRECTION, 2026-08-07 — the opinion is a product, not a service

My first draft had this wrong in a way that changes the whole economics.

I described a professional opening a bespoke File on one person's idea, sold
once to that person. That is **consulting with extra steps** — it does not
scale, because the professional has to do fresh work for every sale.

What the owner actually described:

> "Whoever wants to create this project will buy this idea and build their
> house, something like a blueprint... we make a platform fee. It's not going
> to be a lot, but if we have volume, we can make a lot of money from volume."

**The opinion is written once and sold many times.** A licensed contractor
writes "how to actually get a house built in King County — permits, sequence,
what it really costs, what fails inspection" once. Everyone who wants to build
a house in King County buys the same document. The professional's effort is
fixed; their revenue is not.

That is the difference between a consultancy and a platform, and it is the only
version of this that reaches volume.

### What that changes

| | bespoke File (wrong) | published opinion (right) |
|---|---|---|
| Written | per customer | once |
| Sold | once | unlimited |
| Professional's incentive | bill hours | write the best one and let it sell |
| Ceiling | their calendar | none |
| Platform's job | matchmaking | distribution and trust |

### The article is the anchor

Someone writes what they want to build. The board recognises the trades. Each
trade's professionals can find that article, and publish a priced opinion
against it. The next person with the same ambition finds the article **and the
opinions already attached to it**. The value compounds — an article with six
professional opinions on it is worth more than a fresh one, and neither the
founder nor the professionals had to meet.

### The maths, at his own numbers

Square takes roughly 2.9% + 30¢ of the whole charge before any split.

```
$10 opinion, 20% platform fee   →  $2.00 to us, $0.59 to Square  →  $1.41 net
$100 opinion, 20% platform fee  →  $20.00 to us, $3.20 to Square →  $16.80 net

$10  x 10,000 sales  →  $14,100 a year
$100 x 10,000 sales  →  $168,000 a year
```

**The 30¢ fixed fee is the thing to design around.** At a 20% platform fee the
break-even price is **$1.75** — below that, every sale loses money on card fees
alone. A $10 opinion works, but a third of the platform's cut is eaten by the
processor. Two ways out, both worth doing:

1. **Bundle.** A buyer purchasing four opinions on one article pays one charge,
   so the 30¢ is paid once instead of four times.
2. **Wallet.** A buyer tops up $20 once; purchases draw down. One card fee, many
   sales. This is why every micro-transaction platform ends up with credits.

### What is still true from the first draft

The 🚫 BLOCKED section stands unchanged. Selling a document is a service, and
none of this is a security. The moment strangers fund somebody's actual house,
that is a different legal object entirely.


---

# THE FULL MACHINE, 2026-08-08 — Sean's description, written down

This is the whole vision as Sean described it, captured because most of it was
not in the draft above and it is the first time the pieces have been connected
end to end. Recorded faithfully first; the objections are collected at the
bottom rather than sprinkled through, so the idea can be read on its own terms
before it is argued with.

## The flow, as described

1. **Anyone submits an idea.** No account needed — the board is already open.
2. **The council debates it.** Many agents, deliberately expensive
   ("high token burning"), to refine the idea into what the project would
   actually need.
3. **The council produces a file**, and the contents are specific:
   - a to-do list — register the company, what it costs, what roles are needed
   - draft paperwork — contract, company structure, agreement, bylaws
   - which professionals the project needs, named by discipline
   - **the feasibility assessment**, which Sean calls the most important part
4. **Ideas are filtered.** Not everything proceeds. This is the point of the
   council, not a side effect.
5. **The submitter pays a low platform fee.**
6. **The idea is listed publicly** to gather interest, votes and donations.
   **A donation unlocks the blueprint** and the general shape of the project.
7. **Professionals are recognised automatically.** If the file says an attorney
   is needed, the site generates an attorney account. They offer professional
   opinions on that project; substantive legal advice is paid to unlock.
8. **The professional stays.** They hold the account as an agent and keep
   working on the site as the business grows. Anyone needing legal help can
   search for them.
9. **The directory compounds.** Over time the site accumulates a list of
   professionals — including disciplines nobody thought of in advance — funded
   by platform fees or subscriptions.
10. **Popular ideas become businesses.** Votes and donations carry an idea until
    it can stand up.
11. **When it needs real money, Plateau is Phase 4.** The financial arm exists
    for this moment; phases 1–4 were built to support it.

## The money, and the exit — Sean's own terms

- Plateau funds the business and **holds shares**.
- **The shares are not permanent.** The business pays **10% royalty a year**,
  and that royalty **buys Plateau out** over time.
- The return is **principal plus the 10%**.
- *"Plateau will never or will not become a vampire drain for the business."*
- The 10% is not only revenue. It is **a pooled emergency fund** — mechanical,
  legal, whatever the business hits.
- Plateau assesses **leadership**. If a leader cannot keep the business in
  shape, *"the loyalty won the business"* — Plateau takes over, and the owner
  should understand exit may be the only option. Everything is negotiable.
- The royalty **splits into pieces of a pie chart** as leadership stabilises.
- Businesses must hold **moral, ethical and legal standards**. When they cannot,
  they can search the site for advice — not always free, and never promised to
  work, because it depends on the severity of the case.
- **Every agent gets paid.**
- **Plateau does not hold funds.** Stated flatly and twice. "No fund should be
  withheld... we want to make clear of that."

## What is genuinely strong here

Worth saying, because the objections below are long and this part is real.

**The buy-out royalty is a good instrument.** Most small-business funding is
either a loan that crushes cash flow or equity the founder never gets back.
A royalty that retires the stake is neither — the founder ends up owning their
company again, and Plateau's return is bounded and knowable. That is a genuinely
founder-friendly structure and it is unusual.

**"We do not hold funds" is the single best decision in the document.** It is
the same instinct as "we hold no keys" for the trading bot, and it removes an
entire category of risk — custody, commingling, money transmission licensing —
by never touching the asset. Keep it. Write it into every contract.

**The emergency pool is a real product.** Small businesses do not fail because
the idea was bad; they fail because a transmission went and there was no
$4,000. A funder that pools for that is solving the actual failure mode.

**The professional directory compounds.** Every file that says "this needs a
surveyor" is a lead for a surveyor, and the directory is worth more the longer
it runs. That is a real moat and it costs nothing extra to build.

## Objections, in the order they will bite

### 1. The takeover clause contradicts the promise, in Sean's own words

Two sentences, both his:

> "Plateau will never or will not become a vampire drain for the business."
> "The loyalty won the business. Plateau will take over the business for good."

The second is the thing the first promises not to be. A funder who can judge the
founder unfit and take the company **is** the thing founders are afraid of, and
no amount of good intent in the drafting changes how it reads to someone being
asked to sign it.

It is also the clause most likely to be struck down. A contract where one party
decides unilaterally that the other has failed, and takes the asset, is where
courts start asking about unconscionability — and the sympathetic party in that
room is the founder, not the fund.

**This does not have to be abandoned, it has to be made objective.** Replace
"we decide you are failing" with covenants the business either meets or does
not: missed royalty payments, a covenant breach, insolvency. Then the trigger
is arithmetic and the founder can see it coming and fix it. Same protection,
none of the discretion, and far easier to sign.

### 2. "Donation unlocks the blueprint" is not a donation

If money buys access to something, it is a **sale**, and it is taxable revenue
rather than a gift. That is fine — just call it what it is.

If it really is a donation, soliciting donations from the public requires
**charitable solicitation registration** in Washington and in most states where
donors live, and generally a nonprofit to receive them. Doing it as an LLC
invites a different set of problems.

Pick one. The dangerous version is the one that uses the warm word for the cold
mechanism.

### 3. Auto-generating accounts for professionals who never asked

*"The site will auto generate such log in for the attorney."*

Creating an account in a named professional's identity, without their knowledge,
is the part of this plan most likely to produce an angry letter. It reads as
impersonation, it puts their name on a platform they never joined, and if their
details were scraped it adds a data-protection question on top.

**The fix is small and keeps everything that matters:** generate the *invitation*,
not the account. "Your discipline is needed on this project — claim your profile."
The directory still compounds, the professional still arrives, and nothing exists
in their name until they say yes.

### 4. Generated bylaws and contracts — unauthorised practice of law

The council producing "contract, company structure, agreement and bylaws" for a
stranger's company is the exact activity **UPL** rules cover. LegalZoom spent
years and a great deal of money establishing where that line sits.

The workable shape is documented and narrow: **blank forms and general
information are fine; applying law to one person's specific situation is not.**
So the council can produce a checklist, an explanation of what an operating
agreement does, and a template. The moment it selects clauses *for this business
because of its facts*, it is practising. That distinction has to be built into
the product, not written in a disclaimer under it.

### 5. Attorney fees on the platform — RPC 5.4, again

Flagged before for "Everybody's Business Attorney" and now structural rather
than optional. **A lawyer may not share legal fees with a non-lawyer.** If
Plateau takes a cut of what the attorney charges for advice, that is fee
splitting, and the exposure lands on the attorney's licence, not on Plateau.

Structures that work: the attorney pays a flat subscription or listing fee
regardless of what they earn; or Plateau charges the *client* a platform fee
that is separate from and not contingent on the legal fee. What does not work is
a percentage of the advice.

The WSBA ethics line will answer this, and that call is free.

### 6. Equity plus royalty makes Plateau an investment company

"We do not hold funds" solves custody. It does not solve this. Taking equity
stakes in businesses, funded by money raised from the public, is what an
investment company does, and the public-funding half is already marked BLOCKED
above for the same reason. Nothing in this new description changes that
boundary — it makes it load-bearing.

### 7. The feasibility assessment is the liability

Sean calls it the most important output, and it is also the one that can be
sued over. Somebody donates because the council said an idea was feasible; it
was not; they want their money back. The assessment must be visibly the opinion
of a machine, dated, with its reasoning shown and its uncertainty stated — the
same standard already applied to the trading page. An assessment that hedges
nothing is the one that costs the most.

## The unit economics nobody has costed yet

"High token burning" is correct, and it is the platform's main cost driver.
A real number from this repo, today: **one council run on one codebase used 44
agents, 931 tool calls, 3.19 million tokens, and 80 minutes.**

That is the cost of ONE assessment. The "low platform fee" has to exceed it, or
every submission loses money and popularity makes it worse. Three levers, and
the design should pick deliberately rather than by accident:

- a **triage pass** — one cheap agent decides whether an idea is worth a council
  at all, so the expensive machinery only runs on ideas that survive a first look
- a **fee that covers the run**, charged before the council starts
- **council depth by tier** — a nine-lens panel for a serious submission, three
  for a first look

The filtering Sean already wants is the same mechanism as the cost control. That
is a happy accident and the design should lean on it.

## What is buildable now, unchanged by any of the above

1. **The idea board** — already live, already open to anyone.
2. **The council on submitted ideas**, producing the to-do list, the roles, the
   costs and the feasibility — as *information*, with templates rather than
   tailored legal documents.
3. **The professional directory**, built from invitations rather than
   auto-created accounts.
4. **The platform fee**, for the council run. Ordinary revenue for a service
   rendered, no securities question anywhere near it.
5. **Public listing, votes and interest** — with no money attached, exactly as
   the board does today.

That is most of the machine. What waits is the money half: donations (pick sale
or gift), Plateau's equity stakes, and anything raised from the public. Those
wait on the securities lawyer already named above, and the takeover clause waits
on being rewritten as covenants before it goes near a founder.
