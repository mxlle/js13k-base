import { defineEnum } from "../utils/enums";

export type TranslationKey = defineEnum<typeof TranslationKey>;
export const TranslationKey = defineEnum({
  START_GAME: 0,
  NEW_GAME: 1,
  CONTINUE: 2,
  CANCEL: 3,
  LOADING: 4,
  WON: 5,
  LOST: 6,
});
