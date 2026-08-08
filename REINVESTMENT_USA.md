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
