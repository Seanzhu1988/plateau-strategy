#!/usr/bin/env python3
"""Post the social library on a schedule, by itself, on the channels that allow it.

    python3 auto_post.py            # post today's pick to every enabled channel
    python3 auto_post.py --dry      # say what it would post, send nothing, need no keys
    python3 auto_post.py --force    # post even if the ledger says today is done

WHAT CAN AND CANNOT BE AUTOMATED. This is the honest half of "post it for me
every day". A channel is posted here ONLY if it has a real posting API and the
keys for it are in the environment:

  * X (Twitter): yes. Needs X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN,
    X_ACCESS_SECRET (OAuth 1.0a user context, the four an X developer app gives
    you). X charges per post on new accounts, about twenty cents for a post with
    a link, so this is cheap at a post a day and not free.
  * Facebook / Instagram: the same shape, added when a Graph token exists. Left
    as a clear stub below so it lights up the day the token is set.
  * RedNote (小红书) and WeChat: NO. There is no posting API, so nothing here
    can post them; the only "automation" for those breaks their rules and loses
    the account. They stay hand posted from the starter kit.

Without keys this whole script is a quiet no-op: it says there is nothing it can
post and exits cleanly, exactly like the recorder without an ElevenLabs key, so
turning it on is only ever a matter of adding secrets.

HOW OFTEN. Not "every moment": a brand new account that fires constantly reads
as spam and gets throttled or banned, which is the opposite of reach. This posts
at most X_MAX_PER_DAY per channel (default 1), spread by a daily rotation
through the hand-written library so it never repeats two days running, and a
ledger stops a second run in the same day from doubling up. Raise the cap when
the account is warm.
"""
import argparse
import datetime
import json
import os
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
SITE = "https://plateaustrategy.io"
LEDGER = os.path.join(BASE, "social", "posted.json")
MAX_PER_DAY = int(os.environ.get("X_MAX_PER_DAY", "1"))


def _load(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def _save(path, data):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    os.replace(tmp, path)


def library(channel):
    """The hand-written posts for one channel, in a stable order."""
    posts = _load(os.path.join(BASE, "social", "posts.json"), {}).get("posts") or []
    got = [p for p in posts if channel in p.get("channels", [])]
    got.sort(key=lambda p: p.get("id", ""))
    return got


def compose_x(p):
    """One X post: the hook, the tagged link, the topics, as a single string.
    Matches what the weekly pack shows, so hand and auto never drift."""
    link = "%s%s?utm_source=x" % (SITE, p.get("page", "/"))
    return (p.get("text", "").strip() + " " + link
            + ((" " + p["tags"]) if p.get("tags") else "")).strip()


def pick(channel, ledger, force):
    """Today's post for a channel, or None if the day's cap is already met.

    The library is walked by the day number so consecutive days never repeat,
    and the ledger records what went out so a second run in the same day, a
    retry after a failure, does not post twice."""
    pool = library(channel)
    if not pool:
        return None
    today = datetime.date.today().isoformat()
    done = [row for row in ledger.get("sent", [])
            if row.get("date") == today and row.get("channel") == channel]
    if not force and len(done) >= MAX_PER_DAY:
        return None
    used_ids = {row.get("post_id") for row in done}
    start = datetime.date.today().toordinal() % len(pool)
    for i in range(len(pool)):
        cand = pool[(start + i) % len(pool)]
        if cand.get("id") not in used_ids:
            return cand
    return None


def post_x(p, dry):
    """Send one post to X, or say what it would send. Returns (ok, detail)."""
    text = compose_x(p)
    if dry:
        return True, "DRY (%d chars incl link as 23): %s" % (
            len(p.get("text", "")) + 1 + 23 + (1 + len(p.get("tags", "")) if p.get("tags") else 0),
            text)
    keys = [os.environ.get(k, "").strip() for k in
            ("X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_SECRET")]
    if not all(keys):
        return False, "no X keys in the environment, nothing sent"
    try:
        import tweepy
    except Exception:
        return False, "tweepy is not installed (pip install tweepy)"
    try:
        client = tweepy.Client(consumer_key=keys[0], consumer_secret=keys[1],
                               access_token=keys[2], access_token_secret=keys[3])
        resp = client.create_tweet(text=text)
        tid = (resp.data or {}).get("id")
        return True, "posted to X, id %s" % tid
    except Exception as e:
        return False, "X refused: %s" % e


# Facebook / Instagram go here the day a Graph token exists, same shape as X:
# read the token from the environment, no-op without it, one post per run.
def post_meta(p, dry):
    if not os.environ.get("META_PAGE_TOKEN", "").strip():
        return None, "no Meta token, skipped"
    return None, "Meta posting not wired yet"


CHANNELS = {"x": post_x}      # add "facebook"/"instagram" here when tokens exist


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--channel", default="")
    args = ap.parse_args()

    ledger = _load(LEDGER, {"sent": []})
    which = [args.channel] if args.channel else list(CHANNELS)
    any_sent = False
    for ch in which:
        sender = CHANNELS.get(ch)
        if not sender:
            print("%s: no sender" % ch)
            continue
        p = pick(ch, ledger, args.force)
        if not p:
            print("%s: nothing to post (cap met or empty)" % ch)
            continue
        ok, detail = sender(p, args.dry)
        print("%s <- %s : %s" % (ch, p.get("id"), detail))
        if ok and not args.dry:
            ledger.setdefault("sent", []).append(
                {"date": datetime.date.today().isoformat(), "channel": ch,
                 "post_id": p.get("id"),
                 "at": datetime.datetime.utcnow().isoformat(timespec="seconds")})
            ledger["sent"] = ledger["sent"][-500:]
            _save(LEDGER, ledger)
            any_sent = True
    if not args.dry and not any_sent:
        print("Nothing posted this run.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
