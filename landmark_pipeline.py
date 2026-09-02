# -*- coding: utf-8 -*-
"""The landmark line: find a place, model it, check the model, write it, check the writing.

Sean's brief, 2026-08-31: "bot will search iconic attractions all over usa,
and 3D model it, then routine refine it to align to the original. then write
the history and stories and audit the stories relibility."

Five stages, and the whole design turns on one thing sitting under four of
them: a single sourced number, read by everybody who needs it.

WHY THE FACT TABLE EXISTS
-------------------------
Before this, a landmark's dimensions were written down twice. The Brooklyn
Bridge's towers were `towerH: 276.5` in nyc-3d.js, and they were a sentence
in the story, typed separately by hand. Nothing compared them. On 2026-08-30
they disagreed, and the fix was a person noticing. At two landmarks that is
an annoyance. At two thousand it is a permanent supply of quiet errors that
nobody is looking for.

So the number is recorded once, with where it came from, and both the model
and the prose are checked against it. "Does the model match the building" and
"is the story true" stop being two jobs and become one comparison.

WHAT THE AUDIT DOES AND DOES NOT DO
-----------------------------------
It checks SOURCING and CONSISTENCY. It can say: this sentence contains a
number that appears nowhere in the fact table; this fact has no source; the
English says 1883 and the Spanish says 1893; this height contradicts that one.

It cannot say whether a source is right. Nothing here verifies the world. A
claim that is sourced, consistent and wrong will pass, and the honest word
for what this produces is "checked", never "true".

THE UNIT TRAP, WHICH IS NOT HYPOTHETICAL
----------------------------------------
Probing Wikidata before writing this, in 400 sampled landmarks: the Empire
State Building carried heights of 453 m AND 1500 m, the Maryland State House
60 m AND 181 m, St Patrick's Cathedral 329.5 m. Those are feet recorded as
metres. The Chrysler Building carried 252.3, 282 and 318.9 m, which are all
correct and describe the roof, the spire and the tip.

A pipeline that imported "the height" would have swallowed all of it. So a
fact carries its unit, a fact can be multi-valued, contradictions are FLAGGED
rather than resolved by picking one, and a foot-as-metre reading is detected
by the ratio it leaves behind. A landmark with contradictory facts does not
advance to modelling; it waits for a person.

RULES IT KEEPS
--------------
  NOTHING PUBLISHES ITSELF. [SEAN, 2026-08-31, asked and answered: review
  queue.] The line ends at a queue. A person approves. This follows the door
  discovery.py already uses: a scout proposes, the guide decides.

  EVERY FACT SAYS WHERE IT CAME FROM. A fact with no source is not a fact
  here, it is a flag.

  IT NEVER OVERWRITES A HUMAN. Facts carry an origin. A value a person
  entered or confirmed is never replaced by an automated read; the automated
  read is recorded beside it as a disagreement.

  IT IS POLITE TO ITS SOURCES. One query per run, spaced, a User-Agent that
  says who we are and how to reach us, and a cap on how much it takes.
"""

from __future__ import annotations

import json
import os
import re
import time
import urllib.parse
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.environ.get("DATA_DIR", BASE_DIR)

FACTS_PATH = os.path.join(DATA_DIR, "landmark_facts.json")
REGISTRY_PATH = os.path.join(DATA_DIR, "landmark_registry.json")


def _read_path(name):
    """The runtime copy if one exists, otherwise the committed one.

    The fact table is CONTENT, written here and committed like the
    Destination Book, not runtime state accumulated by visitors. In
    production DATA_DIR points at a persistent disk that a deploy never
    touches, so reading only from there found nothing: the live site served
    an empty landmark list and the "Built from the record" section rendered
    blank, while everything looked correct locally because DATA_DIR and the
    repo are the same folder here.

    So reads prefer the disk and fall back to what shipped. Writes still go
    to the disk, so a fact confirmed at runtime survives the next deploy and
    from then on takes precedence over the committed seed."""
    live = os.path.join(DATA_DIR, name)
    if os.path.exists(live):
        return live
    return os.path.join(BASE_DIR, name)

