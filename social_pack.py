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

    en = [p for p in posts if p["lang"] == "en" and not p["id"].startswith("tours")]
    zh = [p for p in posts if p["lang"] == "zh" and not p["id"].startswith("tours")]
    tours = [p for p in posts if p["id"].startswith("tours")]

    picked = []
    for pool, n in ((en, 2), (zh, 2)):
        for i in range(n):
            picked.append(pool[(week + i) % len(pool)])
    picked += tours                                   # the money, every week

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

    packs = os.path.join(BASE, "social", "packs")
    os.makedirs(packs, exist_ok=True)
    md = os.path.join(packs, "%d-W%02d.md" % (year, week))
    open(md, "w", encoding="utf-8").write("\n".join(lines))
    json.dump(latest, open(os.path.join(packs, "latest.json"), "w", encoding="utf-8"),
              indent=1, ensure_ascii=False)
    print("pack: %s · %d posts (%d zh)" % (os.path.basename(md), len(picked),
          sum(1 for p in picked if p["lang"] == "zh")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
