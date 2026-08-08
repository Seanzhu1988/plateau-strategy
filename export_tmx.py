# -*- coding: utf-8 -*-
"""Export the site's translations as a translation memory, one TMX per language.

Why this exists.

There are 1146 hand-written English→zh/es/ko/vi pairs in this repo, built over
several rounds and corrected by a reader for Chinese and Spanish. That is a
translation memory — it has just never been in a form anything else can read.

Two things it unlocks, neither of which is possible while the strings only live
in a Python dict:

  * **Training a model.** LILT's base model was measured against the
    hand-written text on three strings and lost all three. On Korean it
    rendered "fill up and stop" as 채우고 중지 — fill and halt — where the
    hand-written line says 주유하고 휴식, refuel and rest. A base model does
    not know this company's voice, and the only way it learns is by being fed
    the pairs. TMX is what it eats.

  * **Human review.** TRANSLATION.md has said from the first day that Korean
    and Vietnamese are verified by nobody. A reviewer cannot be handed
    i18n_extra.py. TMX opens in every CAT tool there is.

TMX 1.4b, which is what LILT, memoQ, Trados, Phrase and OmegaT all import.

    python3 export_tmx.py            # writes tm/plateau-en-zh.tmx and friends
"""
import html
import json
import os
import re
import sys
import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "tm")

# LILT and most CAT tools want a region on Chinese; the packs are keyed by the
# short code the site uses.
LANGS = [("zh", "zh-CN"), ("es", "es-ES"), ("ko", "ko-KR"), ("vi", "vi-VN")]


def load_pack(lang):
    """The translations as shipped, read from the generated pack.

    Read from the pack rather than i18n_extra.py on purpose: the pack is what
    a reader actually receives, and it already has the place descriptions from
    i18n_places.py merged in. Exporting the source file would miss them.
    """
    path = os.path.join(HERE, "i18n.%s.js" % lang)
    if not os.path.exists(path):
        sys.exit("missing %s — run build_i18n.py first" % os.path.basename(path))
    src = open(path, encoding="utf-8").read()
    m = re.search(r'window\.psxPack\(".*?",\s*(\{.*\})\);', src, re.S)
    if not m:
        sys.exit("could not find the pack body in %s" % os.path.basename(path))
    return json.loads(m.group(1))


def tmx(pairs, src_lang, trg_lang):
    stamp = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<tmx version="1.4">',
           '  <header creationtool="plateau-strategy/export_tmx.py"',
           '          creationtoolversion="1.0" segtype="sentence"',
           '          o-tmf="plain" adminlang="en" srclang="%s"' % src_lang,
           '          datatype="plaintext" creationdate="%s"/>' % stamp,
           '  <body>']
    for en, tr in pairs:
        out += ['    <tu>',
                '      <tuv xml:lang="%s"><seg>%s</seg></tuv>' % (src_lang, html.escape(en)),
                '      <tuv xml:lang="%s"><seg>%s</seg></tuv>' % (trg_lang, html.escape(tr)),
                '    </tu>']
    out += ['  </body>', '</tmx>', '']
    return "\n".join(out)


def main():
    os.makedirs(OUT, exist_ok=True)
    total = 0
    for short, full in LANGS:
        pack = load_pack(short)
        # Skip anything that came back identical — a "translation" that equals
        # the source is a gap wearing a translation's clothes, and feeding it
        # to a model teaches the model to leave English alone.
        pairs = [(en, tr) for en, tr in sorted(pack.items()) if tr and tr.strip() != en.strip()]
        identical = len(pack) - len(pairs)
        path = os.path.join(OUT, "plateau-en-%s.tmx" % short)
        open(path, "w", encoding="utf-8").write(tmx(pairs, "en", full))
        total += len(pairs)
        note = "  (%d identical to source, left out)" % identical if identical else ""
        print("  %-28s %5d segments%s" % (os.path.relpath(path, HERE), len(pairs), note))
    print("\n  %d segments exported." % total)
    print("  Upload these to LILT to train the models, or hand one to a reviewer —")
    print("  TMX opens in every CAT tool, which i18n_extra.py does not.")


if __name__ == "__main__":
    main()
