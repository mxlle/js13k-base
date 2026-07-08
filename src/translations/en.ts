import { TranslationKey } from "./translationKey";
import { HAS_SHORT_TEXTS } from "../env-utils";

export const enTranslations: Record<TranslationKey, string> = {
  [TranslationKey.START_GAME]: HAS_SHORT_TEXTS ? "Start" : "Start game",
  [TranslationKey.NEW_GAME]: "New game",
  [TranslationKey.CONTINUE]: "Continue",
  [TranslationKey.CANCEL]: "Cancel",
  [TranslationKey.LOADING]: "Loading...",
  [TranslationKey.WON]: "You won!",
  [TranslationKey.LOST]: "Oh no!",
};
