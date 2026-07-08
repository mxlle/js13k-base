#!/usr/bin/env node
// Render a SoundBox song module to a WAV file using the project's own player,
// so what you hear is exactly what ships. Reports duration and peak level —
// a peak of 0% means the song data is wrong (silence), ~100% means clipping.
//
// Usage:
//   node scripts/render-song.mjs <song-file.(ts|js|mjs)> [exportName] [--full] [--out=file.wav]
//
//   exportName  which export to render (default: "song", or the only export)
//   --full      render with small-player.ts (all 4 oscillators) instead of
//               small-player-simple.ts (sine only) — use if the game does
//   --out=      output path (default: out/<file>[-<export>].wav)
//
// Preview on macOS: afplay out/<name>.wav
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = resolve(fileURLToPath(import.meta.url), "../..");

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const flags = process.argv.slice(2).filter((a) => a.startsWith("--"));
const [songFile, exportName] = args;

if (!songFile) {
  console.error("usage: node scripts/render-song.mjs <song-file> [exportName] [--full] [--out=file.wav]");
  process.exit(1);
}

// The player and song sources are type-annotation-free JS in .ts files;
// copying them to .mjs makes them importable by Node's ESM loader.
const tmp = mkdtempSync(join(tmpdir(), "soundbox-"));
async function importAsMjs(file) {
  const target = join(tmp, basename(file).replace(/\.\w+$/, "") + ".mjs");
  copyFileSync(file, target);
  return import(pathToFileURL(target).href);
}

const useFull = flags.includes("--full");
const playerModule = await importAsMjs(join(rootDir, "src/audio", useFull ? "small-player.ts" : "small-player-simple.ts"));
const Player = playerModule.CPlayerSimple ?? playerModule.CPlayer;

const songModule = await importAsMjs(resolve(songFile));
const exports = Object.keys(songModule);
const name = exportName ?? (exports.includes("song") ? "song" : exports.length === 1 ? exports[0] : null);
if (!name || !songModule[name]) {
  console.error(`export not found — available exports: ${exports.join(", ")}`);
  process.exit(1);
}

const player = new Player();
player.init(songModule[name]);
while (player.generate() < 1);
const wave = player.createWave();

const outFlag = flags.find((f) => f.startsWith("--out="));
const defaultName = basename(songFile).replace(/\.\w+$/, "") + (exportName ? "-" + exportName : "") + ".wav";
const out = outFlag ? outFlag.slice(6) : join(rootDir, "out", defaultName);
mkdirSync(resolve(out, ".."), { recursive: true });
writeFileSync(out, wave);

const samples = new Int16Array(wave.buffer, 44);
let peak = 0;
for (let i = 0; i < samples.length; i++) {
  const a = Math.abs(samples[i]);
  if (a > peak) peak = a;
}
const duration = samples.length / 2 / 44100;
const warning = peak === 0 ? " — SILENT, check note/pattern data" : peak >= 32767 ? " — CLIPPING, lower volumes/drive" : "";
console.log(`${out}: ${duration.toFixed(2)}s, peak ${((peak / 32767) * 100).toFixed(0)}%${warning}`);
