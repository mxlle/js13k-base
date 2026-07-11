import { TranslationKey } from "./translationKey";

// Example secondary language. Returned via a function so the German texts are
// tree-shaken away when HAS_GERMAN is false (LANG_DE_ENABLED !== "true"),
// e.g. in the js13k build. Copy this file's shape to add another language.
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
