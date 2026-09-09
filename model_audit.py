#!/usr/bin/env python3
"""Every model that ships, measured against Sean's own nine-item checklist.

    python3 model_audit.py              the table, worst first
    python3 model_audit.py --owed       only what is not finished
    python3 model_audit.py --strict     exit 1 if any shipped model fails a
                                        mechanically checkable item

[SEAN 2026-09-08 "i need the 3D model realistic standard to be added to all
built ... and i need this to apply to all build"]

WHY THIS EXISTS. MODEL_STANDARD.md already says it applies to every model on
the site. What was missing was any way to ASK whether it does. The evidence
lived in three places at once, the file header, a 2,372 line markdown ledger
and LANDMARK_QUEUE.md, under names that do not match the code, and 22 of the
33 shipped models were not in the ledger at all. Nobody could answer "is
everything at standard" without reading all of it, which is the same defect
as a rule with nothing enforcing it.

WHAT IT CAN AND CANNOT CHECK, stated plainly because a check that overclaims
is worse than no check. Of the nine items, five can be read off the source
(2 horizontal breaks, 3 a base, 4 a real roof, 5 two tones, 6 a ground
shadow) and two can be read weakly (1 real counts, 8 openings). Two CANNOT be
checked by any machine here:

  item 7, heights TRUE      needs the published number, which is prose
  item 9, the one thing a
          visitor names     needs to know what the building is famous for

So a model this script calls OK has passed the checkable half. It has NOT
passed the standard. Only looking at it does that, and step 4 of the standard,
the two adversarial critics, is what closes it. The script's real job is to
stop a model from being ASSUMED good, and to name the ones nobody ever
recorded a verdict on.
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
STD = os.path.join(ROOT, "MODEL_STANDARD.md")

# The ledger and the code drifted apart. These are the same model.
ALIAS = {"trump": "trump-tower", "bridge": "brooklyn-bridge"}

# Built-in scenes: a model can ship from inside its renderer instead of from a
# form file. Both are "shipped" and both are audited.
BUILTIN = [("seattle-3d.js", "space-needle", "spaceNeedle"),
           ("seattle-3d.js", "pier66-walk", "pier66")]

CHECKS = [
    # (item, label, regex, what a miss means)
    (2, "horizontal breaks",
     r"cornice|string.?course|water.?table|parapet|belt.?course|entablature|architrave|\btier|corona|\bcourse|\bband\b|frieze|sill.?course"),
    (3, "a base",
     r"\bstep|plinth|podium|stylobate|platform|terrace|basement|treads?\b"),
    (4, "a real roof",
     r"pitch|hip\b|gable|dome|lantern|cupola|balustrade|chimney|mansard|pediment|spire|steeple|attic|parapet|roofline|\broof\b"),
    (5, "two tones",
     r"\bshade\b|\btone\b|lighten|darken|warmer"),
    (6, "ground shadow",
     r"shadow"),
    (1, "repeated members",           # weak: a loop that draws many of a thing
     r"for\s*\(\s*var\s+\w+\s*=\s*0[^)]*\)\s*\{[^}]*?(prism|box|col|bay|window|ngon)"),
    (8, "openings",
     r"reveal|window|glaz|opening|sash|mullion"),
]
WEAK = {1, 8}

# A miss is not always a defect. The standard says so itself on item 4: "If the
# roof is a flat lid, say in the header that the building really has a flat
# roof, or fix it." The Vietnam wall is a cut into the ground and correctly has
# no roof and no plinth; the Monument's 150 ft change is a colour shift with no
# ledge. So a file may DECLARE an item does not apply, and the declaration is
# the record. One line, in the file's own comment header:
#
#   MODEL_STANDARD_EXEMPT: 4 the memorial is a cut into the ground, no roof
#
# The reason is required. An exemption with no reason is not an exemption, it
# is the box this standard was written against.
EXEMPT_RX = re.compile(r"MODEL_STANDARD_EXEMPT:\s*([0-9])\s+(\S.*)")


def exemptions(src):
    out = {}
    for m in EXEMPT_RX.finditer(src):
        item, why = int(m.group(1)), m.group(2).strip()
        if len(why) >= 8:
            out[item] = why
    return out
UNCHECKABLE = {7: "heights TRUE (needs the published number)",
               9: "the one thing a visitor names"}


def brace_body(s, start):
    """From the first { at/after start, return the matching block."""
    i = s.index("{", start); d = 0; n = len(s)
    while i < n:
        c = s[i]
        if c in "'\"":
            q = c; i += 1
            while i < n and s[i] != q:
                i += 2 if s[i] == "\\" else 1
        elif c == "/" and i + 1 < n and s[i + 1] == "/":
            j = s.find("\n", i); i = n if j < 0 else j
        elif c == "/" and i + 1 < n and s[i + 1] == "*":
            j = s.find("*/", i); i = n if j < 0 else j + 1
        elif c == "{":
            d += 1
        elif c == "}":
            d -= 1
            if d == 0:
                return s[start:i + 1]
        i += 1
    return s[start:]


def shipped():
    """(family, key, source text, where it lives)."""
    out = []
    for p in sorted(glob.glob(os.path.join(ROOT, "*-form-*.js"))):
        fam, key = os.path.basename(p)[:-3].split("-form-", 1)
        out.append((fam, key, open(p, encoding="utf-8").read(), os.path.basename(p)))
    for fn, key, sym in BUILTIN:
        p = os.path.join(ROOT, fn)
        if not os.path.exists(p):
            continue
        s = open(p, encoding="utf-8").read()
        m = re.search(r"function\s+%s\s*\(" % re.escape(sym), s)
        if m:
            out.append((fn.split("-")[0], key, brace_body(s, m.end()), fn))
    return out


def ledger():
    """What MODEL_STANDARD.md says has been rebuilt, and what it still owes."""
    if not os.path.exists(STD):
        return set(), {}
    md = open(STD, encoding="utf-8").read()
    sec = md.split("## Rebuilt to this standard", 1)
    done = set()
    if len(sec) > 1:
        body = sec[1].split("## Researched this run", 1)[0]
        done = {m.group(1) for m in re.finditer(r"^- ([a-z0-9][a-z0-9_-]*)[,.]", body, re.M)}
    owed = {}
    for m in re.finditer(r"STILL OWED on ([a-z0-9-]+)[^:]*:(.*?)(?=\n\n|\n- |\Z)", md, re.S):
        items = re.findall(r"\(([a-z])\)", m.group(2))
        owed[m.group(1)] = len(items) or 1
    return done, owed


def audit():
    done, owed = ledger()
    rows = []
    for fam, key, src, where in shipped():
        ex = exemptions(src)
        fails = [(i, lab) for i, lab, rx in CHECKS
                 if not re.search(rx, src, re.I | re.S) and i not in ex]
        hard = [f for f in fails if f[0] not in WEAK]
        name = ALIAS.get(key, key)
        rows.append({
            "fam": fam, "key": key, "where": where,
            "fails": fails, "hard": len(hard),
            "in_ledger": name in done or key in done,
            # the file's own claim: a header saying it was built to the standard
            "self_declared": bool(re.search(r"(?:Re)?[Bb]uilt to MODEL_STANDARD", src[:3000])),
            "exempt": ex,
            "owed": owed.get(key, owed.get(name, 0)),
        })
    rows.sort(key=lambda r: (-r["hard"], -r["owed"], r["in_ledger"], r["key"]))
    return rows, done, owed


def main():
    rows, done, owed = audit()
    only_owed = "--owed" in sys.argv
    n_hard = sum(1 for r in rows if r["hard"])
    n_unrec = sum(1 for r in rows if not r["in_ledger"] and not r["self_declared"])
    n_self  = sum(1 for r in rows if not r["in_ledger"] and r["self_declared"])

    print("%d models ship. %d fail a checkable item. %d carry no verdict anywhere, "
          "%d claim the standard in their own header but have no ledger line. "
          "%d have named debts still open."
          % (len(rows), n_hard, n_unrec, n_self, sum(1 for r in rows if r["owed"])))
    print("Items 7 and 9 are NOT checked here: %s; %s." % (UNCHECKABLE[7], UNCHECKABLE[9]))
    print()
    print("%-6s %-18s %-9s %-8s %s" % ("fam", "key", "verdict", "debts", "checkable items missing"))
    for r in rows:
        if only_owed and not (r["hard"] or r["owed"] or not r["in_ledger"]):
            continue
        miss = ", ".join("%d %s%s" % (i, lab, "?" if i in WEAK else "")
                         for i, lab in r["fails"]) or "none"
        if r["exempt"]:
            miss += "  [declared n/a: %s]" % ", ".join(str(i) for i in sorted(r["exempt"]))
        verdict = ("recorded" if r["in_ledger"]
                   else "self-decl" if r["self_declared"] else "NO RECORD")
        print("%-6s %-18s %-9s %-8s %s"
              % (r["fam"], r["key"], verdict,
                 ("%d open" % r["owed"]) if r["owed"] else "-", miss))
    print()
    print("A '?' marks a weak check: absent wording, not proof the feature is missing.")
    print("'self-decl' means the file's header claims the standard but the ledger in")
    print("MODEL_STANDARD.md has no line for it. 'NO RECORD' means neither says so.")
    print("Both are bookkeeping gaps, not evidence the model is bad. Only the two")
    print("adversarial critics of step 4 close a model, and that verdict is prose.")
    if "--strict" in sys.argv and n_hard:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
