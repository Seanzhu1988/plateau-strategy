#!/usr/bin/env python3
"""Record the spoken attraction guides in the site voice, and only what changed.

    python3 voice_guides.py               # record what is missing or out of date
    python3 voice_guides.py --dry         # say what it would record, spend nothing
    python3 voice_guides.py --lang ja     # record the Japanese narrations
    python3 voice_guides.py --voice NAME  # use a different reader
    python3 voice_guides.py --cards       # record the thirty second cards
    python3 voice_guides.py --force       # redo even adopted recordings\n    python3 voice_guides.py --reintro     # change the opening music, spend nothing

Languages. English scripts live in guide_scripts.json; every other language
lives in guide_scripts.<lang>.json with the same slugs, and records to
media/audio/guide-<slug>.<lang>.mp3. The player asks for the reader's own
language and falls back to English, so a half-translated guide is never a
silent one. ElevenLabs speaks all of these in the same voice, so a visitor
switching to another language hears the same guide, not a different stranger.

The guides are files, not an API call at read time: a traveller standing in
Pike Place should not wait on anyone's servers, and a voice that costs money
per play would quietly become a bill that scales with success. Recorded once,
served from /media/audio, cached by the browser.

THE SITE VOICE IS JASON. It is set here, in DEFAULT_VOICE, not in an environment
variable somebody has to remember to set, so the site sounds like itself out of
the box. ELEVENLABS_VOICE_ID overrides it, and a per-language reader can be set
with ELEVENLABS_VOICE_ID_JA, _ZH, _ES, _KO, _VI, worth doing when a native
reader beats the house voice speaking through an accent.

Facts this script is careful about:

  IT RE-RECORDS WHEN THE VOICE OR THE WORDS CHANGE. Every recording is stamped in
  media/audio/_recorded.json with the voice it used and a fingerprint of the
  script. Change the voice, or rewrite a script, and the next run redoes exactly
  those and leaves the rest alone. This is how switching the whole site to a new
  voice is one edit and one run, not a hunt through a folder.

  EVERY ENGLISH GUIDE RUNS AT LEAST THREE MINUTES. A guide is something you
  settle into, not a station announcement, so an English script shorter than
  MIN_WORDS (about three minutes of speech) is refused rather than recorded, and
  named as a to-do instead. Other languages are not word-counted, because a
  language without spaces cannot be, so a translated guide records whenever it is
  missing or changed.

  QUOTA IS REAL. The free tier is 10,000 characters a month, which at three
  minutes a guide is barely three of them; the full English set is around
  seventy thousand characters and needs a paid plan. When it runs out the API
  answers 401 with the word quota_exceeded, which reads like a broken key and is
  not one. This script says so in plain words and stops.

  NOTHING IS LOST ON A STOP. It writes the stamp after each file, so a run that
  stops on quota picks up exactly where it left off next time.

Needs ELEVENLABS_API_KEY in the environment. The key is a secret and lives in the
host's environment (on Render, under Environment), never in git.
"""

import hashlib
import json
import os
import sys
import time
import urllib.error
import urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(BASE, "media", "audio")
MANIFEST = os.path.join(OUTDIR, "_recorded.json")
MODEL = "eleven_multilingual_v2"

# Jason, Natural Narrator: warm, steady North American voice. The one the whole
# site speaks with. Overridable by ELEVENLABS_VOICE_ID, but it should not need
# to be.
DEFAULT_VOICE = "6nukEV6JAgCcOkdtH5FM"

# About 450 words is three minutes of narration at an unhurried pace. English
# scripts shorter than this are held back as unfinished; see the docstring for
# why other languages are not word-counted.
# A guide may open with a short piece of music, named here by its file stem in
# media/audio. The file is recorded in the same shape as the reader (mono,
# 44.1kHz, 64kbps mp3) so it is joined to the front of the narration as raw
# frames: nothing is re-encoded and no audio tool is needed at record time.
#
# THE MUSIC HAS TO BE OURS. A famous record carries two copyrights, one on the
# recording and one on the song, and the few seconds everybody recognises is
# exactly the part that is protected, so a clip is not a way around it. On a
# commercial guide that is the risky use, not the safe one. intro-disco.mp3 was
# synthesised for this site out of oscillators and noise by make_sting.py, so it
# owes nothing to anyone. Anything added here has to clear the same bar.
INTRO = {"trump-tower": "intro-disco"}

MIN_WORDS = 450

