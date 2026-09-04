# Data loss in destinations.json, 2026-09-03, caused by the story-writer routine

## What happened

The routine wrote the MassArt story correctly, then reformatted the whole file
(indent 2 instead of the file's indent 1), producing a 5,400-line diff. Trying to
undo that cosmetic churn, it rebuilt the file from `git show HEAD:destinations.json`
and re-applied only the new story. That was the mistake: the working tree was
already dirty and ahead of HEAD, so rebuilding from HEAD discarded every
uncommitted change.

HEAD had 110 entries. The working tree had 128. 18 entries were dropped, and 18
existing entries lost stories written by earlier runs of this routine.

## Blast radius

Local worktree only. Production is unaffected: on the server `DATA_DIR` is
`/var/data` and the book is read and written there, so the live site still holds
its own copy. Locally `BASE_DIR == DATA_DIR`, so this repo file is the only local
copy and there is no second copy to restore from. Checked and ruled out: git stash
(empty), leftover .tmp files (none), the Plateau Strategy project copies (stale,
48/39/38 entries), Time Machine local snapshots (OS-update only).

## Best recovery path

The production disk is the authoritative copy of runtime-added places. Pull
`destinations.json` off the live `/var/data` disk and merge it over this file,
rather than rewriting 18 stories by hand. Do that before the next story-writer run,
so the routine does not write onto a file that is about to be replaced.

## Stories that must be rewritten if production cannot supply them

These 18 entries still exist but their story fields are now blank:

A Day in Cambridge (loop) · American Fine Arts Society · Bargemusic ·
Berklee College of Music, Boston · Boston College, Chestnut Hill ·
Boston University, Boston · Daily News Building · Emerson College, Boston ·
Film Forum · Martin Luther King Jr. Memorial Library · MetLife Building ·
Museum of Contemporary African Diasporan Arts · Northeastern University, Boston ·
Potomac Water Taxi · Rodin Studios · The Wall · View Boston ·
Wellesley College, Wellesley

The 18 deleted entries cannot be named from this session's records.

## The rule this needs

Never rebuild a working file from HEAD to tidy a diff. Check `git status` before
writing, and if the file is already dirty, edit the working copy in place and match
its existing formatting on the first write.
