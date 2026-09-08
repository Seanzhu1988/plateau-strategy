#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""The language routine: keep every language level with the English, every day.

[SEAN 2026-09-07: "also we put language routine, every 24 hours this language
will try to refine theirselves if there is new built it get language to be
aligned, now i want mininum 7 languages to be formed at this moment. if it lack
of accuratecy read some high volume social media post and learn them."]

    python3 language_routine.py status                 what every language is missing
    python3 language_routine.py gaps --lang fr -n 120  the next lines to translate
    python3 language_routine.py apply --lang fr -f x.json    write translations in
    python3 language_routine.py verify                 the mechanical checks
    python3 language_routine.py stories                book coverage, per language
    python3 language_routine.py glossary               the agreed place names
    python3 language_routine.py build                  rebuild the packs

THE SHAPE OF THE PROBLEM. English is written constantly: a new page, a new
button, a landmark the routine wrote overnight. Every one of those lines is
born untranslated, and nothing used to notice. build_i18n.py refuses to write
packs while a VISITOR page has an untranslated line, which catches the worst
case loudly, and it is also why one untranslated Empire State line on the
morning of 2026-09-07 stopped every pack in every language from rebuilding for
a day. A gate with no routine behind it eventually blocks the thing it protects.

So: the gate stays, and this walks in front of it.

WHAT THIS FILE DOES AND DOES NOT DO. It does the mechanical half, which is the
half a machine should own: find what is missing, rank it, write answers in
safely, and check them. It does NOT translate. Translation is judgement, so it
is done by the model running the daily task, which reads `gaps`, writes the
words, and hands them back to `apply`. That split is deliberate: the checks
below then run against the model's output rather than being the same program
marking its own homework.

THE CHECKS ARE THE POINT. A wrong translation is worse than a missing one,
because a missing one shows English and a wrong one shows confidence. So every
translation passes through verify() before it is written, and the checks are the
failure modes this project has actually hit:

  placeholders  psxFmt translates the PATTERN and drops values in after, so
                "{n} travellers" must still contain {n}. A translation that
                drops it renders a sentence with a hole, and a translation that
                renames it renders the literal word "{n}". This is the check
                that matters most and it is exact, not advisory.
  long dashes   Sean's standing rule for everything a person reads. The server
                enforces it for posted content; nothing enforced it here.
  echo          a "translation" identical to the English is an untranslated
                line wearing a translated line's clothes, and it is invisible
                in coverage counts unless something looks for it.
  markup        a model that helpfully adds <b> writes literal tags onto the
                page, because the engine sets textContent, not innerHTML.
  length        a translation a quarter the length or four times the length of
                its English is usually a refusal, a summary, or an answer to a
                different question. Per language, because Chinese is genuinely
                short and German is genuinely long.
"""
import argparse
import io
import json
import os
import re
import subprocess
import sys
import contextlib
from collections import Counter

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
import languages as L

GLOSSARY_PATH = os.path.join(BASE, "i18n_glossary.json")
STYLE_DIR = os.path.join(BASE, "i18n_style")

# The pages a reader actually opens, from traffic.json, so the queue is ordered
# by who is waiting rather than alphabetically.
TRAFFIC_PATH = os.path.join(BASE, "traffic.json")


# ---- one extractor, borrowed from the builder ----------------------------
#
# The set of covered pages, the exclusions, and the rule for what counts as a
# visible line all live in build_i18n.py. Copying them here would create a
# second definition that drifts, and the drift would be silent: this file would
# report full coverage for a page the builder still considers short. So the
# builder's own prefix, everything up to its coverage report, is executed and
# its results read. If the marker ever moves, this fails loudly rather than
# quietly measuring the wrong thing.
_MARK = "# ---- coverage report ----"


def collect():
    src = open(os.path.join(BASE, "build_i18n.py"), encoding="utf-8").read()
    if _MARK not in src:
        raise SystemExit("build_i18n.py no longer has %r; the seam moved, fix this file." % _MARK)
    g = {"__name__": "build_i18n_prefix", "__file__": os.path.join(BASE, "build_i18n.py")}
    with contextlib.redirect_stdout(io.StringIO()):
        exec(compile(src[:src.index(_MARK)], "build_i18n_prefix", "exec"), g)
    return g


def _traffic_weight():
    """pageviews per path over the recorded days, as a path -> count map."""
    try:
        with open(TRAFFIC_PATH, encoding="utf-8") as f:
            days = (json.load(f) or {}).get("days") or {}
    except Exception:
        return {}
    w = Counter()
    for d in days.values():
        for path, n in (d.get("paths") or {}).items():
            w[path.strip("/") or "landing-page"] += n
    return w


def _page_traffic(page):
    """A page filename mapped onto the paths traffic.json records."""
    stem = page[:-5] if page.endswith(".html") else page
    w = _TRAFFIC
    return w.get(stem, 0) + (w.get("landing-page", 0) if stem == "landing-page" else 0)


_TRAFFIC = _traffic_weight()


# ---- what each language has ---------------------------------------------

def side_table(code):
    p = os.path.join(BASE, L.side_file(code))
    try:
        with open(p, encoding="utf-8") as f:
            d = json.load(f)
        return d if isinstance(d, dict) else {}
    except Exception:
        return {}


def have(code, g):
    """english -> translation, for one language, whatever carries it."""
    TR = g["TR"]
    info = L.BY_CODE[code]
    if info["carrier"] == "column":
        i = info["column"]
        return {k: v[i] for k, v in TR.items()
                if isinstance(v, (list, tuple)) and len(v) > i and v[i]}
    return {k: v for k, v in side_table(code).items() if v}


def live_lines(g):
    """Lines a reader can see RIGHT NOW: on a page, and in the dictionary.

    The dictionary also holds 841 entries that no longer appear anywhere, kept
    in case the wording comes back. Translating those first would be work no
    reader is waiting for, so they rank last, not never.
    """
    strings, TR, SKIP = g["strings"], g["TR"], g["SKIP"]
    return [s for s in strings if s in TR and s not in SKIP]


def rank(g):
    """A score per English line: who is waiting for it, and how badly.

    Site chrome beats a deep page because it is on every screen; a visitor page
    beats an agent page because the switcher exists for visitors; a page people
    actually open beats one nobody has; and among equals the short line goes
    first, because a hundred short lines shipped beat ten long ones pending.
    """
    PAGE, VIS = g["PAGE_STRINGS"], g["VISITOR"]
    pages_of = {}
    for page, lines in PAGE.items():
        for s in lines:
            pages_of.setdefault(s, []).append(page)
    out = {}
    for s, pages in pages_of.items():
        spread = len(pages)
        visitor = any(p in VIS for p in pages)
        traffic = max((_page_traffic(p) for p in pages), default=0)
        out[s] = (spread * 100) + (500 if visitor else 0) + min(traffic, 400) - min(len(s) // 20, 20)
    return out


# ---- the checks ----------------------------------------------------------

PLACEHOLDER = re.compile(r"\{(\w+)\}")
LONG_DASH = re.compile(r"[–—]")
TAGGY = re.compile(r"</?[a-zA-Z][^>]*>")

# A translation may legitimately be much shorter (Chinese) or much longer
# (Vietnamese). These are the outer walls, not a style opinion.
#
# MEASURED, NOT GUESSED. The first version of this table was invented and it
# flagged 32 lines, of which 31 were correct translations: "Somewhere to sleep"
# is 住宿 in Chinese and that is right, not short. So the bounds now come from
# this site's own corpus, 1,117 translated sentences per language on 2026-09-07,
# floor just under the 0.005 percentile and ceiling just over the 0.999. A
# translation outside them is genuinely unlike every other translation we have.
#   zh p0.005 0.152 / p0.999 1.000      ko 0.222 / 1.050
#   es 0.667 / 1.862                    vi 0.545 / 1.771      ja 0.212 / 1.050
# `python3 language_routine.py bounds` re-derives them; when fr, de and pt have
# corpora of their own, retighten these from measurement rather than opinion.
LENGTH_BOUNDS = {
    "zh": (0.14, 1.25), "ja": (0.19, 1.30), "ko": (0.20, 1.35),
    "es": (0.60, 2.00), "vi": (0.50, 2.00),
    # no corpus yet: es and vi's shape, widened, German widest because it is
    "fr": (0.55, 2.10), "de": (0.55, 2.30), "pt": (0.55, 2.10),
}
DEFAULT_BOUNDS = (0.30, 2.60)
# Below this the ratio means nothing: a two word label compresses far harder
# than a sentence, and every short line the invented bounds flagged was right.
MIN_LEN_FOR_RATIO = 20

# Function words. Their presence is what separates a SENTENCE, which must be
# translated, from a NAME, which usually should not be: a Spanish reader looking
# for the Old North Church needs to read it off the sign in English.
_FUNC = set("the a an of and or to in on for with is are was you your it this "
            "that from at by as be we our not have has do does will can".split())


def _is_sentence(en):
    words = re.findall(r"[A-Za-z']+", en)
    return len(words) >= 3 and any(w.lower() in _FUNC for w in words)


def _keep_english():
    """Lines deliberately identical in every language, as an explicit decision.

    Without this file, "we chose to keep the English name" and "nobody has
    translated this yet" look exactly alike, and the second hides behind the
    first. Named here, an echo is a decision; anywhere else it is a miss."""
    try:
        with open(os.path.join(BASE, "i18n_keep_english.json"), encoding="utf-8") as f:
            d = json.load(f)
        return set(d.get("keep") or [])
    except Exception:
        return set()


KEEP_ENGLISH = _keep_english()


def check_one(en, tr, code):
    """Every fault in one translation, as plain sentences. Empty list = clean."""
    bad = []
    if tr is None or not str(tr).strip():
        return ["empty"]
    tr = str(tr)
    want = sorted(PLACEHOLDER.findall(en))
    got = sorted(PLACEHOLDER.findall(tr))
    if want != got:
        bad.append("placeholders differ: english has %s, translation has %s"
                   % (want or "none", got or "none"))
    if LONG_DASH.search(tr):
        bad.append("contains a long dash, which this site never uses")
    if tr.strip() == en.strip() and _is_sentence(en) and en not in KEEP_ENGLISH:
        bad.append("identical to the English, so it is not translated")
    # A single character standing in for three or more English words is a
    # fragment, not a compression: 中文 for "Somewhere to sleep" is right, 第
    # for "Night after Day" is the tail of a sentence that got cut.
    if len(en.split()) >= 3 and len(tr.strip()) <= 1:
        bad.append("one character for %d English words, so it is a fragment"
                   % len(en.split()))
    if TAGGY.search(tr) and not TAGGY.search(en):
        bad.append("introduces markup; the engine writes text, so tags print literally")
    lo, hi = LENGTH_BOUNDS.get(code, DEFAULT_BOUNDS)
    if len(en) >= MIN_LEN_FOR_RATIO:
        r = len(tr) / float(len(en))
        if r < lo or r > hi:
            bad.append("length %.2f times the English, outside %.2f to %.2f for %s"
                       % (r, lo, hi, code))
    return bad


def _accepted():
    """Lines a person has looked at and judged fine, per language.

    Every bound here is a percentile, so by construction a few real lines sit
    outside it: "EN REFORMA" for "UNDER RECONSTRUCTION" is short and correct.
    Without somewhere to record that judgement the same handful of correct
    lines is reported every single day, and a daily report that is never clean
    stops being read, which costs more than the checks are worth. Reviewed and
    accepted goes here; anything not here is either clean or new.

    A line listed under "*" is accepted in EVERY language. That key exists
    because "UNDER RECONSTRUCTION" was flagged as too short in Spanish, then
    French, then German, then Portuguese, then Japanese, and recorded five
    separate times. When five unrelated languages all say a phrase shorter than
    the English, the fact being measured is a property of the ENGLISH, and
    re-litigating it for language nine and language ten is waste."""
    try:
        with open(os.path.join(BASE, "i18n_checked.json"), encoding="utf-8") as f:
            d = json.load(f)
        acc = d.get("accepted") or {}
        every = set(acc.get("*") or [])
        out = {}
        for code in L.TRANSLATED:
            out[code] = set(acc.get(code) or []) | every
        return out
    except Exception:
        return {}


def verify(codes=None, quiet=False):
    """Faults, LIVE ones first.

    A bad translation of a line no page shows any more harms nobody: 841 of the
    dictionary's entries are wording that changed, kept in case it comes back.
    Reporting those beside a line a reader is looking at right now flattens the
    difference that matters, so they are counted and shown apart."""
    g = collect()
    live = set(live_lines(g))
    ok = _accepted()
    codes = codes or L.TRANSLATED
    faults = 0
    for code in codes:
        table = have(code, g)
        seen = ok.get(code, set())
        hot, cold = [], []
        for en, tr in table.items():
            if en in seen:
                continue
            why = check_one(en, tr, code)
            if why:
                (hot if en in live else cold).append((en, tr, why))
        faults += len(hot)
        if not quiet:
            mark = ("ok" if not hot else "%d ON A LIVE PAGE" % len(hot))
            extra = (", %d on lines no page shows" % len(cold)) if cold else ""
            print("%-4s %5d translated   %s%s" % (code, len(table), mark, extra))
            for en, tr, why in hot[:12]:
                print("      %s" % "; ".join(why))
                print("        en: %s" % en[:90])
                print("        %s: %s" % (code, str(tr)[:90]))
            if len(hot) > 12:
                print("      ... and %d more live" % (len(hot) - 12))
    return faults


# ---- the commands --------------------------------------------------------

def cmd_status(args):
    g = collect()
    live = live_lines(g)
    total_dict = len(g["TR"])
    print("English lines a reader can see right now: %d" % len(live))
    print("dictionary entries in all (some no longer on any page): %d" % total_dict)
    print()
    print("%-4s %-22s %7s %7s %8s   %s" % ("", "language", "live", "of", "covered", "carrier"))
    for code in L.TRANSLATED:
        table = have(code, g)
        got = sum(1 for s in live if table.get(s))
        pct = 100.0 * got / max(1, len(live))
        print("%-4s %-22s %7d %7d %7.1f%%   %s"
              % (code, L.ENGLISH_NAME[code], got, len(live), pct,
                 L.BY_CODE[code]["carrier"]))
    print()
    worst = []
    for code in L.TRANSLATED:
        table = have(code, g)
        miss = [s for s in live if not table.get(s)]
        if miss:
            worst.append((len(miss), code))
    if worst:
        worst.sort(reverse=True)
        print("the queue, largest first: " + ", ".join("%s %d" % (c, n) for n, c in worst))
    else:
        print("every visible line is translated into every language.")


def cmd_gaps(args):
    g = collect()
    live = live_lines(g)
    scores = rank(g)
    table = have(args.lang, g)
    miss = [s for s in live if not table.get(s)]
    if args.all:
        miss += [s for s in g["TR"] if s not in set(live) and not table.get(s)]
    miss.sort(key=lambda s: -scores.get(s, 0))
    if args.limit:
        miss = miss[:args.limit]
    if args.json or args.out:
        payload = {"lang": args.lang,
                   "english_name": L.ENGLISH_NAME[args.lang],
                   "lines": miss}
        text = json.dumps(payload, ensure_ascii=False, indent=1)
        if args.out:
            open(args.out, "w", encoding="utf-8").write(text)
            print("%d lines for %s written to %s" % (len(miss), args.lang, args.out))
        else:
            print(text)
        return
    for s in miss:
        print(s)


def cmd_apply(args):
    """Write translations in. Refuses the whole batch if any line fails a check.

    All or nothing on purpose. A partial write leaves the file in a state
    nobody chose, and the caller cannot tell which half landed.
    """
    code = args.lang
    info = L.BY_CODE.get(code)
    if not info:
        raise SystemExit("%s is not a language in languages.py" % code)
    if info["carrier"] != "side":
        raise SystemExit(
            "%s is carried as a column in i18n_extra.py, not its own file.\n"
            "Those four are edited in place; this command only writes side files." % code)
    pairs = json.load(open(args.file, encoding="utf-8"))
    if isinstance(pairs, dict) and "pairs" in pairs:
        pairs = pairs["pairs"]
    if not isinstance(pairs, dict):
        raise SystemExit("expected a json object of {english: translation}")

    g = collect()
    known = set(g["TR"]) | set(g["strings"])
    existing = side_table(code)

    # apply and verify must agree, or a line verify has passed is refused on
    # the way in and there is no way to get it accepted. They did not agree:
    # UNDER RECONSTRUCTION was recorded as reviewed and still bounced here.
    ok_already = _accepted().get(code, set())

    faults, unknown, skipped = [], [], 0
    clean = {}
    for en, tr in pairs.items():
        if en not in known:
            unknown.append(en)
            continue
        if en in existing and existing[en] and not args.refine:
            skipped += 1
            continue
        why = [] if en in ok_already else check_one(en, tr, code)
        if why:
            faults.append((en, tr, why))
        else:
            clean[en] = str(tr).strip()

    for en, tr, why in faults[:15]:
        print("REFUSED: %s" % "; ".join(why))
        print("   en: %s" % en[:100])
        print("   %s: %s" % (code, str(tr)[:100]))
    if unknown[:5]:
        print("NOT ON ANY PAGE (ignored): %d, e.g. %r" % (len(unknown), unknown[0][:70]))
    if faults:
        raise SystemExit("\n%d of %d failed the checks. Nothing written; fix and resend."
                         % (len(faults), len(pairs)))

    merged = dict(existing)
    merged.update(clean)
    path = os.path.join(BASE, L.side_file(code))
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=1, sort_keys=True)
    os.replace(tmp, path)
    print("%s: wrote %d new, kept %d, skipped %d already present, file now %d lines"
          % (code, len(clean), len(existing), skipped, len(merged)))


def cmd_verify(args):
    n = verify([args.lang] if args.lang else None)
    if n:
        raise SystemExit("%d faults" % n)
    print("\nclean")


def cmd_build(args):
    r = subprocess.run([sys.executable, os.path.join(BASE, "build_i18n.py")],
                       cwd=BASE, capture_output=True, text=True)
    tail = (r.stdout or "").strip().splitlines()
    print("\n".join(tail[-14:]))
    if r.returncode != 0:
        print(r.stderr[-2000:])
        raise SystemExit("build refused; an English line on a visitor page has no translation")


def cmd_bounds(args):
    """Re-derive the length bounds from what is actually translated.

    The table above is measurement, and measurement goes stale. This prints
    what the corpus says today, so a language that has grown its own corpus
    can have its guessed bounds replaced by real ones."""
    g = collect()
    print("english >= %d chars. floor = p0.005, ceiling = p0.999.\n" % MIN_LEN_FOR_RATIO)
    print("%-4s %6s %8s %8s %8s   %s" % ("", "n", "p0.005", "median", "p0.999", "in use"))
    for code in L.TRANSLATED:
        t = have(code, g)
        rows = sorted(len(str(v)) / len(k) for k, v in t.items()
                      if len(k) >= MIN_LEN_FOR_RATIO)
        n = len(rows)
        if n < 50:
            print("%-4s %6d   too few to measure, bounds are an estimate" % (code, n))
            continue
        lo, hi = LENGTH_BOUNDS.get(code, DEFAULT_BOUNDS)
        print("%-4s %6d %8.3f %8.3f %8.3f   %.2f to %.2f"
              % (code, n, rows[int(0.005 * n)], rows[n // 2],
                 rows[min(n - 1, int(0.999 * n))], lo, hi))


def cmd_stories(args):
    """The destination book carries its own per-language stories, and they are
    NOT the i18n packs: a pack translates the furniture, a story is written for
    the place. A book entry with an English story and no others is invisible to
    every reader who switched language, and the landmark routine skips an entry
    that already has story_en, so English-only is a permanent state unless
    something counts it."""
    p = os.path.join(BASE, "destinations.json")
    entries = (json.load(open(p, encoding="utf-8")) or {}).get("entries") or []
    have_en = [e for e in entries if (e.get("story_en") or "").strip()]
    print("book entries: %d, with an English story: %d" % (len(entries), len(have_en)))
    for code in L.CODES:
        n = sum(1 for e in have_en if (e.get("story_%s" % code) or "").strip())
        print("   story_%-3s %4d of %d  %5.1f%%" % (code, n, len(have_en),
                                                    100.0 * n / max(1, len(have_en))))
    gaps = Counter()
    for e in have_en:
        for code in L.TRANSLATED:
            if not (e.get("story_%s" % code) or "").strip():
                gaps[code] += 1
    if gaps:
        print("\nmissing stories: " + ", ".join("%s %d" % (c, n) for c, n in gaps.most_common()))


def cmd_glossary(args):
    """The agreed name for each of our places, in each language.

    [SEAN: "if it lack of accuratecy read some high volume social media post
    and learn them."] This file is where that reading lands. What real posts
    teach is not sentences worth copying, it is WHAT PEOPLE CALL THINGS: a
    Korean traveller writes 내셔널 몰, not a literal rendering of "National
    Mall", and a translation that invents its own name for a place is a
    translation nobody can search for and nobody can match to a sign. So the
    weekly step reads how the place is actually referred to, records the name
    here with where it was seen, and every later translation is held to it.
    Register and slang are deliberately NOT copied: this is a licensed guide's
    voice, and a tour that talks like a comment section reads as unserious."""
    try:
        gl = json.load(open(GLOSSARY_PATH, encoding="utf-8"))
    except Exception:
        gl = {}
    if not gl:
        print("no glossary yet. The weekly step writes it; see i18n_glossary.json.")
        return
    codes = [args.lang] if args.lang else L.TRANSLATED
    print("%-38s %s" % ("english", "  ".join("%-16s" % c for c in codes)))
    for en in sorted(gl):
        row = gl[en]
        print("%-38s %s" % (en[:38], "  ".join("%-16s" % (row.get(c) or "-")[:16] for c in codes)))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    sub = ap.add_subparsers(dest="cmd", required=True)

    sub.add_parser("status").set_defaults(fn=cmd_status)

    g = sub.add_parser("gaps")
    g.add_argument("--lang", required=True)
    g.add_argument("-n", "--limit", type=int, default=0)
    g.add_argument("--json", action="store_true")
    g.add_argument("--out")
    g.add_argument("--all", action="store_true",
                   help="include dictionary lines no page shows any more")
    g.set_defaults(fn=cmd_gaps)

    a = sub.add_parser("apply")
    a.add_argument("--lang", required=True)
    a.add_argument("-f", "--file", required=True)
    a.add_argument("--refine", action="store_true",
                   help="overwrite lines that already have a translation")
    a.set_defaults(fn=cmd_apply)

    v = sub.add_parser("verify")
    v.add_argument("--lang")
    v.set_defaults(fn=cmd_verify)

    sub.add_parser("bounds").set_defaults(fn=cmd_bounds)
    sub.add_parser("build").set_defaults(fn=cmd_build)
    sub.add_parser("stories").set_defaults(fn=cmd_stories)

    gl = sub.add_parser("glossary")
    gl.add_argument("--lang")
    gl.set_defaults(fn=cmd_glossary)

    args = ap.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