# THE SECOND TIER: CARDS. A deep guide is for a place you travel to and settle
# into. The book now holds a hundred places nobody will stand still for three
# minutes at, a pizza counter, a viewpoint, a ferry dock, and for those the
# choice is not "three minutes or nothing", it is thirty seconds or silence.
# So a card is its own kind of recording with its own band: long enough to say
# what the place is, what to notice and what to do, short enough that a person
# on a sidewalk hears it out. The band is enforced at BOTH ends, because a card
# that sprawls has quietly become a bad guide, and the deep tier's own floor is
# left exactly where it was. [SEAN "maybe 30 seconds per destination"]
CARD_MIN_WORDS = 60         # ~24 seconds
CARD_MAX_WORDS = 110        # ~44 seconds

PAUSE_S = 4                 # spacing: the API rate-limits a fast loop


def scripts_path(lang, tier="guide"):
    stem = "guide_scripts" if tier == "guide" else "guide_cards"
    return os.path.join(BASE, "%s.json" % stem if lang == "en"
                        else "%s.%s.json" % (stem, lang))


def out_path(slug, lang, tier="guide"):
    """English keeps the plain name, so every guide recorded before this file
    learned about languages still plays. Cards are a separate prefix so a place
    can hold both: the card plays today, and the day someone writes it a real
    three minute guide the deep recording takes over without a rename."""
    stem = "guide" if tier == "guide" else "card"
    return os.path.join(OUTDIR, "%s-%s.mp3" % (stem, slug) if lang == "en"
                        else "%s-%s.%s.mp3" % (stem, slug, lang))


def voice_for(lang):
    """The voice that reads the guides in this language, or None.

    English keeps its old chain exactly: a per-language override, then the
    guide's own voice, then the house override, then Jason. GUIDE_VOICE_ID
    exists because the guide is a stranger walking beside a traveller, not the
    butler answering Sean, and the two should not be forced to share a throat.

    Every OTHER language is decided by the casting table in guide_voices.py,
    the same table the trail and MoMA recorders read. This used to fall
    through to Jason for any language at all, so `--lang zh` would have
    recorded the Chinese guides in Jason's voice, an American reading
    Mandarin, which guide_voices.py rules out by name. It was caught on
    2026-09-10 by a dry run printing Jason's id for zh right after Haoran was
    cast. GUIDE_VOICE_ID and ELEVENLABS_VOICE_ID say nothing about language,
    so they may no longer choose a voice for one. An explicit per-language
    override (ELEVENLABS_VOICE_ID_ZH) is a person choosing for that language,
    and still wins. No reader cast means None, and main() refuses."""
    explicit = os.environ.get("ELEVENLABS_VOICE_ID_%s" % lang.upper(), "").strip()
    if explicit:
        return explicit
    if lang == "en":
        return (os.environ.get("GUIDE_VOICE_ID", "").strip()
                or os.environ.get("ELEVENLABS_VOICE_ID", "").strip()
                or DEFAULT_VOICE)
    try:
        import guide_voices as gv
        who = gv.reader_for("guide", lang)
        return gv.voice_id(who) if who else None
    except Exception:
        return None


