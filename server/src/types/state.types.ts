import { Building } from "@/game/building";
import { Cell } from "@/game/cell";
import { Unit } from "@/game/unit";
import { Dimension } from "@/utils/dimension";
import { Indices } from "@/utils/indices";
import type { Position } from "@/types/utils.types";
import { StorageType } from "@/types/storage.types";

export type ColorType =
  | "black"
  | "blue"
  | "brown"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "white";

export type EntityType = {
  data: {
    id: string;
    owner: string;
    url: string;
    static: string;
    name: string;
    indices: Indices;
    dimensions: Dimension;
    position: Position;
    productionTime: number | null;
    cooldownTimer: number | null;
    attackTimer: number | null;
    healingTimer: number | null;
    isProductionBuilding: boolean;
  };
};

export type PlayerType = {
  [id: string]: {
    id: string;
    name: string;
    isHost: boolean;
    color: ColorType;
    buildings: Building[];
    units: Unit[];
    storage: StorageType;
  };
};

export type TeamType = {
  isGameStarted: boolean;
  players: PlayerType;
  world: Cell[][];
  remainingColors: ColorType[];
};

export type StateType = {
  [code: string]: TeamType;
};
