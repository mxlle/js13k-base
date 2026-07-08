import styles from "./demo-game.module.scss";
import { createButton, createElement } from "../../utils/html-utils";
import { ComponentDefinition, Direction } from "../../types";
import { PubSubEvent, pubSubService } from "../../utils/pub-sub-service";
import { CssClass } from "../../utils/css-class";
import { getRandomIntFromInterval } from "../../utils/random-utils";
import { getTranslation } from "../../translations/i18n";
import { TranslationKey } from "../../translations/translationKey";
import { createDialog, Dialog } from "../../framework/components/dialog/dialog";

// Placeholder game: move the cat to the star. Replace with the real game,
// but keep the GAME_START / GAME_END pub-sub events — index.ts (sounds,
// poki hooks) relies on them.

const BOARD_SIZE = 5;

interface Position {
  x: number;
  y: number;
}

export function DemoGameComponent(): ComponentDefinition<undefined> {
  let catPosition: Position;
  let starPosition: Position;
  let isRunning = false;
  let winDialog: Dialog | undefined;

  const catElement = createElement({ text: "🐱", cssClass: [styles.entity, CssClass.EMOJI] });
  const starElement = createElement({ text: "⭐", cssClass: [styles.entity, CssClass.EMOJI] });
  const board = createElement({ cssClass: styles.board }, [starElement, catElement]);

  const moveButtons: [string, Direction][] = [
    ["⬆️", Direction.UP],
    ["⬅️", Direction.LEFT],
    ["➡️", Direction.RIGHT],
    ["⬇️", Direction.DOWN],
  ];
  const controls = createElement(
    { cssClass: styles.controls },
    moveButtons.map(([icon, direction]) =>
      createButton({ text: icon, cssClass: [CssClass.ICON_BTN, CssClass.EMOJI], onClick: () => move(direction) }),
    ),
  );

  const hostElement = createElement({ cssClass: styles.host }, [board, controls]);

  function placeEntity(element: HTMLElement, position: Position) {
    element.style.translate = `${position.x * 100}% ${position.y * 100}%`;
  }

  function move(direction: Direction) {
    if (!isRunning) return;

    const delta: Record<Direction, Position> = {
      [Direction.UP]: { x: 0, y: -1 },
      [Direction.DOWN]: { x: 0, y: 1 },
      [Direction.LEFT]: { x: -1, y: 0 },
      [Direction.RIGHT]: { x: 1, y: 0 },
    };

    catPosition = {
      x: Math.min(BOARD_SIZE - 1, Math.max(0, catPosition.x + delta[direction].x)),
      y: Math.min(BOARD_SIZE - 1, Math.max(0, catPosition.y + delta[direction].y)),
    };
    placeEntity(catElement, catPosition);

    if (catPosition.x === starPosition.x && catPosition.y === starPosition.y) {
      isRunning = false;
      pubSubService.publish(PubSubEvent.GAME_END, { isWon: true });

      winDialog ??= createDialog(createElement({ text: getTranslation(TranslationKey.WON) }), () => startNewGame());
      void winDialog.open();
    }
  }

  document.addEventListener("keydown", (event) => {
    const direction = {
      "ArrowUp": Direction.UP,
      "ArrowDown": Direction.DOWN,
      "ArrowLeft": Direction.LEFT,
      "ArrowRight": Direction.RIGHT,
    }[event.key];

    if (direction !== undefined) {
      event.preventDefault();
      move(direction);
    }
  });

  function startNewGame() {
    catPosition = { x: 0, y: 0 };
    do {
      starPosition = { x: getRandomIntFromInterval(0, BOARD_SIZE - 1), y: getRandomIntFromInterval(1, BOARD_SIZE - 1) };
    } while (starPosition.x === catPosition.x && starPosition.y === catPosition.y);

    placeEntity(catElement, catPosition);
    placeEntity(starElement, starPosition);
    isRunning = true;

    pubSubService.publish(PubSubEvent.GAME_START);
  }

  return [hostElement, startNewGame];
}
