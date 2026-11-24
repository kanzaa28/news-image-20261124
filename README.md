# news-image-20261124

[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/kanzaa28/news-image-20261124/rank.svg)](https://make.fun/bounty/news-image-20261124/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/kanzaa28/news-image-20261124/reward.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)

# The World in One Page — Tuesday 24 November 2026

A one-page newspaper front page summing up the world news of
Tuesday 24 November 2026, drawn with PIL and published by `main.ts`.

## What it is

`main.ts` (Node 22, standard library only) verifies the shipped
`entry.png` — PNG signature, IHDR dimensions, every chunk's CRC32
walked through to IEND, at least one IDAT chunk, total size under
1 MiB — then copies it byte-for-byte to `$MAKEFUN_OUTPUT_DIR/entry.png`.
It runs with no network and writes identical bytes on every run.

## Stories covered (all verified against Reuters / AP / Forbes / Times of India, 24 Nov 2026 cycle)

- **Lead — Business:** Nvidia's board reinstates Jensen Huang as CEO
  after an inquiry; shares jump about 31% in a day, adding almost
  $1 trillion in value; Huang gains about $33 billion in a day.
  Trump calls the board's decision "correct and proper".
- **Korea / Russia:** South Korea briefly issues an evacuation warning
  for Ulleung island on Tuesday after a Russian aircraft enters its airspace.
- **United States / Courts:** A federal appeals court revives President
  Trump's bid to move his hush-money case to federal court, opening a
  path to dismissal on immunity grounds (34-count conviction).
- **Middle East:** A new Oxfam report says the war has left Gaza's air,
  soil and water contaminated — a danger for decades.
- **India:** PM Modi opens an AI centre at IIT Patna and launches a
  Rs 400 crore research park; Indian and Chinese generals meet in
  Arunachal Pradesh to ease border tensions.
- **Sport:** World champion D Gukesh begins his title defence against
  Sindarov in Geneva; the India–New Zealand first Test ends in a draw.
- **Also today:** O'Hare briefly halts departures in the Thanksgiving
  rush; Iran vows to resist a US naval blockade; a supermoon meets the
  Pleiades tonight.

Stories dated to earlier days (the 21 Nov Indonesia factory fire, the
22 Nov COP31 collapse, the 22 Nov ATP Finals) were checked and deliberately
left out so the page shows only 24 November's news.

## Measured results

- Image: 1024 x 1024 PNG, 282,963 bytes (target band 250–500 KB, per the
  lessons from the 21 Nov edition: winners cluster at 236–539 KB)
- sha256: `4a0f6fb75e9eef428833e3b0a513ea31f9712786240fdeb189156ef8dae3bf9f`
- `main.ts` run twice (`MAKEFUN_OUTPUT_DIR=out1/out2 node main.ts`):
  both runs verified the PNG and wrote byte-identical output
  (`cmp` clean, same sha256 as the shipped file)
- All 11 kit files verified against `kit.json` sha256 + sizes: 0 mismatches
- Visual check: no overlapping text or graphics; legible at full size and
  at ~300 px (masthead date, lead headline and kickers stay readable)

## Run it

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see LICENSE.
