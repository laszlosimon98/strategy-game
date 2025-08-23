import { Dimension } from "@/src/game/utils/dimension";
import { Indices } from "@/src/game/utils/indices";
import { Position } from "@/src/game/utils/position";
import { Building } from "@/src/game/world/building/building";
import { Unit } from "@/src/game/world/unit/unit";
import { Soldier } from "@/src/game/world/unit/units/soldier";

export type TileType = "grass" | "grass_flower" | "grass_rock" | "dirt";

type ColorType =
  | "black"
  | "blue"
  | "brown"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "white";

export type PlayerType = {
  [key: string]: string | ColorType | Building[] | Unit[] | Soldier[];
  name: string;
  color: ColorType;
  buildings: Building[];
  units: Soldier[];
  movingUnits: Unit[];
};

export type PlayerIdType = {
  [id: string]: PlayerType;
};

export type ServerHouseType = {
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
};

export type SoldierPropertiesType = {
  damage: number;
  range: number;
  health: number;
};

export type EntityType = {
  data: {
    id: string;
    owner: string;
    url: string;
    static: string;
    indices: Indices;
    dimensions: Dimension;
    position: Position;
  };
};
