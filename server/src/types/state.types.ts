import { Building } from "@/classes/game/building";
import { Cell } from "@/classes/game/cell";
import { Unit } from "@/classes/game/unit";
import { Dimension } from "@/classes/utils/dimension";
import { Indices } from "@/classes/utils/indices";
import { Position } from "@/types/position.types";

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
    indices: Indices;
    dimensions: Dimension;
    position: Position;
  };
};

export type PlayerType = {
  [id: string]: {
    name: string;
    color: ColorType;
    buildings: Building[];
    units: Unit[];
  };
};

export type TeamType = {
  isGameStarted: boolean;
  players: PlayerType;
  world: Cell[][];
  remainingColors: ColorType[];
};

export type InitialStateType = {
  [code: string]: TeamType;
};
