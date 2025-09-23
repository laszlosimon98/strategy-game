import type { ColorType } from "@/types/state.types";

export type Settings = {
  colors: ColorType[];
  serverUrl: string;
  maxPlayer: number;
  codeLength: number;
  mapSeed: string;
  mapSize: number;
  treespawnChance: number;
  rockspawnChance: number;
};

export type ErrorMessage = {
  message: string;
};
