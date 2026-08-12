# Putting Plateau Strategy in the cloud

Two things "cloud" gives you, and you want both:

1. **The code, editable from anywhere** → GitHub (a private repo). This is what lets
   you work from the iPad, or any machine, without this Mac.
2. **The site running with a public URL** → a host like Render, so it's live even when
   this Mac is off.

Everything below is written so **no customer data and no secret ever leaves your
machine**. The `.env` file, all API keys, and every file with customer PII are
gitignored and will never be uploaded.

---

## Step 1, Put the code on GitHub (private)

You do this part (accounts and passwords are yours, never mine):

1. Create a free account at github.com if you don't have one.
2. Make a **private** repository named `plateau-strategy`. Leave it empty (no README).
3. On this Mac, from the project folder, connect and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/plateau-strategy.git
git push -u origin main
```

That's it, your code is now in the cloud, private, editable from anywhere.
Because the data/secret files are gitignored, the repo has the *app*, not your
customers.

> Confirm before pushing: `git status` should NOT list `.env`, `reservations.json`,
> `customers.json`, `renters.json`, `agents.json`, or any signature file. If it does,
> stop, they must stay ignored.

---

## Step 2, Run it live on Render

1. Create a free account at render.com and click **New → Web Service**.
2. Connect your GitHub and pick the `plateau-strategy` repo. Render reads
   `render.yaml` and fills in the build/start commands automatically.
3. Under **Environment**, paste your secrets **by hand** (these live only here, never
   in git). At minimum the ones your `.env.example` lists, Square, Twilio, the owner
   login, etc. `FLASK_SECRET` is generated for you.
4. Click **Create**. In a few minutes you get a public URL like
   `https://plateau-strategy.onrender.com`.

Every time you `git push`, Render redeploys automatically. Work from the iPad → push →
the live site updates.

---

---

## Step 3, Point plateaustrategy.io at the site

The domain is registered. Two sides to connect: tell Render the domain is yours,
then tell your registrar where to send visitors.

**On Render** (Dashboard → your service → **Settings → Custom Domains**):

1. **Add Custom Domain** → `plateaustrategy.io`
2. **Add Custom Domain** again → `www.plateaustrategy.io`
3. Render shows the DNS records to create. Leave the page open, you need those values.

**At your registrar** (wherever you bought the domain), add what Render showed:

| Type | Name | Value |
|------|------|-------|
| `A` | `@` (apex) | the IP Render lists |
| `CNAME` | `www` | `<your-service>.onrender.com` |

Some registrars call the apex record `ALIAS` or `ANAME` instead of `A`, use that
if offered, it behaves better for a root domain.

Then wait. DNS takes anywhere from a few minutes to a few hours to propagate.
Render verifies automatically and issues a free TLS certificate once it sees the
records, so `https://plateaustrategy.io` starts working on its own, you do not
need to buy a certificate.

**Check progress:**

```bash
dig +short plateaustrategy.io          # should return Render's IP
curl -sI https://plateaustrategy.io | head -1   # should be HTTP/2 200
```

If `dig` returns nothing, DNS hasn't propagated yet, wait, don't re-add the records.

> The site's canonical URL, link-preview cards, and social tags in
> `landing-page.html` already point at `https://plateaustrategy.io/`, so shared
> links show the right title, description, and logo once DNS resolves.

---

## Two things you MUST know before real customers use it

1. **Data won't survive on the free tier.** This app stores everything in JSON files
   on disk. Render's free tier wipes the disk on every redeploy/restart, so
   reservations, bookings, and payouts made on the cloud copy would be **lost**. For a
   real launch you need either a Render **persistent disk** (paid) or a proper database.
   For *working on the site* and showing it, the free tier is fine, just don't take
   real bookings on it yet.

2. **Square is LIVE production.** A public URL means the booking/invoice endpoints are
   reachable by anyone. For the cloud working copy, set Square to **sandbox** mode
   (`SQUARE_ENV=sandbox`) so no real charges happen while you build. Flip to production
   only when you're truly launching.

3. **Background reminders won't run yet.** The uncovered-ride reminder loop starts only
   under `python app.py`, not under gunicorn. It's a small change to enable in
   production; noted here so it isn't a surprise.

---

## The short version

- Code → GitHub (private) = work from anywhere.
- GitHub → Render = live URL, auto-deploys on every push.
- Secrets and customer data never leave this Mac, they're set by hand in Render.
- Free tier = great for building; add a database + persistent disk before real launch.
