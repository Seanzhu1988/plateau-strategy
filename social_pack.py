#!/usr/bin/env python3
"""Assemble this week's social pack from the hand-written library.

    python3 social_pack.py            # writes social/packs/<year>-W<week>.md + latest.json

The automation is ASSEMBLY, not generation: every post in social/posts.json
was written by hand in its own language (the Chinese for xiaohongshu's
register, never translated), and this script only rotates which ones go out
this week, stamps each link with its per-channel utm_source, and lays the
pack out ready to paste. The playbook's judge stays in charge: every link is
tagged, so the Archive can score each channel on bookings over visitors.

Rotation: ISO week number walks the library so consecutive weeks never repeat
a post, two English and two Chinese per week plus the tours post every week
in both languages, because tours are the money and the season is short.

RedNote (小红书) is its own lane, because it is not the same shape as a Facebook
caption. A note there is image first, carries a short hook title above the body,
and its body links are not clickable, so the site link lives in the profile bio.
Those posts are hand-written in RedNote's own register, marked with the "rednote"
channel, and laid out here with their title, cover and topics ready to paste.

X is its own lane too, marked with the "x" channel: short, a clickable link
inline, written to fit 280 with the link counted as 23. X is the one channel
here with a real posting API, so these are the posts an auto-poster would send.
"""
import datetime
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
SITE = "https://plateaustrategy.io"


def link(page, channel):
    return "%s%s?utm_source=%s" % (SITE, page, channel)


def main():
    lib = json.load(open(os.path.join(BASE, "social", "posts.json"), encoding="utf-8"))
    posts = lib["posts"]
    year, week, _ = datetime.date.today().isocalendar()

    def has(p, ch):
        return ch in p.get("channels", [])

    # RedNote and X are their own lanes, kept out of the generic pools so they
    # are not rendered twice in the wrong shape.
    en = [p for p in posts if p["lang"] == "en" and not p["id"].startswith("tours")
          and not has(p, "rednote") and not has(p, "x")]
    zh = [p for p in posts if p["lang"] == "zh" and not p["id"].startswith("tours")
          and not has(p, "rednote") and not has(p, "x")]
    tours = [p for p in posts if p["id"].startswith("tours")
             and not has(p, "rednote") and not has(p, "x")]
    rednote = [p for p in posts if has(p, "rednote")]
    xposts = [p for p in posts if has(p, "x")]

    picked = []
    for pool, n in ((en, 2), (zh, 2)):
        for i in range(n):
            picked.append(pool[(week + i) % len(pool)])
    picked += tours                                   # the money, every week
    # RedNote and X rotate on the same week clock, a few a week, never the same
    # one twice in a pack even when the pool is small.
    rn_pick = [rednote[(week + i) % len(rednote)] for i in range(min(2, len(rednote)))]
    x_pick = [xposts[(week + i) % len(xposts)] for i in range(min(3, len(xposts)))]

    lines = ["# Social pack · %d week %02d" % (year, week), "",
             "Copy, attach the visual, post. Every link is tagged per channel so",
             "the Archive can judge it. Post the Chinese ones AS WRITTEN, they are",
             "not translations. Nothing here mentions the rental: it is under",
             "reconstruction and its advertising rules are the strictest we have.",
             ""]
    latest = {"year": year, "week": week, "posts": []}
    for p in picked:
        lines += ["## %s · %s" % (p["id"], " / ".join(p["channels"])), "",
                  p["text"], ""]
        links = {c: link(p["page"], c) for c in p["channels"]}
        for c, u in links.items():
            lines.append("- %s: %s" % (c, u))
        lines += ["- tags: %s" % p["tags"],
                  "- visual: %s" % p["visual"], ""]
        latest["posts"].append({**p, "links": links})

    # The RedNote lane, laid out the way the app wants it: a cover, a short title
    # above the body, topics at the end, and the site link in the bio because a
    # link in the body is not clickable there.
    if rn_pick:
        lines += ["---", "",
                  "# RedNote lane 小红书", "",
                  "Image first. Set the cover, paste the title, then the body, then the",
                  "topics. The link is NOT clickable in a RedNote body, so put the site",
                  "in your profile bio; the tagged link below is what the Archive scores.",
                  ""]
        for p in rn_pick:
            biolink = link(p["page"], "rednote")
            lines += ["## %s" % p["id"], "",
                      "标题: %s" % p.get("title", ""), "",
                      p["text"], "",
                      "- 话题 tags: %s" % p["tags"],
                      "- 封面 cover: %s" % p["visual"],
                      "- 主页链接 bio link: %s" % biolink, ""]
            latest["posts"].append({**p, "links": {"rednote": biolink}})

    # The X lane. X allows a clickable link and, unlike RedNote, a real posting
    # API, so these are written to stand alone with the tagged link inline. X
    # counts any link as 23 characters, so the length shown here is the true one
    # against the 280 limit, link included.
    if x_pick:
        lines += ["---", "", "# X lane", "",
                  "One tap, or auto-posted once the X API key is set. The count is the"
                  " real X length, link included (X counts a link as 23).", ""]
        for p in x_pick:
            u = link(p["page"], "x")
            xlen = len(p["text"]) + 1 + 23 + (1 + len(p["tags"]) if p["tags"] else 0)
            lines += ["## %s  (%d/280)" % (p["id"], xlen), "",
                      "%s %s %s" % (p["text"], u, p["tags"]), "",
                      "- visual: %s" % p["visual"], ""]
            latest["posts"].append({**p, "links": {"x": u}})

    packs = os.path.join(BASE, "social", "packs")
    os.makedirs(packs, exist_ok=True)
    md = os.path.join(packs, "%d-W%02d.md" % (year, week))
    open(md, "w", encoding="utf-8").write("\n".join(lines))
    json.dump(latest, open(os.path.join(packs, "latest.json"), "w", encoding="utf-8"),
              indent=1, ensure_ascii=False)
    print("pack: %s · %d posts (%d zh) + %d RedNote + %d X" % (
          os.path.basename(md), len(picked),
          sum(1 for p in picked if p["lang"] == "zh"), len(rn_pick), len(x_pick)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