UA = ("PlateauStrategy/1.0 (+https://plateaustrategy.io; "
      "seanzhu1988115@gmail.com)")

WD_SPARQL = "https://query.wikidata.org/sparql"
NHL_ITEM = "Q624232"

FIND_LIMIT = int(os.environ.get("LANDMARK_FIND_LIMIT", "60"))

STAGES = ("found", "facts", "modelled", "aligned", "written", "audited", "ready")

M_PER_FT = 0.3048

# WHO COUNTS AS A SECOND OPINION.
#
# The corroboration rule asks for two sources. Probing showed how easily that
# is satisfied without being met: Wikipedia's infobox and Wikidata carry the
# Brooklyn Bridge's dimensions in near-identical form because one is largely
# derived from the other. Two names, one witness. So facts are grouped into
# families and corroboration is counted across families, never within one.
#
# The practical consequence is that most landmarks will hold a single family
# and will NOT be buildable from machine reads alone. That is the honest
# state of the evidence rather than a defect, and it is what the review queue
# is for: a person confirming a number is the second witness, which is
# exactly the role Sean chose for himself when he picked review over
# auto-publish.
SOURCE_FAMILIES = (
    ("human", ("",)),
    ("survey", ("nps", "haer", "habs", "library of congress", "loc.gov",
                "national park service", "usgs", "nomination")),
    ("wikimedia", ("wikidata", "wikipedia", "wikimedia", "commons")),
)


def source_family(source, origin="auto"):
    """Which witness a fact came from, not merely which URL."""
    if origin == "human":
        return "human"
    low = (source or "").strip().lower()
    for fam, keys in SOURCE_FAMILIES:
        if fam == "human":
            continue
        for k in keys:
            if k and k in low:
                return fam
    return "published:" + (low[:24] or "unknown")


# When several sources agree, the value used is the most authoritative one
# ACTUALLY PUBLISHED, never their mean. Averaging 276.5, 275.6 and 272 gives
# 274.7, a figure no source states and no reader could ever check. A model
# built on it cites nothing.
FAMILY_RANK = {"human": 0, "survey": 1, "wikimedia": 3}

# A building taller than this in metres is not a building, it is a unit error.
# The tallest structure in the United States is about 629 m.
IMPLAUSIBLE_M = 700.0


# --------------------------------------------------------------------------
# storage


def _atomic(path, obj):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
    os.replace(tmp, path)


