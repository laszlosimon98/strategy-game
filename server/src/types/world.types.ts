import { Stone } from "@/game/produceable/stone";
import { Tree } from "@/game/produceable/tree";
import { Indices } from "@/utils/indices";

export type TileType = "grass" | "grass_flower" | "grass_rock" | "dirt";
export type Instance = Stone | Tree | null;

export type Territory = {
  indices: Indices;
  owner: string | null;
};
