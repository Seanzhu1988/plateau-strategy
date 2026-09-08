# -*- coding: utf-8 -*-
"""The languages this site is published in. ONE list, read by everything else.

[SEAN 2026-09-07: "also we put language routine, every 24 hours this language
will try to refine theirselves if there is new built it get language to be
aligned, now i want mininum 7 languages to be formed at this moment."]

WHY THIS FILE EXISTS. Before it, the set of languages was written down in nine
places: build_i18n.py twice, app.py three times, translator.py, gallery_reader.py,
landmark_pipeline.py, i18n_coverage.py and check_i18n.py. Adding a language meant
finding all nine, and the proof that nobody can is already in the repo, Japanese
shipped in 2026 and check_i18n.py still checked four languages, so the one gate
that could have caught a missing Japanese line was blind to Japanese by
construction.

So the list lives here and every one of those nine reads it. Adding language ten
is one entry in this file, not a hunt.

HOW A LANGUAGE IS CARRIED. Two shapes, both supported, on purpose:

  column   The first four, zh/es/ko/vi, are the four values in each row of
           i18n_extra.EXTRA: {"English line": [zh, es, ko, vi]}. Changing that
           shape means touching twelve hundred rows, so it is left alone.
  side     Everything after them lives in its own flat file, i18n_<code>.json,
           {"English line": "translation"}. A language in its own file can be
           added, reviewed and corrected without touching a single existing
           translation. That was already the plan when Japanese arrived; this
           file just makes it the rule.

WHAT "SHIPPED" MEANS. A pack falls back to English per line, so a language with
half its lines is a half-English page, not a broken one. That is deliberate, and
it is also why coverage has to be measured and reported rather than assumed:
language_routine.py does that, every day.
"""

# code      the two-letter tag in ?lang=, localStorage ps_lang, and file names
# endonym   what the switcher shows, written in that language, never in English
# english   the name to hand a translation model, unambiguous
# carrier   "column" (index into the i18n_extra row) or "side" (own json file)
# since     when it was added here, so a partial pack has a knowable age
# why       the reason it is on the list. A language is a promise to a reader;
#           if nobody can say who that reader is, it should not be here.
LANGUAGES = [
    {"code": "en", "endonym": "English", "english": "English",
     "carrier": "source", "since": "2026-06",
     "why": "The source text. Every page is written in it, so it needs no pack."},

    {"code": "zh", "endonym": "中文", "english": "Simplified Chinese",
     "carrier": "column", "column": 0, "since": "2026-06",
     "why": "Sean's own first language, and the largest overseas visitor group "
            "for the museums this site guides."},

    {"code": "es", "endonym": "Español", "english": "Spanish",
     "carrier": "column", "column": 1, "since": "2026-06",
     "why": "The second language of the United States. Mexico is the single "
            "largest source of visitors to the country."},

    {"code": "ko", "endonym": "한국어", "english": "Korean",
     "carrier": "column", "column": 2, "since": "2026-06",
     "why": "A top-ten overseas market, and Korean travellers plan museum days "
            "in detail, which is what this site is for."},

    {"code": "vi", "endonym": "Tiếng Việt", "english": "Vietnamese",
     "carrier": "column", "column": 3, "since": "2026-06",
     "why": "Northern Virginia, minutes from the Mall, has one of the largest "
            "Vietnamese communities in the country."},

    {"code": "ja", "endonym": "日本語", "english": "Japanese",
     "carrier": "side", "since": "2026-08",
     "why": "A consistently top-five overseas market for United States travel."},

    # ---- added 2026-09-07 to meet Sean's floor of seven, and chosen because
    # each one has a reader behind it rather than to make a number ----

    {"code": "fr", "endonym": "Français", "english": "French",
     "carrier": "side", "since": "2026-09",
     "why": "Canada sends more visitors to the United States than any other "
            "country and Quebec reads French, plus France itself. This is the "
            "largest single gap in the old list."},

    {"code": "de", "endonym": "Deutsch", "english": "German",
     "carrier": "side", "since": "2026-09",
     "why": "Germany is reliably a top-three overseas market, and German "
            "travellers to Washington come for exactly the museum and memorial "
            "days this site plans."},

    {"code": "pt", "endonym": "Português", "english": "Brazilian Portuguese",
     "carrier": "side", "since": "2026-09",
     "why": "Brazil is a top-five overseas market. Brazilian Portuguese, not "
            "European, because that is where the visitors come from."},
]

# ---- the shapes the rest of the codebase asks for -------------------------

CODES = [l["code"] for l in LANGUAGES]                     # en first
TRANSLATED = [l["code"] for l in LANGUAGES if l["code"] != "en"]
COLUMN_ORDER = [l["code"] for l in LANGUAGES if l["carrier"] == "column"]
SIDE = [l["code"] for l in LANGUAGES if l["carrier"] == "side"]
PACK_ORDER = COLUMN_ORDER + SIDE                            # every language with a pack
ENDONYM = {l["code"]: l["endonym"] for l in LANGUAGES}
ENGLISH_NAME = {l["code"]: l["english"] for l in LANGUAGES}
BY_CODE = {l["code"]: l for l in LANGUAGES}


def side_file(code):
    """The flat {english: translation} file a side language lives in."""
    return "i18n_%s.json" % code


def switcher_pairs():
    """[[code, endonym], ...] for the browser switcher, English first."""
    return [[l["code"], l["endonym"]] for l in LANGUAGES]


def story_fields():
    """The destination-book story columns, one per language."""
    return ["story_%s" % c for c in CODES]


# A language that reads right to left needs more than a pack: the page itself
# has to flip. Nothing here does that yet, so nothing right-to-left is on the
# list, and this note is why rather than an oversight to rediscover.
RTL = set()
