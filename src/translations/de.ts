import { TranslationKey } from "./translationKey";

// Returned via a function so the German texts can be tree-shaken away
// when GERMAN_ENABLED is "false" (js13k build).
export function getDeTranslationMap(): Record<TranslationKey, string> {
  return {
    [TranslationKey.START_GAME]: "Spiel starten",
    [TranslationKey.NEW_GAME]: "Neues Spiel",
    [TranslationKey.CONTINUE]: "Weiter",
    [TranslationKey.CANCEL]: "Abbrechen",
    [TranslationKey.LOADING]: "Lädt...",
    [TranslationKey.WON]: "Gewonnen!",
    [TranslationKey.LOST]: "Oh nein!",
  };
}
