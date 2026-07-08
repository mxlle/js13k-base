# js13k Base

Starter template for [js13kGames](https://js13kgames.com/) entries (13 kB zip limit), extracted
from [Kittens United](https://github.com/mxlle/13k-purrfect-plan) (js13k 2025).

Ships with a tiny placeholder game (move the cat 🐱 to the star ⭐) that exercises the whole
pipeline — replace `src/components/demo-game/` with your game.

## What's included

- **Vite build with aggressive size optimization**: terser property mangling, build-time enum
  inlining, CSS class name minification synced between TS and SCSS, enum-map compaction,
  treemap bundle analysis (`dist-analyzation/stats.html`)
- **Three build modes**: friends & family (`npm run build`), competition (`npm run build-js13k`),
  Poki (`npm run build-poki`) — controlled via `.env` files and tree-shaken `HAS_*` feature flags
- **Size tooling**: zip + size report with per-file breakdown and diff to previous build,
  automatic ECT recompression (via `ect-bin`, ~4% smaller zips), optional Roadroller crunch
  (`npm run build-js13k-roadroller`), CI workflow that enforces the 13,312-byte limit on every push
- **Micro framework**: `createElement` helpers, component pattern, dialog + header components,
  pub-sub service, local storage helpers, i18n (en/de), SoundBox music/sfx players

## Getting started

```sh
npm install
npm start            # dev server
npm run build-js13k  # competition zip + size report
```

See `CLAUDE.md` for the size-golfing rules that make this setup tick (important: new enums must be
registered in `vite.config.ts`).

## Licensing

This template is MIT-licensed (see `LICENSE`), with one third-party component: the audio players
in `src/audio/small-player*.ts` are modified versions of `player-small.js` from
[SoundBox](https://sb.bitsnbites.eu/) by Marcus Geelnard, under the
[zlib license](https://opensource.org/licenses/Zlib) (kept in the file headers — don't remove it).
Note that the SoundBox *editor* itself is GPLv3, but the exported player routine and your own
exported songs are not affected by that.
