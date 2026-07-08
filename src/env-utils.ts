export const IS_POKI_ENABLED = import.meta.env.POKI_ENABLED === "true";
export const IS_DEV = import.meta.env.DEV;
const IS_JS13K = import.meta.env.IS_JS13K === "true";

// Feature flags — everything behind a `!IS_JS13K` flag is tree-shaken out of
// the competition build. Add flags here instead of sprinkling mode checks.
export const HAS_VISUAL_NICE_TO_HAVES = !IS_JS13K;
export const HAS_GAMEPLAY_NICE_TO_HAVES = !IS_JS13K;
export const HAS_ADVANCED_DEBUGGING = !IS_JS13K;
export const HAS_SHORT_TEXTS = IS_JS13K;
export const HAS_SIMPLE_SOUND_EFFECTS = true;

export const GAME_TITLE = "My js13k Game";
