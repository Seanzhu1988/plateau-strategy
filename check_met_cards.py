#!/usr/bin/env python3
"""Ask the Met, weekly, whether our /met cards still tell the truth.

    python3 check_met_cards.py            # prints one line per claim + a verdict

The /moma page gets this honesty from the museum's published dataset; the Met
publishes a live API instead, so this asks it directly. met_claims.json holds
every checkable work the cards name, each one resolved by search and proven by
title and artist when the table was built (never pinned from memory; that
method once produced a Nepali prime minister where a Boston school should be).

For each claim the museum's answer is one of three:
  ok        it hangs where it hung when we last looked
  MOVED     it is on view somewhere new; update the claim, and the card if it
            names a place
  OFF VIEW  the museum took it down; the card must stop promising it

The very first run of this check caught two silent drifts our fact-checked
cards had already accumulated: America Today and I Saw the Figure 5 in Gold,
both confidently promised, both off view. That is why this runs weekly.

Exit code 0 always: the check REPORTS, a human decides. CI shows the verdict
loudly in the run summary instead of failing the build over a rehang.
"""
import json
import os
import sys
import time
import urllib.request

API = "https://collectionapi.metmuseum.org/public/collection/v1"
UA = {"User-Agent": "PlateauStrategy/1.0 (met cards check; seanzhu1988115@gmail.com)"}
BASE = os.path.dirname(os.path.abspath(__file__))


def get(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        return {"_err": str(e)}


def main():
    data = json.load(open(os.path.join(BASE, "met_claims.json"), encoding="utf-8"))
    moved, off, errs = [], [], []
    print("Met card check, %d claims vs the museum's live API\n" % len(data["claims"]))
    for c in data["claims"]:
        o = get("%s/objects/%s" % (API, c["object_id"]))
        time.sleep(0.2)                      # a guest, not a scraper
        if o.get("_err") or not o.get("objectID"):
            errs.append(c)
            print("? %-46s API did not answer (%s)" % (c["work"][:46], o.get("_err", "empty")))
            continue
        gal = o.get("GalleryNumber") or ""
        if not gal:
            off.append(c)
            print("X %-46s OFF VIEW (was gallery %s)" % (c["work"][:46], c["gallery"]))
        elif gal != c["gallery"]:
            moved.append((c, gal))
            print("~ %-46s MOVED gallery %s -> %s" % (c["work"][:46], c["gallery"], gal))
        else:
            print("  %-46s ok, gallery %s" % (c["work"][:46], gal))

    print()
    if not (moved or off or errs):
        print("VERDICT: every work the cards name hangs where we say it does.")
    else:
        print("VERDICT: %d moved, %d off view, %d unanswered. The cards need a human look:"
              % (len(moved), len(off), len(errs)))
        for c, gal in moved:
            print("  update met_claims.json gallery for %s (%s -> %s)"
                  % (c["accession"], c["gallery"], gal))
        for c in off:
            print("  the '%s' card should stop promising: %s" % (c["room"], c["work"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
