# Second data loss in destinations.json, 2026-09-04, same cause as 2026-09-03

## What happened

The story-writer routine wrote the View Boston story correctly, then reformatted
the whole file (json.dump indent=2 against the file's indent=1), producing a
3,205-line diff. To undo that cosmetic churn it ran `git checkout
destinations.json`, which is the same mistake as yesterday in a different
costume: the working tree was ahead of HEAD, so restoring HEAD discarded every
uncommitted entry.

Measured before and after, from this run's own output:

    before the write   137 entries   86 with story_en
    after the write    137 entries   87 with story_en
    after `git checkout destinations.json`   114 entries   75 with story_en
    after re-applying the story              114 entries   76 with story_en

So 23 entries and 11 stories were dropped from the working tree. HEAD holds 114
entries; the tree held 137.

Yesterday's note ends with the rule "Never rebuild a working file from HEAD to
tidy a diff." `git checkout <file>` IS rebuilding from HEAD. The rule needs to
name the command, not the intent.

## Blast radius

Local worktree only, same as yesterday. Production reads and writes its own copy
on `/var/data`, which is untouched. `/var/data` does not exist on this Mac.

## What was NOT lost

- The View Boston story, written this run in all five languages, is in the file.
- `story_carry.json` (72 stories) is intact. It covers none of the 38 entries
  currently missing a story, so it does not help here.

## Candidate recovery sources, none authoritative, none merged

Local simulation data dirs used by other sessions today. `current` below is the
114-entry file as it stands now.

    /tmp/render_sim/destinations.json    145 entries   31 not in current   0 of current absent
    /tmp/render_sim3/destinations.json   153 entries   39 not in current   0 of current absent
    /tmp/rs4/destinations.json           135 entries   25 not in current   4 of current absent
    /tmp/polish_data/destinations.json   134 entries   24 not in current   4 of current absent

`/tmp/render_sim` and `/tmp/render_sim3` are strict supersets of the current file
by (name, city). Neither is the lost 137-entry state, and neither has been
verified as clean content, so nothing was merged under this run's time ceiling.
Merging is a deliberate act for a run with budget to check what it is adding.

## The rule, restated so it binds

Before writing destinations.json: run `git status`. If it is dirty, edit the
working copy in place and match its formatting on the FIRST write. Read the
file's own indent before dumping. Never run `git checkout`, `git restore`, or
any HEAD rebuild on a file this routine has touched, for any reason, including
tidying a diff.
