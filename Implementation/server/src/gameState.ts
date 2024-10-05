export type PlayerType = {
  playerId: string;
  name: string;
};

type TileType = "grass" | "flower" | "rock";

export type MapType = {
  type: TileType;
  isBlockEmpty: boolean;
  building?: string;
};

export type TeamType = {
  isGameStarted: boolean;
  players: PlayerType[];
  world: MapType[][];
};

export type initialStateType = {
  [code: string]: TeamType;
};

export const gameState: initialStateType = {};