def load_scripts(lang, tier="guide"):
    try:
        with open(scripts_path(lang, tier), encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        return {}
    return {k: v for k, v in data.items() if not k.startswith("_")}


def load_manifest():
    try:
        with open(MANIFEST, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_manifest(m):
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(m, f, ensure_ascii=False, indent=1, sort_keys=True)


def intro_for(slug, tier="guide"):
    """The music that opens this guide, or None. A card never gets one: thirty
    seconds cannot afford ten of horns."""
    return INTRO.get(slug) if tier == "guide" else None


def music_bytes(name):
    """The opening music as mp3 frames, or empty if there is none to add."""
    if not name:
        return b""
    p = os.path.join(OUTDIR, name + ".mp3")
    if not os.path.exists(p):
        print("  no intro  %s is missing, recorded without it" % os.path.basename(p))
        return b""
    with open(p, "rb") as f:
        return _strip_id3(f.read())


def with_intro(audio, music):
    """Put the opening music in front of the narration.

    Both are mono 44.1kHz 64kbps mp3, so this is a frame join and the narration
    is never re-encoded: no generation loss, and no audio tool needed on this
    machine at record time. The narration's own ID3 header goes, because it is
    no longer the front of the file, and the music is written without one.

    HOW MANY BYTES OF MUSIC WENT ON IS STAMPED IN THE LEDGER, so the opening can
    be changed later by slicing exactly that much off the front and joining a new
    one. Without that number a new intro would mean re-reading a fifteen minute
    script, and quota is real."""
    return (music + _strip_id3(audio)) if music else audio


def sig(text, intro=None):
    """A short fingerprint of a script, so a rewrite is noticed. The opening
    music is part of it: add, change or drop an intro and the guide is remade."""
    seed = text if not intro else text + "\x00intro:" + intro
    return hashlib.sha1(seed.encode("utf-8")).hexdigest()[:12]


def off_band(text, lang, tier="guide"):
    """Why a script is not ready to record, or None.

    A deep guide under three minutes is unfinished. A card is wrong in two
    directions: too thin to be worth a tap, or so long it has stopped being a
    card. A language without spaces cannot be word-counted, so translations are
    never held back on length."""
    if lang != "en":
        return None
    w = len(text.split())
    if tier == "card":
        if w < CARD_MIN_WORDS:
            return "thin"
        if w > CARD_MAX_WORDS:
            return "long"
        return None
    return "short" if w < MIN_WORDS else None


def status(slug, text, voice, lang, manifest, tier="guide"):
    """'thin'/'long'/'short' (out of band for its tier), 'have' (already
    recorded in this voice from this exact script), or 'record' (missing, or the
    voice or words changed). The manifest is keyed by the output filename, so
    each tier and language is tracked separately."""
    bad = off_band(text, lang, tier)
    if bad:
        return bad
    p = out_path(slug, lang, tier)
    if not os.path.exists(p):
        return "record"
    m = manifest.get(os.path.basename(p)) or {}
    if not m:
        # A recording with no ledger row. This happens on any fresh checkout,
        # because _recorded.json is written at record time and was never
        # committed: the mp3s ship in git, the ledger did not. Treating that as
        # "unrecorded" would spend real money re-reading files we already own,
        # so an orphan recording is ADOPTED rather than redone. It is stamped
        # with today's voice and words, which is a guess, and the honest cost of
        # the guess is that a script edited before adoption keeps its old audio.
        # Use --force to overrule it.
        return "adopt"
    if m.get("voice") != voice or m.get("sig") != sig(text, intro_for(slug, tier)):
        return "record"
    return "have"


def record(key, voice, text, model=None, language=None, settings=None):
    """One guide. Returns (bytes, None) or (None, reason).

    model/language/settings are optional and default to exactly what this
    function always sent, so every existing caller is unchanged.

    WHY THEY EXIST. eleven_multilingual_v2 has no language parameter: it infers
    the language from the characters and then speaks them in the accent the
    voice was trained in. Give it Chinese in a voice built for an English
    market and you get Chinese with an American mouth, which is what Sean
    heard. Two knobs help, and neither is a substitute for casting a voice
    that is actually Mandarin:

      language  pins the phonetics, but ONLY on the models that accept it
                (the turbo and flash 2.5 families). Passing it to
                multilingual_v2 is ignored at best, so it is only sent when
                a model is named alongside it.
      settings  similarity_boost pulls the output back toward the voice's
                original recordings. For an English-sourced voice that means
                pulling it back toward an English mouth, so lowering it is
                what lets the model drift to the target language.
    """
    """
    LONG SCRIPTS ARE SPLIT. The API refuses a request over ten thousand
    characters outright: "text_too_long". A fifteen minute guide is about
    eleven and a half thousand, so the first one written hit the wall and
    recorded nothing. The text is cut on PARAGRAPH boundaries, never mid
    sentence, each piece is requested separately, and the MP3 streams are
    joined end to end. That join is why the split has to be at a paragraph:
    the reader takes a breath at a blank line anyway, so the seam falls where
    a pause already belongs and cannot be heard. ID3 headers on the later
    pieces are dropped so the result is one clean stream.
    """
    parts = _split_for_api(text)
    if len(parts) > 1:
        chunks = []
        for i, piece in enumerate(parts):
            audio, why = _record_one(key, voice, piece, model, language, settings)
            if why:
                return None, "part %d of %d: %s" % (i + 1, len(parts), why)
            chunks.append(_strip_id3(audio) if i else audio)
        return b"".join(chunks), None
    return _record_one(key, voice, text, model, language, settings)


API_TEXT_MAX = 9500          # the documented ceiling is 10000; leave headroom


def _split_for_api(text):
    """Whole paragraphs, each group under the API ceiling. A single paragraph
    longer than the ceiling is returned whole and will fail loudly, which is
    correct: silently cutting a sentence in half is worse than a clear error."""
    if len(text) <= API_TEXT_MAX:
        return [text]
    out, cur = [], ""
    for para in text.split("\n\n"):
        add = para if not cur else cur + "\n\n" + para
        if len(add) > API_TEXT_MAX and cur:
            out.append(cur)
            cur = para
        else:
            cur = add
    if cur:
        out.append(cur)
    return out


def _strip_id3(audio):
    """Drop a leading ID3v2 tag so joined pieces are one stream."""
    if audio[:3] != b"ID3" or len(audio) < 10:
        return audio
    b = audio[6:10]
    size = (b[0] << 21) | (b[1] << 14) | (b[2] << 7) | b[3]
    return audio[10 + size:]


def _record_one(key, voice, text, model=None, language=None, settings=None):
    body = {"text": text, "model_id": model or MODEL}
    if language and model:
        body["language_code"] = language
    if settings:
        body["voice_settings"] = settings
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/text-to-speech/%s?output_format=mp3_44100_64" % voice,
        data=json.dumps(body).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            audio = r.read()
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode("utf-8", "replace")[:400]
        except Exception:
            pass
        if "quota_exceeded" in body:
            return None, "QUOTA"
        return None, "HTTP %s %s" % (e.code, body[:160])
    except Exception as e:
        return None, str(e)[:160]
    if audio[:3] not in (b"ID3", b"\xff\xfb", b"\xff\xf3"):
        return None, "the reply was not an mp3"
    return audio, None


def reintro(scripts, manifest, lang, tier, dry=False, force=False):
    """Change the opening music on guides already on disk, spending nothing.

    The narration is untouched: the old music is sliced off using the byte count
    the ledger recorded when it went on, and the new music is joined to the
    front. A guide whose ledger row predates that count is left alone and named,
    because guessing where the music ends would cut into the first sentence.

    --force re-applies even when the name has not changed, which is what a
    recut of the same music needs."""
    changed, skipped = [], []
    for slug in scripts:
        p = out_path(slug, lang, tier)
        if not os.path.exists(p):
            continue
        row = dict(manifest.get(os.path.basename(p)) or {})
        have, want = row.get("intro"), intro_for(slug, tier)
        if have == want and not force:
            continue
        old = int(row.get("intro_bytes") or 0)
        if have and not old:
            skipped.append((slug, "the ledger never recorded how long %s is" % have))
            continue
        music = music_bytes(want)
        if want and not music:
            skipped.append((slug, "no %s.mp3 in media/audio" % want))
            continue
        if dry:
            changed.append((slug, have, want))
            continue
        with open(p, "rb") as f:
            data = f.read()
        body = data[old:] if old else _strip_id3(data)
        with open(p, "wb") as f:
            f.write(music + body)
        row["intro"] = want
        row["intro_bytes"] = len(music)
        if not want:
            row.pop("intro", None)
            row.pop("intro_bytes", None)
        text = scripts.get(slug, "")
        row["sig"] = sig(text, want)
        manifest[os.path.basename(p)] = row
        changed.append((slug, have, want))
    if changed and not dry:
        save_manifest(manifest)
    for slug, have, want in changed:
        print("  %-32s %s -> %s%s" % (slug, have or "no opening", want or "no opening",
                                      "  (dry)" if dry else ""))
    for slug, why in skipped:
        print("  %-32s left alone: %s" % (slug, why))
    print("\nopening music changed on %d guide(s), %d left alone. No characters spent."
          % (len(changed), len(skipped)))
    return 0


def main():
    dry = "--dry" in sys.argv
    lang = "en"
    if "--lang" in sys.argv:
        try:
            lang = sys.argv[sys.argv.index("--lang") + 1].strip().lower()
        except Exception:
            pass
    tier = "card" if "--cards" in sys.argv else "guide"
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    voice = voice_for(lang)
    if "--voice" in sys.argv:
        try:
            voice = sys.argv[sys.argv.index("--voice") + 1].strip()
        except Exception:
            pass
    if not voice:
        print("No guide reader cast for %s. Cast one in guide_voices.py "
              "(BY_LANGUAGE['guide']) or pass --voice, then run again. Refusing "
              "rather than reading %s in somebody else's voice." % (lang, lang))
        return 1
    scripts = load_scripts(lang, tier)
    manifest = load_manifest()
    os.makedirs(OUTDIR, exist_ok=True)
    if not scripts:
        print("No %s scripts for %s. Write %s first."
              % (tier, lang, os.path.basename(scripts_path(lang, tier))))
        return 1

    # --only limits a run to named slugs, so a city can be recorded on its own
    # budget instead of every unrecorded script on the site. [SEAN, DC first]
    if "--only" in sys.argv:
        try:
            wanted = [x.strip() for x in
                      sys.argv[sys.argv.index("--only") + 1].split(",") if x.strip()]
        except Exception:
            print("--only needs a comma separated list of slugs")
            return 1
        unknown = [w for w in wanted if w not in scripts]
        if unknown:
            print("No such script: %s" % ", ".join(unknown))
            return 1
        scripts = {k: v for k, v in scripts.items() if k in wanted}

    # --reintro puts a new opening on guides that are already recorded, for
    # free. Re-recording to change ten seconds of music would re-read the whole
    # script at ElevenLabs, and a fifteen minute guide is most of a free month.
    if "--reintro" in sys.argv:
        return reintro(scripts, manifest, lang, tier, dry,
                       force="--force" in sys.argv)

    force = "--force" in sys.argv
    have, bad, todo, adopted = [], [], [], []
    for slug, text in scripts.items():
        st = status(slug, text, voice, lang, manifest, tier)
        if st == "adopt" and not force:
            adopted.append(slug)
            manifest[os.path.basename(out_path(slug, lang, tier))] = {
                "voice": voice, "sig": sig(text, intro_for(slug, tier)),
                "words": len(text.split()),
                "chars": len(text), "adopted": True}
            have.append(slug)
        elif st == "have":
            have.append(slug)
        elif st == "record" or (st == "adopt" and force):
            todo.append((slug, text))
        else:
            bad.append((slug, len(text.split()), st))
    if adopted:
        save_manifest(manifest)
        print("adopted %d recording(s) already on disk with no ledger row: %s"
              % (len(adopted), ", ".join(sorted(adopted))))

    chars = sum(len(t) for _, t in todo)
    print("%s | %ss | voice %s | %d scripts: %d current, %d to record, %d off band"
          % (lang, tier, voice, len(scripts), len(have), len(todo), len(bad)))

    if bad:
        print("\nOff band for a %s, fix these first:" % tier)
        for slug, w, why in sorted(bad):
            want = ("at least %d words" % MIN_WORDS if why == "short" else
                    "at least %d words" % CARD_MIN_WORDS if why == "thin" else
                    "at most %d words" % CARD_MAX_WORDS)
            print("  %-34s %4d words  (~%2.0fs, %s: needs %s)"
                  % (slug, w, w / 150.0 * 60, why, want))

    if not todo:
        print("\nEverything in band already has this voice." if not bad
              else "\nNothing ready to record until the off-band ones are fixed.")
        return 0

    print("\nReady to record (%d characters):" % chars)
    for slug, text in todo:
        print("  %-32s %5d chars" % (slug, len(text)))

    if dry:
        return 0
    if not key:
        print("\nNo ELEVENLABS_API_KEY in the environment. Nothing recorded.")
        print("Set it where the site runs (on Render, under Environment) and run again.")
        return 1

    made, failed = [], []
    for slug, text in todo:
        audio, why = record(key, voice, text)
        if why == "QUOTA":
            print("\nOut of characters at ElevenLabs. %d recorded this run, %d still waiting."
                  % (len(made), len(todo) - len(made)))
            print("A three minute guide is a few thousand characters, so the free")
            print("tier runs out fast; a paid plan lifts it. Nothing is lost: run")
            print("this again and it picks up exactly where it stopped.")
            break
        if why:
            failed.append((slug, why))
            print("  failed  %-32s %s" % (slug, why))
            continue
        name = intro_for(slug, tier)
        music = music_bytes(name)
        audio = with_intro(audio, music)
        p = out_path(slug, lang, tier)
        with open(p, "wb") as f:
            f.write(audio)
        row = {"voice": voice, "sig": sig(text, name),
               "words": len(text.split()), "chars": len(text)}
        if music:
            row["intro"] = name
            row["intro_bytes"] = len(music)
        manifest[os.path.basename(p)] = row
        save_manifest(manifest)
        made.append(slug)
        print("  voiced  %-32s %6d bytes" % (slug, len(audio)))
        time.sleep(PAUSE_S)

    print("\nrecorded %d, failed %d" % (len(made), len(failed)))
    if made and lang == "en" and tier == "card":
        print("Nothing to wire: /api/destinations finds card-<slug>.mp3 on disk "
              "and offers the button itself.")
    elif made and lang == "en":
        print("New slugs need an \"audio\": \"/media/audio/guide-<slug>.mp3\" line in "
              "destinations.json so the book and the planner play them.")
    elif made:
        print("Nothing else to wire: the player asks for the reader's language "
              "and finds these by name.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
