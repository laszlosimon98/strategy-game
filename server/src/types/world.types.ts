import { Building } from "@/game/buildings/building";
import { Cell } from "@/game/cell";
import { Stone } from "@/game/produceable/stone";
import { Tree } from "@/game/produceable/tree";

export type Instance = Stone | Tree | null;

export type DestroyBuildingResponse = {
  updatedCells: Cell[];
  markedCells: Cell[];
  lostBuildings: Building[];
};
