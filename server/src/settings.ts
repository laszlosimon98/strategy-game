import { Indices } from "@/classes/utils/indices";
import type { Settings } from "@/types/setting.types";

const MAP_SIZE: number = 80;
const START_IDX: number = 10;
const MAX_PLAYER: number = 4;
const CODE_LENGTH: number = 2;
const MAP_SEED: string = "seed";
const SERVER_URL: string = "http://localhost:3000";
const CELL_SIZE: number = 48;

export const settings: Settings = {
  colors: [
    "black",
    "blue",
    "brown",
    "green",
    "orange",
    "purple",
    "red",
    "white",
  ],
  serverUrl: SERVER_URL,
  maxPlayer: MAX_PLAYER,
  codeLength: CODE_LENGTH,
  mapSeed: MAP_SEED,
  mapSize: 80,
  treespawnChance: 10,
  rockspawnChance: 93,
  cellSize: CELL_SIZE,
  startPositions: [
    new Indices(START_IDX, START_IDX),
    new Indices(MAP_SIZE - 1 - START_IDX, START_IDX),
    new Indices(START_IDX, MAP_SIZE - 1 - START_IDX),
    new Indices(MAP_SIZE - 1 - START_IDX, MAP_SIZE - 1 - START_IDX),
  ],
};
