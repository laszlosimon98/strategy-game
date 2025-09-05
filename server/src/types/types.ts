import { Socket } from "socket.io";
import { Building } from "../classes/game/building";
import { Cell } from "../classes/game/cell";
import { Indices } from "../classes/utils/indices";
import { Dimension } from "../classes/utils/dimension";
import { Unit } from "../classes/game/unit";

export type ColorType =
  | "black"
  | "blue"
  | "brown"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "white";

export type TileType = "grass" | "grass_flower" | "grass_rock" | "dirt";

export type Position = {
  x: number;
  y: number;
};

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
