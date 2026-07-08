---
name: soundbox-composer
description: Compose, edit, and preview music and sound effects for this game in the SoundBox format (the tiny synth player in src/audio/). Use this whenever the user wants game audio of any kind — background music, a jingle, win/lose/pickup/click sound effects, "make the music shorter/faster/happier", a new instrument sound, or anything touching song data or src/audio/songs/ — even if they don't say "SoundBox". Also use it to explain how the music system works.
---

# SoundBox Composer

This project generates all audio at runtime from tiny JS data objects, played by a
stripped-down [SoundBox](https://sb.bitsnbites.eu/) synth (~1.8 kB zipped). No audio
files exist — a "song" is a JS object describing instruments, patterns, and notes,
rendered to a WAV blob on startup. A full background track costs a few hundred bytes.

Read `references/song-format.md` before writing song data — it documents the song
object anatomy, all 29 instrument parameters, and the note-number table.

## The two players — know which one you're writing for

- `src/audio/small-player-simple.ts` (`CPlayerSimple`) — what the game uses by default.
  **Sine oscillator only** (`i[0]`/`i[4]` must be 0), no filter-LFO, no distortion.
  Smallest possible player.
- `src/audio/small-player.ts` (`CPlayer`) — all 4 oscillators (0 sin, 1 square, 2 saw,
  3 tri), still no distortion. Costs more bytes; only ships if something imports it.

A sound designed with square/saw won't survive the simple player — it will render, but
every oscillator falls back to sine. Design within the sine + noise + envelope + delay
palette unless the byte budget allows the full player.

## Workflow

1. **Write the song module.** Put songs in `src/audio/songs/<name>.ts` as plain
   `export const mySound = { ... }` with **no imports and no type annotations** — the
   render script loads these files directly in Node, and the game imports them as TS.
   Share one instrument array between songs where possible (bytes!).

2. **Render it:**
   ```sh
   node scripts/render-song.mjs src/audio/songs/<name>.ts <exportName>
   ```
   This uses the project's real player, writes `out/<name>-<export>.wav`, and prints
   duration + peak level. Peak 0% = your note/pattern data produced silence (usually a
   wrong pattern index or an `n` array in the wrong place); ~100% = clipping (lower
   `OSC_VOL`/`FX_DRIVE`). Pass `--full` only if the game will use `CPlayer`.

3. **Let the user listen:** `afplay out/<name>.wav` (macOS). Always actually play the
   render — descriptions of sound are no substitute. Iterate on the data until it's right.

4. **Wire it into the game** like the existing sounds: music via `initAudio`
   (`src/audio/music-control.ts`), one-shot effects via `initSoundEffect` in
   `src/audio/sound-control/sound-control-box.ts`.

5. **Check the byte cost** with `npm run build-js13k` — song data usually compresses
   very well (repetition!), but verify.

## Composition quick reference

- Note 144 = A4 = 440 Hz; 147 = C5; +1 = one semitone. Sparse array holes (`,`) are
  silent rows. Note 0/absent = no note.
- One pattern row lasts `rowLen / 44100` seconds. `rowLen: 5513` ≈ 120 BPM with rows
  as 16th notes (BPM ≈ 661500 / rowLen). The 2025 game used a slow `rowLen: 22050`.
- Song length = `rowLen × patternLen × (endPattern + 1)` samples. Keep sound effects
  to 1 pattern with a small `patternLen` — the tail is release + delay echoes.
- Melodies feel musical when they stay in one scale; end phrases on the root note.
  A rising major arpeggio reads as "win" (the 2025 win sound is C4-E4-G4-C5 =
  `[135, 139, 142, 147]`), a falling minor line as "lose".
- Percussion without square/saw: short noise bursts (`NOISE_VOL` high, xenv on, fast
  release) give hi-hats/snares; a low sine with `ENV_EXP_DECAY` gives a kick.
- Space/atmosphere comes from `FX_DELAY_AMT`/`FX_DELAY_TIME` and slow `FX_PAN_FREQ` —
  that's the entire trick behind the 2025 background track.

## Editing existing sounds

The current songs live in `src/audio/songs/music-and-sounds.ts` (`song`, `winSound`,
`loseSound`), all sharing one soft sine-pad instrument. To shorten/rearrange music,
edit the per-channel `p` arrays and `endPattern` — patterns are reusable building
blocks, so rearrangement is free; new patterns cost bytes.

The interactive editor at https://sb.bitsnbites.eu/ is the alternative for composing
by ear ("Export as JS" produces this exact format, minus our trimmed-player limits).
There is no tool to generate its `?data=` share-URLs from JS — to hand-audition a song
in the UI, recreate it there manually or just use the render script.
