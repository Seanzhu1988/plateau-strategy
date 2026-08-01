# Translation

How the site gets translated, and how it stays right. Written down because the
first several attempts were not a translation problem — they were a process
problem, and the process is the fix.

## What went wrong, so it does not go wrong again

Four passes were needed on the same pages. The pattern each time was identical:
the owner read a page, was irritated, said so; one page was fixed; the same
fault sat untouched on four others. `摸得门儿清` — Beijing street slang — survived
three separate passes on a sign-up page nobody happened to open.

Three distinct faults hid inside "the translation is bad":

**1. The English was wrong first.** *"We build one business at a time"* reads in
English as discipline. In Chinese, 一次只做好一项业务 says *we can only manage one
thing at once* — a small operator at the limit of its capacity. No translation
could have rescued it. **Check the source sentence before blaming the target.**

**2. Plain and colloquial are not the same thing.** The English on this site is
deliberately plain, because reaching for grandeur is what made it read as fake.
Rendered literally, plain English becomes colloquial Chinese — and in Chinese
business writing, colloquial reads as *uneducated*. Same intention, opposite
result.

**3. Whole pages were never translated at all.** The Destination Book was Chinese
chrome around 85 English paragraphs. Nobody noticed because the front page
looked finished.

## Register, by surface

| Surface | Register | Test |
|---|---|---|
| Company pages — front page, business cards, security | 书面语. Formal, concise, measured. Not bureaucratic. | Would this appear in an annual report? |
| Destination Book | Guidebook. Concrete and warm, still written not spoken. Imperative is fine; slang is not. | Would this appear in a printed city guide? |
| UI chrome — buttons, labels, filters | As short as the language allows. No personality. | Does it fit the button? |
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

Venue names — **Katz's Delicatessen**, **Pike Place Market**. They are what the
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
| `i18n.js` | Generated. **Never edit by hand** — the next build overwrites it |
| `check_i18n.py` | The quality gate |

`i18n_places.py` is keyed by place name and matched against `destinations.json`
at build time, deliberately. Retyping 85 English paragraphs as dictionary keys
would put a typo somewhere, and **a key one character out fails silently** —
which is exactly how one string survived a whole pass.

## Strings a page builds itself

`"Open till 17:00 · ~60 min visit"` can never be looked up whole: the dictionary
would need an entry for every time-and-duration pair. Translate the **pattern**:

```js
T('Open till {time} · ~{mins} min visit', { time: '17:00', mins: 60 })
```

Placeholders are **named, not positional**, because word order moves — Chinese
puts the duration before the noun. `check_i18n.py` fails if a translation drops
or renames one.

Assembled strings cannot be re-walked when the language changes, so the switcher
fires `psx:lang` and the page rebuilds itself.

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

## Honest limits

- **Korean and Vietnamese are not verified by anyone in the loop.** The
  front-page strings went through DeepL, which is more reliable than reasoning
  about a language you cannot hear. The rest is hand-written and unchecked. The
  `COLLOQUIAL` list for those languages is nearly empty — not because they are
  clean, but because nobody has read them.
- **DeepL's `context` and `formality` parameters are rejected on the free plan.**
  Those are the two levers that steer register directly. A paid plan would let
  register be specified per language rather than corrected after the fact.
- Chinese and Spanish are hand-tuned and were checked by a reader. Where DeepL
  and the hand-written version differ, the hand-written one ships — DeepL is
  accurate but flatter, which is the exact fault that took two passes to fix.
