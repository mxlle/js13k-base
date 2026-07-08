import { loseSound, winSound } from "../songs/music-and-sounds";
import { generateUntilDone } from "../music-control";
import { CPlayerSimple } from "../small-player-simple";

export let winSoundSrcUrl: string | undefined;
export let loseSoundSrcUrl: string | undefined;

export async function initWinLoseSoundEffects() {
  if (!winSoundSrcUrl) {
    winSoundSrcUrl = await initSoundEffect(winSound);
  }

  if (!loseSoundSrcUrl) {
    loseSoundSrcUrl = await initSoundEffect(loseSound);
  }
}

async function initSoundEffect(soundDef: unknown) {
  const player = new CPlayerSimple();
  player.init(soundDef);

  await generateUntilDone(player);
  const wave = player.createWave();
  return URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
}
