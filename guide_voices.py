#!/usr/bin/env python3
"""The site's guides, and which voice each one speaks in.

Three narrators, three jobs, and they are not interchangeable. A visitor who
hears the same throat indoors, outdoors and in the gallery index has no way to
tell which guide is talking; a visitor who hears three learns the difference in
about ten seconds without being told.

    JASON   indoors, and the house voice. The Met's galleries, the destination
            cards, the security explainer. Warm, steady, unhurried.
    YIKI    outdoors. Walking trails, where she is beside you for a couple of
            miles rather than reading to you in a quiet room.
    ADRIAN  the Universal Gallery, where the job is one artwork at a time:
            what it is, where it hangs, and the number on its placard.

Sean picks these BY EAR from the ElevenLabs library, which is the only way that
works: a voice that reads well on the page can be wrong in the ear, and the
reverse. The id is what the API needs; the name is what we call her.

An id left empty means that guide has not been chosen yet, and every recorder
refuses rather than quietly falling back to Jason. A guide silently borrowing
another guide's voice is the kind of bug nobody reports and everybody hears.

Override any of them with an environment variable if a voice has to change
without a deploy: GUIDE_VOICE_JASON, GUIDE_VOICE_YIKI, GUIDE_VOICE_ADRIAN.
"""

import os

GUIDES = {
    "jason": {
        "name": "Jason",
        "voice_id": "6nukEV6JAgCcOkdtH5FM",      # Natural Narrator
        "job": "indoors: galleries, destination cards, the house voice",
    },
    "yiki": {
        "name": "Yiki",
        "voice_id": "JZLpE3AGwpKYZI2X65hN",      # "Mingyao Ye" [SEAN picked her]
        "job": "the trail, in English",
        "language": "en",
        # Her library entry is "Mingyao Ye, Sad and Broken Hearted", an
        # English-market voice built for grief. She started on the trail's
        # Chinese; Sean heard the accent (an English voice reading hanzi) and
        # recast her onto the English, the language she does not strain in.
        # The tone mismatch, a grief voice on a sunny walk, was flagged before
        # anything was recorded. Both rulings were his, made by ear, which is
        # the only instrument that has ever predicted how a voice sounds.
    },
    "adrian": {
        "name": "Adrian",
        "voice_id": "agczkAUlHLowaNnL72Cc",      # "Adrian | Chinese Mandarin Narration"
        "job": "the Universal Gallery: one artwork at a time",
        "language": "en+zh",                     # both, and ONLY the gallery [SEAN]
    },
    "pangge": {
        "name": "Pangge",
        "voice_id": "hFamrilbAE6WDMtWgKvu",      # "pangge, chinese radio voice"
        "job": "the guides and the trail, in Chinese",
        "language": "zh",
        # [SEAN, after hearing the first three trail recordings: "pangge
        # slowdown little bit maybe 5%"] A radio voice reads at radio pace;
        # a walking guide talks to somebody on their feet in the street.
        "settings": {"speed": 0.95},
    },
}


def settings_for(guide):
    """The guide's voice settings, or None. Recorded into the ledger alongside
    the voice and the words, so changing a setting makes every file that guide
    recorded stale, and the next run remakes them without anyone remembering."""
    g = GUIDES.get(guide) or {}
    return g.get("settings") or None

# WHO READS A GUIDE IN WHICH LANGUAGE.
#
# The guides are already written in five languages; only English has ever been
# recorded. A Chinese reader arriving at a Chinese page and hearing an American
# accent reading English is not a translation, it is a shrug. Pangge is the
# Chinese voice for the guide job. [SEAN]
#
# Jason has no entry for zh on purpose. He can physically read Mandarin, the
# model is multilingual, and the result is an American speaking Chinese, which
# is worse than useless for the one listener it is meant to serve.
#
# Adrian is the deliberate exception, and Sean's call: he reads the gallery in
# BOTH languages. His library entry is a Mandarin narrator, so his English
# carries an accent. That is a choice, not an accident, and a gallery guide who
# sounds like a person from somewhere is not obviously worse than one who
# sounds like nowhere. He does the gallery and nothing else.
# Yiki walks the trail in English, Pangge walks it in Chinese. [SEAN]
#
# The previous arrangement had Yiki on the Chinese, reasoned from her being
# listed as a Mandarin narrator. Sean listened and heard her Chinese as
# Americanized, and the library agrees with his ear: her entry, Mingyao Ye
# "Sad and Broken Hearted", is an English-market voice, so English is the
# language she does not strain in. Pangge is a native Mandarin radio voice, so
# the Chinese goes home to him. A description of a voice has never once
# predicted how it sounds; his ear recast it, and this file records the ruling.
BY_LANGUAGE = {
    "guide":   {"en": "jason",  "zh": "pangge"},
    "trail":   {"en": "yiki",   "zh": "pangge"},
    "gallery": {"en": "adrian", "zh": "adrian"},
    # MoMA's rooms are indoors, so the house voice reads them. [SEAN "by
    # jason"] No zh entry yet on purpose: when the Chinese scripts are
    # written, Pangge presumably takes them, but that is Sean's ear's call
    # to make, and until he makes it the recorder refuses rather than guesses.
    "moma":    {"en": "jason"},
}


def reader_for(job, lang="en"):
    """The guide whose turn it is, or None if nobody has that job in that
    language yet. None means the recorder must refuse, never substitute."""
    who = (BY_LANGUAGE.get(job) or {}).get(lang)
    return who if (who and ready(who)) else None


def voice_id(guide):
    """The id to record with, or None if this guide has no voice yet.

    Returns None rather than a fallback ON PURPOSE. See the module note: a
    guide that quietly borrows another guide's voice produces audio that is
    wrong in a way no test catches and every listener notices."""
    g = GUIDES.get((guide or "").lower())
    if not g:
        return None
    env = os.environ.get("GUIDE_VOICE_%s" % guide.upper(), "").strip()
    return env or (g["voice_id"] or None)


def ready(guide):
    return bool(voice_id(guide))


def status():
    return {k: {"name": v["name"], "job": v["job"], "ready": ready(k)}
            for k, v in GUIDES.items()}


if __name__ == "__main__":
    for k, v in status().items():
        print("  %-8s %-9s %s" % (v["name"], "ready" if v["ready"] else "NO VOICE", v["job"]))
    missing = [v["name"] for v in status().values() if not v["ready"]]
    if missing:
        print("\nStill to choose by ear: %s" % ", ".join(missing))
        print("Pick in the ElevenLabs library, then put the voice id in this file.")
