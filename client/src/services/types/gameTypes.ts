import { Dimension } from "@/game/utils/dimension";
import { Indices } from "@/game/utils/indices";
import { Position } from "@/game/utils/position";
import { Building } from "@/game/world/building/building";
import { Unit } from "@/game/world/unit/unit";
import { Soldier } from "@/game/world/unit/units/soldier";

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
