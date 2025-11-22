import { Building } from "@/game/buildings/building";
import { Cell } from "@/game/cell";
import { Unit } from "@/game/units/unit";
import { Dimension } from "@/utils/dimension";
import { Indices } from "@/utils/indices";
import { StorageType } from "@/types/storage.types";
import { Position } from "@/utils/position";

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
    facing: number;
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
  winner: string | null;
};

export type StateType = {
  [code: string]: TeamType;
};
