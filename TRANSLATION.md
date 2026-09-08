# Translation

How the site gets translated, and how it stays right. Written down because the
first several attempts were not a translation problem, they were a process
problem, and the process is the fix.

## What went wrong, so it does not go wrong again

Four passes were needed on the same pages. The pattern each time was identical:
the owner read a page, was irritated, said so; one page was fixed; the same
fault sat untouched on four others. `摸得门儿清`, Beijing street slang, survived
three separate passes on a sign-up page nobody happened to open.

Three distinct faults hid inside "the translation is bad":

**1. The English was wrong first.** *"We build one business at a time"* reads in
English as discipline. In Chinese, 一次只做好一项业务 says *we can only manage one
thing at once*, a small operator at the limit of its capacity. No translation
could have rescued it. **Check the source sentence before blaming the target.**

**2. Plain and colloquial are not the same thing.** The English on this site is
deliberately plain, because reaching for grandeur is what made it read as fake.
Rendered literally, plain English becomes colloquial Chinese, and in Chinese
business writing, colloquial reads as *uneducated*. Same intention, opposite
result.

**3. Whole pages were never translated at all.** The Destination Book was Chinese
chrome around 85 English paragraphs. Nobody noticed because the front page
looked finished.

## Register, by surface

| Surface | Register | Test |
|---|---|---|
| Company pages, front page, business cards, security | 书面语. Formal, concise, measured. Not bureaucratic. | Would this appear in an annual report? |
| Destination Book | Guidebook. Concrete and warm, still written not spoken. Imperative is fine; slang is not. | Would this appear in a printed city guide? |
| UI chrome, buttons, labels, filters | As short as the language allows. No personality. | Does it fit the button? |
| Legal and safety | Formal, unambiguous, no idiom. | Could this be read aloud in a dispute? |

Concrete substitutions that came out of real corrections:

| Not this | This | Why |
|---|---|---|
| 一门生意 | 业务 | market-stall talk for a line of trade |
| 一口价 | 固定价格 | haggling vocabulary |
| 挣来的钱 | 收入 | spoken |
| 眼下 | 目前 | spoken |
| 没做完的 | 尚未完成 | spoken |
| 谁都能免费用 | 任何人均可免费使用 | spoken |
| 它养着… | 为…提供资金 | feeds, as one feeds an animal |
| 大白话 | 平实语言 | undercuts its own claim by being casual |
| 千万别丢 | 请妥善保管 | spoken imperative |

## What never gets translated

Venue names, **Katz's Delicatessen**, **Pike Place Market**. They are what the
sign outside says and what a traveller has to ask for. Brand names, product
names, and quoted legal phrases likewise. All of it lives in `EXTRA_SKIP` in
`i18n_extra.py`, so the checker does not flag it and no future pass "fixes" it.

City names *are* translated: 西雅图 is what a Chinese reader calls Seattle.

## Where things live

| File | Holds |
|---|---|
| `i18n_extra.py` | Hand-written translations and `EXTRA_SKIP`. Overrides everything. |
| `i18n_places.py` | Destination Book content, keyed by **place name** |
| `build_i18n.py` | Reads the pages, merges the above, writes `i18n.js` |
| `i18n.js` | Generated. **Never edit by hand**, the next build overwrites it |
| `check_i18n.py` | The quality gate |

`i18n_places.py` is keyed by place name and matched against `destinations.json`
at build time, deliberately. Retyping 85 English paragraphs as dictionary keys
would put a typo somewhere, and **a key one character out fails silently**, 
which is exactly how one string survived a whole pass.

## Strings a page builds itself

`"Open till 17:00 · ~60 min visit"` can never be looked up whole: the dictionary
would need an entry for every time-and-duration pair. Translate the **pattern**:

```js
T('Open till {time} · ~{mins} min visit', { time: '17:00', mins: 60 })
```

Placeholders are **named, not positional**, because word order moves, Chinese
puts the duration before the noun. `check_i18n.py` fails if a translation drops
or renames one.

Assembled strings cannot be re-walked when the language changes, so the switcher
fires `psx:lang` and the page rebuilds itself.

**This is the one that hides best.** The Road Trip Planner looked translated, 
heading, labels, buttons, all Chinese, and every word of the actual answer was
English: the rest stop list, the break names, the route chooser, the status
line, and the durations, because "3 h 12 m" is assembled from two numbers.
i18n.js swaps text *nodes*, so it handles everything written in the HTML and
can do nothing about a string built in JavaScript afterwards. A reader got a
Chinese page with an English answer in the middle of it.

Nothing caught it because nothing was looking: the page's English tests all
passed, and `check_i18n.py` checks the dictionary, not the JavaScript. So the
guard is a test that plans a trip under `?lang=zh` and asserts every generated
line is translated, with place names exempted, and the exemption list is
derived from the fixture rather than typed out, because hardcoding it is how
two of three names got left out and the test failed on its own data.

