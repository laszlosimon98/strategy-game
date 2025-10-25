import type { ColorType } from "@/types/state.types";
import { Indices } from "@/utils/indices";

export type Settings = {
  colors: ColorType[];
  serverUrl: string;
  maxPlayer: number;
  codeLength: number;
  mapSeed: string;
  mapSize: number;
  cellSize: number;
  startPositions: Indices[];
};

export type ReturnMessage = {
  message: string;
};
