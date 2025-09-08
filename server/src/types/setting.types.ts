import { ColorType } from "@/types/types";

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
