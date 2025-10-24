import { ObstacleEnum } from "@/game/enums/obstacleEnum";
import type { Indices } from "@/utils/indices";

export type TileType = "grass" | "grass_flower" | "grass_rock" | "dirt";

export type Territory = {
  indices: Indices;
  owner: string | null;
  obstacle: ObstacleEnum;
};

export type ObstacleImage = { type: ObstacleEnum; image: HTMLImageElement };
