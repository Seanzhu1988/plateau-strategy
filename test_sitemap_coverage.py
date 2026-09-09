#!/usr/bin/env python3
"""Every public page is in the sitemap, or it is deliberately not.

    python3 test_sitemap_coverage.py

WHY THIS EXISTS. PUBLIC_PAGES has been patched one forgotten page at a time:

  2026-09-05  /tours, the page that sells the tours, was in no sitemap, no
              index and no link. [SEAN "check all of them".]
  2026-09-08  /freedom-trail, added when Search Console said "no referring
              sitemaps" and the test client agreed.
  2026-09-09  [SEAN "mets museum had pages missing can you check that too"]
              He was right, and it was ten pages, not one: /met, /moma,
              /universal-gallery, /walks, /trips, /favorite-place, /map,
              /professionals, /name-protection, /privacy.

Three rounds of the same defect is a missing test, not three mistakes. A page
gets built, it works, nobody remembers the list, and the page is invisible to
search for months. This asks the question mechanically instead.

THE RULE. A route is expected in the sitemap when all of these hold:

    it is a GET with no URL parameters      (parameterised pages are added
                                             from their data, further down
                                             the sitemap route)
    it answers 200 with real content        (a stub or a redirect is not a page)
    it does not say noindex                 (saying so is a deliberate choice,
                                             and this test believes it)
    it is not an owner surface              (OWNER_ONLY_PATHS, plus the four
                                             named below)

Anything else must be listed in DELIBERATE with a reason. An empty reason is
not a reason. The point is that leaving a page out becomes a decision someone
wrote down, rather than something nobody noticed.
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Pages that answer 200, carry no noindex, and still do not belong in a
# sitemap. Each one needs a reason a stranger could check.
DELIBERATE = {
    "/books": "Sean's own accounting; its data API is @owner_required",
    "/driver": "the driver portal, a login surface, not a page to be found",
    "/partners": "the partner pipeline, sent to a hotel by hand, not searched for",
    "/guide-studio": "a build tool for making trips, not a page to read",
}

# Files, not pages.
_ASSET = re.compile(r"\.(js|css|json|xml|txt|png|jpe?g|svg|webmanifest|ico|html|pdf|mp3|m4a)$", re.I)

_OK = 0
_BAD = []


def chk(label, good, detail=""):
    global _OK
    if good:
        _OK += 1
        print("  OK   %s" % label)
    else:
        _BAD.append(label)
        print("  FAIL %s%s" % (label, ("  " + detail) if detail else ""))


def main():
    import app as A

    client = A.app.test_client()
    sitemap = client.get("/sitemap.xml").data.decode()
    listed = set(re.findall(r"<loc>https://plateaustrategy\.io(.*?)</loc>", sitemap))
    owner = set(getattr(A, "OWNER_ONLY_PATHS", []) or [])

    rules = sorted({r.rule for r in A.app.url_map.iter_rules()
                    if "GET" in (r.methods or ())
                    and "<" not in r.rule
                    and not r.rule.startswith("/api/")
                    and not _ASSET.search(r.rule)})

    print("routes with no parameters: %d · sitemap rows: %d"
          % (len(rules), sitemap.count("<loc>")))
    print("\nevery public page is reachable from the sitemap:")

    missing, checked = [], 0
    for rule in rules:
        if rule in listed or rule in owner or rule in DELIBERATE:
            continue
        try:
            r = client.get(rule)
        except Exception as exc:                      # a broken page is its own bug
            missing.append((rule, "raised %s" % type(exc).__name__))
            continue
        if r.status_code != 200 or len(r.data) < 2000:
            continue                                  # a redirect or a stub, not a page
        checked += 1
        if re.search(r'name=["\']robots["\'][^>]+noindex', r.data.decode("utf-8", "replace"), re.I):
            continue                                  # it says so itself, and that is allowed
        missing.append((rule, "200, no noindex, not in the sitemap"))

    chk("no public page is missing (checked %d candidates)" % checked,
        not missing, "; ".join("%s (%s)" % m for m in missing))

    # A reason that is not there is not a reason.
    chk("every deliberate exclusion carries a reason",
        all(isinstance(v, str) and len(v.strip()) >= 12 for v in DELIBERATE.values()),
        str([k for k, v in DELIBERATE.items() if len(str(v).strip()) < 12]))

    # And the exclusions must still be real routes, or the list is stale.
    stale = [p for p in DELIBERATE if p not in rules]
    chk("no exclusion names a route that no longer exists", not stale, str(stale))

    # The sitemap must not advertise a page that does not answer.
    broken = []
    for path in sorted(listed):
        if "<" in path or _ASSET.search(path):
            continue
        if path.count("/") > 1:
            continue                                  # data-driven rows, sampled elsewhere
        if client.get(path).status_code != 200:
            broken.append(path)
    chk("no sitemap row points at a page that does not answer", not broken, str(broken))

    print("\n%d checks passed%s" % (_OK, ("" if not _BAD else ", %d FAILED" % len(_BAD))))
    if _BAD:
        print("\nFAILED: %s" % _BAD)
        print("\nAdd the page to PUBLIC_PAGES in app.py, or give it a noindex meta")
        print("tag, or name it in DELIBERATE here with the reason it stays out.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