def _load(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def load_facts():
    return _load(_read_path("landmark_facts.json"), {"_note": "One sourced number per fact. See landmark_pipeline.py.",
                              "landmarks": {}})


def load_registry():
    return _load(_read_path("landmark_registry.json"), {"_note": "Where each landmark has got to on the line.",
                                 "entries": {}})


def save_facts(d):
    _atomic(FACTS_PATH, d)


def save_registry(d):
    _atomic(REGISTRY_PATH, d)


# --------------------------------------------------------------------------
# facts


def make_fact(kind, value, unit, source, source_url="", origin="auto",
              note="", measured=""):
    """One number, and everything needed to argue with it later.

    `measured` is the part that stops the Chrysler Building problem: three
    heights are not a contradiction when one is the roof, one the spire and
    one the tip. Unlabelled, they are."""
    return {
        "kind": kind,
        "family": source_family(source, origin),
        "value": value,
        "unit": unit,
        "measured": measured,
        "source": source,
        "source_url": source_url,
        "origin": origin,
        "note": note,
        "retrieved": time.strftime("%Y-%m-%d"),
    }


def _to_ft(value, unit):
    if unit == "ft":
        return float(value)
    if unit == "m":
        return float(value) / M_PER_FT
    return None


def check_facts(facts):
    """Read a landmark's facts and report what cannot be true at once.

    Three findings, in the order they matter:

    unsourced     a fact with nothing behind it
    implausible   a height no building has, which in practice means feet
                  written in the metres column
    contradiction two values for the same measured thing

    The foot-as-metre case gets named specifically, because it has a
    signature: the pair divides out at almost exactly 3.28."""
    out = []
    by_kind = {}
    for f in facts:
        if not f.get("source"):
            out.append({"level": "flag", "kind": f.get("kind"),
                        "issue": "unsourced",
                        "detail": "no source recorded"})
        ft = _to_ft(f.get("value"), f.get("unit"))
        if f.get("kind") == "height" and ft is not None:
            if ft * M_PER_FT > IMPLAUSIBLE_M:
                out.append({"level": "flag", "kind": "height",
                            "issue": "implausible",
                            "detail": "%s %s is taller than any US structure; "
                                      "likely feet recorded as metres"
                                      % (f.get("value"), f.get("unit"))})
        by_kind.setdefault((f.get("kind"), f.get("measured") or ""), []).append(f)

    for (kind, measured), group in by_kind.items():
        if len(group) < 2:
            if group and group[0].get("origin") != "human":
                out.append({"level": "flag", "kind": kind, "measured": measured,
                            "issue": "single_source",
                            "detail": "one automated reading, nothing corroborates it"})
            continue
        vals = [(_to_ft(g.get("value"), g.get("unit")), g) for g in group]
        vals = [(v, g) for v, g in vals if v is not None]
        if len(vals) < 2:
            continue
        lo = min(v for v, _ in vals)
        hi = max(v for v, _ in vals)
        if lo <= 0:
            continue
        ratio = hi / lo
        if abs(ratio - 1.0) < 0.02:
            continue
        issue = "contradiction"
        detail = "%s values disagree: %s" % (
            kind, ", ".join("%g %s" % (g.get("value"), g.get("unit")) for _, g in vals))
        if abs(ratio - (1 / M_PER_FT)) < 0.05:
            issue = "unit_confusion"
            detail = ("%s values differ by almost exactly 3.28, which is feet "
                      "against metres, not a real disagreement: %s" % (
                          kind, ", ".join("%g %s" % (g.get("value"), g.get("unit"))
                                          for _, g in vals)))
        out.append({"level": "flag", "kind": kind, "measured": measured,
                    "issue": issue, "detail": detail})
    return out


def fact_value(facts, kind, measured="", unit="ft"):
    """The one value to build from, or None if nothing here is settled.

    A SINGLE AUTOMATED READING IS NOT A FACT. This rule was not in the first
    version and running the line on a real landmark is what put it there.
    Wikidata records the Brooklyn Bridge's total length as 5989 metres. That
    is 5989 FEET, its real length, sitting in the metres column: read as
    metres it makes the bridge 19,649 ft long, three and a quarter times its
    true size. The plausibility check did not catch it, because a height
    ceiling says nothing about a length, and no contradiction check caught it
    either, because there was nothing to contradict.

    Corroboration is what catches it. The same number from two independent
    sources, or one a person entered, can be built on. One machine reading on
    its own is recorded, flagged, and waits.

    The second reason is subtler and was also found by running it: preferring
    a human value and discarding the automated one made the alignment check
    self-confirming, comparing the model against the very number the model
    was built from and reporting a perfect match. Human values still win, but
    the automated reading has to agree with them or the fact is contested."""
    cands = [f for f in facts
             if f.get("kind") == kind and (f.get("measured") or "") == measured]
    if not cands:
        return None
    vals = [(_to_ft(f.get("value"), f.get("unit")), f) for f in cands]
    vals = [(v, f) for v, f in vals if v is not None]
    if not vals:
        return None
    fams = {f.get("family") or source_family(f.get("source"), f.get("origin"))
            for _, f in vals}
    if "human" not in fams and len(fams) < 2:
        return None
    spread = max(v for v, _ in vals) / max(min(v for v, _ in vals), 1e-9)
    if spread > 1.02:
        return None
    def rank(pair):
        f = pair[1]
        fam = f.get("family") or source_family(f.get("source"), f.get("origin"))
        return FAMILY_RANK.get(fam, 2)
    ft = sorted(vals, key=rank)[0][0]
    return ft if unit == "ft" else ft * M_PER_FT


def corroboration(facts, kind, measured=""):
    """Every reading for one dimension, so agreement is visible, not assumed."""
    out = []
    for f in facts:
        if f.get("kind") != kind or (f.get("measured") or "") != measured:
            continue
        ft = _to_ft(f.get("value"), f.get("unit"))
        out.append({"source": f.get("source"), "origin": f.get("origin"),
                    "as_given": "%g %s" % (f.get("value"), f.get("unit")),
                    "ft": round(ft, 2) if ft is not None else None})
    return out


# --------------------------------------------------------------------------
# stage 1: find


def find_candidates(limit=None, timeout=90):
    """Ask Wikidata which places carry the National Historic Landmark
    designation, and take a page of them.

    [SEAN chose the federal list, 2026-08-31.] 2,519 items carried the
    designation when this was probed. Coordinates are on all of them, an
    architectural style on about 45%, a construction date on about 52%, and a
    height on only 7%, so this seeds a candidate and its context; it does not
    pretend to supply the dimensions a model needs."""
    limit = int(limit or FIND_LIMIT)
    q = """SELECT ?x ?xLabel ?styleLabel ?inception ?coord ?admin WHERE {
  ?x wdt:P1435 wd:%s .
  OPTIONAL { ?x wdt:P149 ?style }
  OPTIONAL { ?x wdt:P571 ?inception }
  OPTIONAL { ?x wdt:P625 ?coord }
  OPTIONAL { ?x wdt:P131 ?adminItem . ?adminItem rdfs:label ?admin
             FILTER(LANG(?admin) = "en") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
} LIMIT %d""" % (NHL_ITEM, limit)
    url = WD_SPARQL + "?format=json&query=" + urllib.parse.quote(q)
    req = urllib.request.Request(url, headers={
        "User-Agent": UA, "Accept": "application/sparql-results+json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as f:
            rows = json.load(f)["results"]["bindings"]
    except Exception as e:
        return {"ok": False, "error": str(e)[:160], "candidates": []}

    seen, out = set(), []
    for r in rows:
        qid = r["x"]["value"].rsplit("/", 1)[-1]
        name = r.get("xLabel", {}).get("value", "")
        if not name or name.startswith("Q") and name[1:].isdigit():
            continue
        if qid in seen:
            continue
        seen.add(qid)
        out.append({
            "qid": qid,
            "name": name,
            "slug": _slug(name),
            "style": r.get("styleLabel", {}).get("value", ""),
            "inception": r.get("inception", {}).get("value", "")[:10],
            "coord": r.get("coord", {}).get("value", ""),
            "where": r.get("admin", {}).get("value", ""),
            "source": "Wikidata",
            "source_url": "https://www.wikidata.org/wiki/" + qid,
        })
    return {"ok": True, "candidates": out}


def _slug(name):
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s[:60]


# --------------------------------------------------------------------------
# stage 3: align


NUM_RE = re.compile(r"\d[\d,]*\.?\d*")


def check_alignment(model_dims, facts, tol=0.02):
    """Compare what the model was built to against what the record says.

    model_dims is {kind: (value, unit, measured)}. A model is aligned when
    every dimension it declares matches a fact within tolerance. A dimension
    the fact table cannot settle is reported as unverifiable rather than
    passed, because silence is how a wrong number survives."""
    findings = []
    for kind, spec in sorted(model_dims.items()):
        value, unit, measured = (list(spec) + ["", ""])[:3] if isinstance(spec, (list, tuple)) else (spec, "ft", "")
        want = fact_value(facts, kind, measured or "", "ft")
        got = _to_ft(value, unit)
        if got is None:
            findings.append({"kind": kind, "status": "bad_unit",
                             "detail": "model declares unit %r" % unit})
            continue
        if want is None:
            findings.append({"kind": kind, "status": "unverifiable",
                             "detail": "no agreed fact for this dimension"})
            continue
        off = abs(got - want) / max(want, 1e-9)
        findings.append({
            "kind": kind,
            "status": "aligned" if off <= tol else "mismatch",
            "model_ft": round(got, 2),
            "fact_ft": round(want, 2),
            "off_pct": round(off * 100, 2),
            "corroboration": corroboration(facts, kind, measured or ""),
        })
    return findings


# --------------------------------------------------------------------------
# stage 5: audit


UNIT_WORDS = (
    r"feet|foot|ft|inches|inch|in\.|metres|meters|metre|meter|m\b|km|miles|mile|"
    r"tons|tonnes|ton|pounds|lbs|"
    r"英尺|英寸|米|公里|英里|吨|"
    r"pies|pie|metros|metro|pulgadas|toneladas|"
    r"피트|미터|인치|톤|"
    r"b\u1ed9|m\u00e9t|t\u1ea5n|t\u1ea7ng"
)
MEASURED_RE = re.compile(
    r"(\d[\d.,]*\d|\d)\s*(?:%s)" % UNIT_WORDS, re.IGNORECASE)


# Languages that write 1.046 for one thousand and forty-six, and 1,5 for one
# and a half. Reading those with English rules turns 1,046 feet into 1.046
# feet, and then the translation check reports a disagreement between the
# English and the Spanish that does not exist. Found by running the audit on
# our own shipped stories, which is the failure this whole stage is for.
# Floors are deliberately NOT units here. "78th floor" and "78 floors" are
# different claims, and only some languages mark the ordinal: English writes
# 78th, Korean writes 78층 for both. Counting 층 as a unit made the Korean
# text look as though it carried three measurements the English did not, and
# the translation check reported a disagreement that was really a grammar
# difference. Counts are out of scope, said once, here.
DOT_THOUSANDS_LANGS = {"es", "vi", "de", "it", "pt"}


def _parse_number(raw, lang="en"):
    raw = raw.strip()
    if lang in DOT_THOUSANDS_LANGS:
        if re.fullmatch(r"\d{1,3}(?:\.\d{3})+(?:,\d+)?", raw):
            raw = raw.replace(".", "").replace(",", ".")
        elif re.fullmatch(r"\d+,\d+", raw):
            raw = raw.replace(",", ".")
        else:
            raw = raw.replace(",", "")
    else:
        raw = raw.replace(",", "")
    try:
        return float(raw)
    except Exception:
        return None


def _measured_numbers(text, lang="en"):
    """Only the figures that claim a measurement.

    The first version of this read EVERY number in the prose and produced 73
    findings on one story, firing on "21 elephants" and "May 24". A check
    that flags everything is worse than no check, because the flags stop
    being read while the page still says it was audited.

    A measurement is a number with a unit attached to it, in any of the five
    languages the stories are written in. That is also exactly the set of
    claims the fact table could ever settle, so the check now has the same
    scope as the evidence behind it. Counts and dates are out of scope and
    are said to be, rather than being flagged and ignored."""
    out = set()
    for m in MEASURED_RE.finditer(text or ""):
        v = _parse_number(m.group(1), lang)
        if v is not None:
            out.add(v)
    return out


def audit_story(stories, facts, langs=("en", "zh", "es", "ko", "vi")):
    """Read the prose back against the numbers it is allowed to use.

    Two checks, and neither is a judgement about the world.

    UNSUPPORTED MEASUREMENT. Every figure carrying a unit is looked for in
    the fact table. One that is absent is flagged for a person to look at.

    DISAGREEING TRANSLATIONS. The same story in five languages should carry
    the same measurements. When the English says 1,595 feet and the Spanish
    says 1,495 pies, one is a typo, and this is the only check that will ever
    catch it, because nobody proof-reads five languages against each other."""
    known = set()
    for f in facts:
        try:
            fv = float(f.get("value"))
        except Exception:
            continue
        for x in (fv, fv / M_PER_FT, fv * M_PER_FT):
            known.add(round(x))
            known.add(round(x, 1))
    findings = []
    per_lang = {}
    for lang in langs:
        text = stories.get(lang) or ""
        if not text:
            continue
        nums = _measured_numbers(text, lang)
        per_lang[lang] = nums
        for n in sorted(nums):
            if round(n) in known or round(n, 1) in known:
                continue
            findings.append({"lang": lang, "issue": "unsupported_measurement",
                             "value": n,
                             "detail": "carries a unit, not in the facts"})
    if len(per_lang) > 1:
        base = per_lang.get("en") or next(iter(per_lang.values()))
        for lang, nums in per_lang.items():
            if lang == "en":
                continue
            for n in sorted(base - nums):
                findings.append({"lang": lang, "issue": "figure_dropped",
                                 "value": n, "detail": "in English, absent here"})
            for n in sorted(nums - base):
                findings.append({"lang": lang, "issue": "figure_added",
                                 "value": n, "detail": "here, absent from English"})
    return findings


def audit_sources(research):
    """A story's research is only as good as the trail behind it."""
    joined = " ".join(research or [])
    has_sources = bool(re.search(r"(?i)\bsources?\s*:", joined))
    urls = re.findall(r"https?://\S+", joined)
    named = re.findall(r"(?i)sources?\s*:\s*(.+)", joined)
    return {
        "has_sources_line": has_sources,
        "url_count": len(urls),
        "named": (named[0][:300] if named else ""),
        "level": "ok" if has_sources else "flag",
    }


# --------------------------------------------------------------------------
# a second read, for coverage rather than corroboration

INFOBOX_FIELDS = {
    "height": ("height", ""),
    "mainspan": ("span", "main"),
    "main_span": ("span", "main"),
    "length": ("length", "total"),
    "width": ("width", ""),
    "elevation": ("elevation", ""),
}

_CONV_RE = re.compile(r"\{\{\s*convert\s*\|\s*([\d.,]+)\s*\|\s*([a-zA-Z]+)", re.I)
_FIELD_RE = re.compile(r"\|\s*([a-z_ ]+?)\s*=\s*(.+)")


def fetch_wikipedia_dims(page, timeout=30):
    """Read the dimensions out of an article's infobox.

    This is a COVERAGE source, not a corroborating one. Wikipedia and
    Wikidata are the same family here, so a figure that appears in both is
    still one witness. What this adds is reach: Wikidata carried a height for
    7% of landmarks in the probe, and the infobox carries dimensions for many
    of the ones it misses, including spans and lengths it never holds at all.

    Values usually sit inside a {{convert}} template, which states the number
    in its original unit and lets the wiki render the other. The original is
    the one taken; a bare number with no unit is returned marked "?" and is
    refused downstream rather than assumed to be feet."""
    url = ("https://en.wikipedia.org/w/api.php?action=parse&format=json"
           "&prop=wikitext&page=" + urllib.parse.quote(page.replace(" ", "_")))
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as f:
            wt = json.load(f)["parse"]["wikitext"]["*"]
    except Exception as e:
        return {"ok": False, "error": str(e)[:140], "facts": []}

    src = "Wikipedia infobox"
    url_page = "https://en.wikipedia.org/wiki/" + page.replace(" ", "_")
    out = []
    for line in wt.split("\n")[:260]:
        m = _FIELD_RE.match(line.strip())
        if not m:
            continue
        key = m.group(1).strip().lower().replace(" ", "_")
        if key not in INFOBOX_FIELDS:
            continue
        kind, measured = INFOBOX_FIELDS[key]
        c = _CONV_RE.search(m.group(2))
        if c:
            unit = c.group(2).lower()
            unit = {"foot": "ft", "feet": "ft", "metre": "m", "meter": "m"}.get(unit, unit)
            if unit not in ("ft", "m"):
                continue
            try:
                val = float(c.group(1).replace(",", ""))
            except Exception:
                continue
            out.append(make_fact(kind, val, unit, src, url_page,
                                 measured=measured, note="infobox " + key))
    return {"ok": True, "facts": out}


# --------------------------------------------------------------------------
# stage 2: compose a model from what is settled

FORMS = ("shaft", "block", "bridge")


def compose_spec(slug, facts, style="", name=""):
    """Turn settled facts into something buildable, or refuse and say why.

    This is what makes the line scale. A model written by hand is a model per
    landmark; a model composed from a spec is a model per SHAPE, and the
    shapes repeat across the whole country. An obelisk is an obelisk whether
    it stands in Washington or Charlestown; only its numbers differ.

    It refuses more often than it builds, and that is the design. Every
    dimension comes through fact_value, which returns nothing unless the
    sources agree and more than one family stands behind them. A landmark
    with a height nobody has corroborated produces a refusal carrying the
    reason, not a model carrying a guess. A guess would render, look
    finished, and be wrong in a way no one would think to check."""
    def dim(kind, measured=""):
        return fact_value(facts, kind, measured, "ft")

    height, height_at = None, ""
    for tag in ("shaft", "tower", ""):
        v = dim("height", tag)
        if v is not None:
            height, height_at = v, tag
            break
    base_w = dim("base_width", "base") or dim("width")
    top_w = dim("top_width", "top")
    span = dim("span", "main")

    missing = []
    if span is not None:
        form = "bridge"
        if height is None:
            missing.append("tower height")
    elif height is not None and base_w is not None and top_w is not None:
        form = "shaft"
    elif height is not None and base_w is not None:
        form = "block"
    else:
        form = None
        if height is None:
            missing.append("height")
        if base_w is None:
            missing.append("base width")

    if form is None or missing:
        return {"ok": False, "slug": slug, "form": form,
                "missing": missing or ["a shape"],
                "reason": "not enough corroborated facts to build from"}

    spec = {"ok": True, "slug": slug, "name": name or slug, "form": form,
            "style": style or "", "dims": {}, "built_from": []}
    # The measured tag has to be the one the value actually came from. It was
    # hardcoded to "shaft" while the Brooklyn Bridge's height is recorded
    # against "tower", so the page printed the dimension with NO source under
    # it. On a page whose whole claim is provenance, a number with nothing
    # behind it is the exact failure it exists to prevent.
    for label, val, measured, kind in (
            ("height", height, height_at, "height"),
            ("base_width", base_w, "base", "base_width"),
            ("top_width", top_w, "top", "top_width"),
            ("span", span, "main", "span"),
            ("side_span", dim("side_span", "side"), "side", "side_span"),
            ("deck_height", dim("deck_height", "centre"), "centre", "deck_height")):
        if val is None:
            continue
        spec["dims"][label] = round(val, 2)
        spec["built_from"].append({
            "dim": label,
            "sources": corroboration(facts, kind, measured),
        })
    # WHAT WOULD MAKE THIS MODEL TRUER, if a source confirmed it.
    #
    # Some dimensions are not needed to build a shape but change what the
    # shape IS. A suspension bridge without its side spans and anchorages is
    # drawn with the deck stopping in mid-air at each tower, which is a real
    # bridge missing the parts that hold it up. The dimension exists in the
    # record, it simply has one witness, so the composer will not use it.
    #
    # Saying so is better than either using it quietly or dropping it
    # silently. The page can then tell a reader what the model is waiting
    # for, which is also a list of what a person could usefully confirm.
    optional = [("side_span", "side"), ("deck_height", "centre"),
                ("top_width", "top")]
    for kind, tag in optional:
        if kind in spec["dims"]:
            continue
        have = [f for f in facts
                if f.get("kind") == kind and (f.get("measured") or "") == tag]
        if have and fact_value(facts, kind, tag, "ft") is None:
            spec.setdefault("could_improve", []).append({
                "dim": kind,
                "seen": ["%g %s (%s)" % (f.get("value"), f.get("unit"),
                                         f.get("source")) for f in have],
                "why": "one source only, so it is recorded and not drawn",
            })

    if form == "shaft" and base_w:
        spec["lean"] = round((base_w - (top_w or base_w)) / (2.0 * height), 4)
    return spec
