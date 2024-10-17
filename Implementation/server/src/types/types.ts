import { Socket } from "socket.io";
import { Building } from "../classes/game/building";
import { Cell } from "../classes/game/cell";
import { Indices } from "../classes/utils/indices";
import { Dimension } from "../classes/utils/dimension";

export type BuildingType = {
  data: {
    indices: Indices;
    owner: string;
    url: string;
    dimensions: Dimension;
  };
};

export type BuildType = {
  building: BuildingType;
  socket: Socket;
  buildingPos?: { x: number; y: number };
};

export type PlayerType = {
  [id: string]: {
    name: string;
    buildings: Building[];
  };
};

export type TileType = "grass" | "grass_flower" | "grass_rock";

export type TeamType = {
  isGameStarted: boolean;
  players: PlayerType;
  world: Cell[][];
};

export type InitialStateType = {
  [code: string]: TeamType;
};
