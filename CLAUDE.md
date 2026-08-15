# How we build this site

Read this before changing anything a visitor sees.

## Mobile is the default, not an afterthought

Most people who use this site are on a phone, not a computer. So the phone is
the primary screen. Design for it first, and never consider a piece of UI
finished until it has been checked on a phone-sized screen.

What that means in practice, every time:

- **Design for a narrow screen first,** then let it widen. Not the other way
  around. A layout that only works wide and is "made to fit" later is the thing
  we are trying to avoid.
- **Use relative units and layouts that reflow:** flexbox and grid with
  `flex-wrap`, `max-width`, percentages, `rem`. Avoid fixed pixel widths on
  anything that holds content.
- **The page must never scroll sideways.** If content is wider than the screen
  (a table, a wide diagram, a code block), it goes inside its own
  `overflow-x: auto` box. The body itself never scrolls horizontally.
- **Tap targets are finger-sized.** Buttons and links a thumb has to hit are at
  least about 44px tall, with room around them.
- **Text stays readable** without pinching: body text around 16px, real line
  height, and it wraps rather than gets cut off.
- **Stack, do not squeeze.** Columns that sit side by side on a computer should
  stack into one column on a phone.

### Verify it, do not assume it

Before calling any visible change done, actually look at it on a phone-sized
screen. The app runs locally with gunicorn (see the Procfile), and a headless
browser is available. The quick check:

- Load the page at about 390px wide.
- Confirm `document.documentElement.scrollWidth` is not wider than the viewport
  (no sideways scroll).
- Confirm the main actions are reachable and nothing is cut off or overlapping.

A change that has not been looked at on a phone is not finished.

## Other standing rules

- **No long dashes in anything a person reads.** No em dashes and no en dashes
  in page copy, articles, blueprints, or any written content. Use commas or
  periods. The server enforces this for posted content; write it that way by
  hand too.
- Design tokens and colour live in `PALETTE.md`. The reasoning behind past
  choices lives in `DESIGN_DECISIONS.md`. Read them before restyling.
