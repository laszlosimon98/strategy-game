import { Stone } from "@/game/produceable/stone";
import { Tree } from "@/game/produceable/tree";

export type TileType = "grass" | "grass_flower" | "grass_rock" | "dirt";
export type Instance = Stone | Tree | null;
