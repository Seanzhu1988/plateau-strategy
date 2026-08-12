# -*- coding: utf-8 -*-
"""Translation quality gate.

Every register problem on this site was found the same way: the owner read a
page, was irritated, and said so. Then one page got fixed and the same fault
sat untouched on four others, 摸得门儿清 survived three separate passes on a
sign-up page nobody happened to open.

That is not a translation problem, it is a process problem. This is the fix:
the faults are named once, and the whole dictionary is checked against them
every time it is built.

    python3 check_i18n.py           # report
    python3 check_i18n.py --strict  # non-zero exit on any finding

Adding a rule here is how a lesson gets kept. If a reader ever finds another
phrase that reads wrong, the phrase goes in COLLOQUIAL and it can never come
back anywhere on the site.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------------------
# Register faults, by language. Each entry is (marker, why).
#
# Chinese is the list with teeth because it is the one a reader has checked.
# The others are thinner and honestly so: nobody in the loop reads them yet.
# ---------------------------------------------------------------------------
COLLOQUIAL = {
    "zh": [
        ("一门生意",   "market-stall talk for a line of trade; a company says 业务"),
        ("门儿清",     "Beijing street slang"),
        ("摸得",       "colloquial 'knows it inside out'"),
        ("大白话",     "'plain speech' said colloquially, undercuts its own claim"),
        ("一口价",     "haggling vocabulary; a service quotes 固定价格"),
        ("挣钱",       "spoken; 盈利 or 产生收入 in company prose"),
        ("挣来的钱",   "spoken; 收入"),
        ("靠车",       "spoken 'off the car'"),
        ("养着",       "feeds, as one feeds an animal"),
        ("眼下",       "spoken 'right now'; 目前"),
        ("没做完",     "spoken; 尚未完成"),
        ("谁都能",     "spoken; 任何人均可"),
        ("门儿",       "colloquial particle"),
        ("咱们",       "colloquial 'we'; 我们"),
        ("搞",         "vague colloquial verb"),
        ("挺",         "spoken intensifier"),
        ("有点儿",     "spoken"),
        ("一块儿",     "spoken"),
        ("滚雪球",     "cliché metaphor"),
        ("输血",       "cliché metaphor for funding"),
        ("站得住脚",   "spoken idiom"),
        ("两件事都能办", "spoken"),
        ("把那天讲完", "loose phrasing for a memorial"),
    ],
    "es": [
        ("guay", "slang"),
        ("chulo", "slang"),
        ("mola", "slang"),
    ],
    "ko": [
        # Korean has now been read. These are the faults that were in it, kept
        # here so no future pass can reintroduce them.
        ("당신", "not a neutral 'you' in Korean, commercial copy drops the pronoun"),
        ("우리는", "the plain 'we'; a company addressing a customer says 저희"),
        ("우리가", "same, 저희가"),
        ("우리의", "same, 저희의"),
        ("리드", "transliterated 'lead'; the term is 잠재 고객"),
        ("여정 계획 도구", "the Trip Planner is 여행 플래너 everywhere, or it is two products"),
        ("곳바로", "misspelling of 곧바로"),
    ],
    "vi": [
        # Vietnamese has now been read too.
        ("Cái này", "spoken deixis; name the thing"),
        ("tự lớn lên", "how a child grows, not how a collection grows"),
    ],
}

# Strings that are supposed to stay English.
SKIP_OK = set()
try:
    sys.path.insert(0, HERE)
    from i18n_extra import EXTRA_SKIP as SKIP_OK  # noqa: E402
except Exception:
    pass

LANGS = ["zh", "es", "ko", "vi"]


def load_dict():
    """Rebuild the {english: {lang: translation}} shape from the packs.

    It used to be parsed straight out of i18n.js, which held all four
    languages. The dictionary now ships as one file per language so that an
    English reader does not download 265 KB of Chinese, Spanish, Korean and
    Vietnamese to read a page in English, so this reads the packs and puts
    the shape back together. The checks below are unchanged; only where the
    strings live has moved."""
    D = {}
    for lang in LANGS:
        path = os.path.join(HERE, "i18n.%s.js" % lang)
        if not os.path.exists(path):
            raise SystemExit("missing %s, run build_i18n.py first" % os.path.basename(path))
        src = open(path, encoding="utf-8").read()
        m = re.search(r'window\.psxPack\(".*?",\s*(\{.*\})\);', src, re.S)
        if not m:
            raise SystemExit("could not find the pack body in %s" % os.path.basename(path))
        for k, v in json.loads(m.group(1)).items():
            D.setdefault(k, {})[lang] = v
    return D


def main():
    strict = "--strict" in sys.argv
    D = load_dict()
    problems = []

    # --- 1. register --------------------------------------------------------
    print("register")
    for lang, rules in COLLOQUIAL.items():
        hits = []
        for key, val in D.items():
            text = (val or {}).get(lang, "")
            if not text:
                continue
            for marker, why in rules:
                if marker in text:
                    hits.append((marker, why, key, text))
        if hits:
            print(f"  {lang}: {len(hits)} colloquial phrase(s)")
            for marker, why, key, text in hits[:8]:
                print(f"     {marker} , {why}")
                print(f"       EN {key[:70]}")
                print(f"       {lang.upper()} {text[:70]}")
            problems += hits
        else:
            print(f"  {lang}: clean")

    # --- 2. completeness ----------------------------------------------------
    print("\ncompleteness")
    for lang in LANGS:
        missing = [k for k, v in D.items() if not (v or {}).get(lang)]
        same = [k for k, v in D.items()
                if (v or {}).get(lang) and v[lang].strip() == k.strip()
                and k not in SKIP_OK and len(k) > 12]
        print(f"  {lang}: {len(D) - len(missing)}/{len(D)} translated"
              + (f", {len(missing)} missing" if missing else "")
              + (f", {len(same)} identical to English" if same else ""))
        problems += [("missing", lang, k, "") for k in missing]
        problems += [("untranslated", lang, k, "") for k in same]

    # --- 3. placeholders survive -------------------------------------------
    print("\nplaceholders")
    bad_ph = []
    for key, val in D.items():
        names = set(re.findall(r"\{(\w+)\}", key))
        if not names:
            continue
        for lang in LANGS:
            t = (val or {}).get(lang)
            if t and set(re.findall(r"\{(\w+)\}", t)) != names:
                bad_ph.append((lang, key, t))
    if bad_ph:
        print(f"  {len(bad_ph)} pattern(s) lost or renamed a placeholder:")
        for lang, key, t in bad_ph[:5]:
            print(f"     [{lang}] {key[:50]} -> {t[:50]}")
        problems += bad_ph
    else:
        print("  every {placeholder} survives translation")

    print("\n" + ("-" * 62))
    if problems:
        print(f"{len(problems)} finding(s)")
    else:
        print("clean: no colloquialisms, nothing missing, placeholders intact")
    return 1 if (problems and strict) else 0


if __name__ == "__main__":
    raise SystemExit(main())
