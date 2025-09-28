import type { ColorType } from "@/types/state.types";
import { Indices } from "@/classes/utils/indices";

export type Settings = {
  colors: ColorType[];
  serverUrl: string;
  maxPlayer: number;
  codeLength: number;
  mapSeed: string;
  mapSize: number;
  treespawnChance: number;
  rockspawnChance: number;
  startPositions: Indices[];
};

export type ErrorMessage = {
  message: string;
};