**When you add a page that builds its results in JS, it needs three things:** a
local `T()` that forwards to `psxFmt`, a `psx:lang` listener that re-renders,
and a test in a non-English language. Two of the three are not enough, the
listener without the wrapping just rebuilds the same English.

## The routine

```bash
python3 build_i18n.py     # rebuild i18n.js from the pages + the two source files
python3 check_i18n.py     # register, completeness, placeholders
```

Run both before pushing anything that touches copy. `check_i18n.py --strict`
exits non-zero, so it can gate a commit.

**When a reader finds a phrase that reads wrong, add it to `COLLOQUIAL` in
`check_i18n.py` before fixing it.** That is the whole point: the lesson gets
kept, and the phrase can never come back anywhere on the site. Fixing only the
sentence that was complained about is what produced four rounds of this.

## Stop rewriting. Measure first.

Five reports of "extremely low level", five rounds of rewriting strings. The
sixth time, the strings were checked against DeepL and mostly held, where the
two differed, the hand-written one was usually the more formal choice
(`公司收入来源于此` against DeepL's spoken `这就是资金的来源`; `图纸阶段` for
"still on paper" against `规划阶段`). The front page was not the problem and
had not been for some time.

`check_zh_coverage.py` asked the other question, how much English is a Chinese
reader still looking at, and found **491 words**, in three places, none of
them a register fault:

| Surface | English words |
|---|---|
| Destination Book | 135 |
| Partner outreach | 95 |
| Trip Planner | 56 |

All of it the same mechanism: **i18n.js swaps text nodes, so anything JavaScript
writes afterwards never reaches the dictionary.** A page can be perfectly
translated and still show English, and no amount of polishing the translated
part touches it. The filter chips, the result count, Jarvis's greeting, the
discovery banner, all assembled, all invisible to a check that reads
`i18n_extra.py`, and invisible to `build_i18n.py` too, which scans HTML text
nodes and cannot see inside a script.

**Before rewriting anything, run the coverage check.** If a surface is a third
English, that is the bug. Register work on the other two thirds is wasted.

Two things it taught that are worth keeping:

- **Plurals are an English grammar rule.** `count + ' traveler' + (n===1?'':'s')`
  bakes English into every language. Chinese, Korean and Vietnamese do not
  pluralise; each needs its own whole sentence, so singular and plural are two
  patterns, not one with a suffix.
- **Exempt venue names from the data, never by hand.** Counting "Brooklyn
  Bridge" as untranslated buried the real gaps under 130 false ones, and a
  typed-out exemption list is how two of three names got missed in the road
  trip test. Read them from `destinations.json`.

## Honest limits

- **Korean and Vietnamese have now been read.** They were the honest gap: the
  front-page strings went through DeepL and the rest was hand-written and
  unchecked, so an empty `COLLOQUIAL` list meant nobody had looked, not that
  there was nothing to find. Reading them turned up three faults running right
  through the Korean:

  - **당신**, 27 occurrences. It is the dictionary word for "you" and it is not
    how Korean commercial writing addresses a reader; it lands somewhere between
    intimate and confrontational, and mostly just reads as translated-from-
    English. Korean drops the pronoun, or names the person: 고객님, 회원님, 여러분.
  - **우리 against 저희**, split almost exactly down the middle, 16 to 17. Both
    mean "we"; 저희 is the humble form a company uses to a customer. Alternating
    between them means the company introduces itself two different ways on the
    same site.
  - **여정 계획 도구 against 여행 플래너**, the Trip Planner named two ways, which
    makes it two products.

  Plus 리드 for "lead" where the term is 잠재 고객, and 곳바로 for 곧바로, a plain
  misspelling that four passes had walked past. Vietnamese was in better shape;
  it needed three fixes, all spoken register in written copy.

  Every one of those is now in `COLLOQUIAL`, so the gate refuses them. What is
  still true: nobody has read the Korean and Vietnamese *aloud*, and register
  is a matter of ear as much as rule.
- **DeepL's `context` and `formality` parameters are rejected on the free plan.**
  Those are the two levers that steer register directly. A paid plan would let
  register be specified per language rather than corrected after the fact.
- Chinese and Spanish are hand-tuned and were checked by a reader. Where DeepL
  and the hand-written version differ, the hand-written one ships, DeepL is
  accurate but flatter, which is the exact fault that took two passes to fix.

## The routine, from 2026-09-07

