import { Building } from "@/game/building";
import { Stone } from "@/game/produceable/stone";
import { Tree } from "@/game/produceable/tree";
import { ReturnMessage } from "@/types/setting.types";
import { Indices } from "@/utils/indices";

export type Instance = Stone | Tree | null;

export type Territory = {
  indices: Indices;
  owner: string | null;
};

export type DestroyBuildingResponse = {
  status: "completed" | "failed";
} & ReturnMessage & {
    restoredCells: Territory[];
    lostTerritoryBuildings: Building[];
  };

export type TerritoryUpdateResponse = {
  updatedCells: Territory[];
  borderCells: Territory[];
};
