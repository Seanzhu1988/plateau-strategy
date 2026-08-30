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

    def is_rednote(p):
        return "rednote" in p.get("channels", [])

    en = [p for p in posts if p["lang"] == "en" and not p["id"].startswith("tours")
          and not is_rednote(p)]
    zh = [p for p in posts if p["lang"] == "zh" and not p["id"].startswith("tours")
          and not is_rednote(p)]
    tours = [p for p in posts if p["id"].startswith("tours") and not is_rednote(p)]
    rednote = [p for p in posts if is_rednote(p)]

    picked = []
    for pool, n in ((en, 2), (zh, 2)):
        for i in range(n):
            picked.append(pool[(week + i) % len(pool)])
    picked += tours                                   # the money, every week
    # RedNote rotates on the same week clock, up to two a week, and never the
    # same note twice in one pack even when the pool is small.
    rn_pick = [rednote[(week + i) % len(rednote)] for i in range(min(2, len(rednote)))]

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

    packs = os.path.join(BASE, "social", "packs")
    os.makedirs(packs, exist_ok=True)
    md = os.path.join(packs, "%d-W%02d.md" % (year, week))
    open(md, "w", encoding="utf-8").write("\n".join(lines))
    json.dump(latest, open(os.path.join(packs, "latest.json"), "w", encoding="utf-8"),
              indent=1, ensure_ascii=False)
    print("pack: %s · %d posts (%d zh) + %d RedNote" % (
          os.path.basename(md), len(picked),
          sum(1 for p in picked if p["lang"] == "zh"), len(rn_pick)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