[SEAN: "also we put language routine, every 24 hours this language will try to
refine theirselves if there is new built it get language to be aligned, now i
want mininum 7 languages to be formed at this moment. if it lack of accuratecy
read some high volume social media post and learn them."]

English is written here every day: a new page, a new button, a landmark the
overnight routine wrote. Every one of those lines is born untranslated and
nothing used to notice. `build_i18n.py` refuses to write packs while a visitor
page has an untranslated line, which catches the worst case loudly, and it is
also why four untranslated Empire State lines stopped every pack in every
language from rebuilding for a whole day on 2026-09-07. **A gate with no routine
behind it eventually blocks the thing it protects.** So the gate stays, and the
routine walks in front of it.

### One list of languages

`languages.py` is the only place the set is written down. It used to be written
in nine: `build_i18n.py` twice, `app.py` three times, `translator.py`,
`gallery_reader.py`, `landmark_pipeline.py`, `i18n_coverage.py` and
`check_i18n.py`. The proof that nobody can keep nine in step is already in the
repo: Japanese shipped in August and `check_i18n.py` still checked four
languages, so the one gate that could have caught a missing Japanese line was
blind to Japanese by construction. Adding language ten is one entry in that
file.

Nine languages as of 2026-09-07: English, Chinese, Spanish, Korean, Vietnamese,
Japanese, French, German, Portuguese. Each carries a `why` naming the reader it
is for, because a language is a promise and one nobody can name should not be
made.

### The daily pass

`language_routine.py` owns the mechanical half, which is the half a machine
should own.

    python3 language_routine.py status     what every language is missing
    python3 language_routine.py gaps --lang fr -n 250 --out /tmp/fr.json
    python3 language_routine.py apply --lang fr -f /tmp/fr_done.json
    python3 language_routine.py verify     the checks, exit 1 on a fault
    python3 language_routine.py bounds     re-derive the length bounds
    python3 language_routine.py stories    book coverage, per language
    python3 language_routine.py build      rebuild the packs

It does not translate. Translation is judgement, so the daily task does it: read
`gaps`, write the words, hand them to `apply`. The split is deliberate, so the
checks run against the translator's output instead of a program marking its own
homework.

The queue is ordered by who is waiting: a line on many pages beats a line on
one, a visitor page beats an agent page, a page people actually open beats one
nobody has, and among equals the short line goes first.

### The checks, and why each one exists

A wrong translation is worse than a missing one: a missing one shows English, a
wrong one shows confidence. So nothing is written until it passes.

- **Placeholders.** `psxFmt` translates the pattern and drops the values in
  afterwards, so `{n} travellers` must still contain `{n}`. Drop it and the
  sentence renders with a hole; rename it and the page prints the literal `{n}`.
- **Long dashes.** Sean's standing rule for everything a person reads. The
  server enforces it for posted content; nothing enforced it here.
- **Echo.** A translation identical to its English is an untranslated line
  wearing a translated line's clothes, and it is invisible in a coverage count.
  Deliberate ones are named in `i18n_keep_english.json`, so a choice looks like
  a choice and a miss looks like a miss.
- **Markup.** The engine sets `textContent`, so a helpfully added `<b>` prints
  as literal angle brackets.
- **Fragments.** One character standing in for three or more English words. 住宿
  for "Somewhere to sleep" is right; 第 for "Night after Day" was the tail of a
  sentence that got cut, and it was live on the trip planner until this check
  found it.
- **Length.** Measured, not guessed. The first version of the table was invented
  and flagged 32 lines of which 31 were correct. The bounds now come from this
  site's own 1,117 translated sentences per language, floor just under the 0.005
  percentile. `bounds` re-derives them.

Two files hold judgement so the daily report can be clean: `i18n_keep_english.json`
for lines deliberately identical everywhere, `i18n_checked.json` for lines a
person looked at and passed. **A report that is never clean stops being read**,
which costs more than the checks are worth.

Faults on a line a reader can see now are reported apart from faults on the 841
dictionary entries no page shows any more. Flattening that difference is how a
real defect hides in a crowd of harmless ones.

### Reading how people actually write

Sean's last sentence, and the useful reading of it. What high-volume posts teach
is not sentences worth copying, it is **what people call things**. A traveller
searches for the name they would type, and a translation that invents its own
name for a place is one nobody can search for and nobody can match to the sign
in front of them. So the weekly step reads how our places are actually referred
to, records the name in `i18n_glossary.json` with where it was seen, and every
later translation is held to it.

Register and slang are deliberately not copied. This is a licensed guide's
voice, the table above already says why colloquial reads as uneducated in
Chinese business writing, and a tour that talks like a comment section reads as
unserious.

The seeded glossary already found a real disagreement: the Freedom Trail is
自由之路 in Chinese and Con Đường Tự Do in Vietnamese, both translated, while
Spanish, French, German and Portuguese keep "Freedom Trail". The trail is signed
in English. That is a searchability question, not a taste question, and the
glossary is where it gets settled once.

### What the packs cost a reader

The engine ships empty and fetches one pack. An English reader downloads no pack
at all. Nine languages cost the reader nothing extra; they cost the routine
time, which is the right place for the cost to land.
