import { Cell } from "../classes/utils/cell";

export type PlayerType = {
  playerId: string;
  name: string;
};

export type TileType = "grass" | "grass_flower" | "grass_rock";

export type TeamType = {
  isGameStarted: boolean;
  players: PlayerType[];
  world: Cell[][];
};

export type initialStateType = {
  [code: string]: TeamType;
};

export const gameState: initialStateType = {};
