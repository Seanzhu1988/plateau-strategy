# Boston Mandarin narration handoff

Sean's requested voice is Haoran (`pU9NaAwkoR3v0Mrg3uKz`) for the entire Freedom Trail. His explicit pronunciation preference for Boston Common is **波士顿公园** (bo shi dun gong yuan). The overview, stop 1, and shared place-name glossary now use that name. Nearby repetitive 公共公园 phrasing was changed to 城市公园.

## Recording status, 2026-09-11

- Overview and stops 1–6 are recorded in Haoran.
- Stops 7–16 are still recorded in Pangge. Do not relabel these assets as Haoran.
- All 17 Chinese audio files exist. The introduction is a separate recording, not the full trip.
- Overview and stop 1 must be re-recorded to put the revised park name into the spoken audio. Their manifest fingerprints intentionally still describe the existing audio, not the edited text.
- Remaining queue: overview, stop 1, stops 7–16 — 12 recordings, **16,935 characters**.
- Both the saved API credential and connected ElevenLabs workspace rejected generation for insufficient quota. The connector reported **201 credits remaining** and 1,688 required for the introduction. No audio file was created or replaced during this repair.

## Resume

After replenishing ElevenLabs credits, run the existing recorder from the website checkout with the authorized narration credential in its environment:

```sh
python3 trail_voices.py --trail freedom-trail --lang zh --dry
python3 trail_voices.py --trail freedom-trail --lang zh
```

No `--force` is needed. The recorder detects both the changed wording and the ten old voice IDs. Verify all 17 rows use Haoran and current script fingerprints, check the audio plays, then commit the resulting MP3s and manifest. The page uses manifest fingerprints in playback URLs so updated recordings are fetched after deployment.
