import { defineEnum } from "./utils/enums";

export type Direction = defineEnum<typeof Direction>;
export const Direction = defineEnum({
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
});

export const ALL_DIRECTIONS: Direction[] = Object.values(Direction);

export function isDirection(move: unknown): move is Direction {
  return ALL_DIRECTIONS.includes(move as Direction);
}

export type ComponentDefinition<UpdateOptions = unknown, R = void> = [
  hostElement: HTMLElement,
  updateFunction?: (options?: UpdateOptions) => R,
];
