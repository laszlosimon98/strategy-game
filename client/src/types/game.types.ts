import { MainMenuState, SubMenuState } from "@/enums/gameMenuState";
import { GameState } from "@/enums/gameState";
import { PageState } from "@/enums/pageState";
import { Building } from "@/game/world/building/building";
import type { Cell } from "@/game/world/cell";
import { Unit } from "@/game/world/unit/unit";
import { Soldier } from "@/game/world/unit/units/soldier";
import type { StorageType } from "@/types/storage.types";
import { Dimension } from "@/utils/dimension";
import { Indices } from "@/utils/indices";
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

export type ImageItemType = {
  url: string;
  dimensions: { width: number; height: number };
};

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
    productionTime: number;
    cooldownTimer: number;
    attackTimer: number;
    healingTimer: number;
    isProductionBuilding: boolean;
    facing: number;
  };
};

export type SoldierPropertyType = {
  damage: number;
  range: number;
  health: number;
};

type Language = { language: "hu" | "en" };

type AccessToken = { accessToken: string };

type Images = {
  images: {
    buildings: any;
    units: any;
    ground: any;
    ui: any;
    obstacles: any;
    utils: any;
  };
};

type NavigationType = {
  navigation: {
    pageState: PageState;
    gameMenuState: MainMenuState;
    subMenuState: SubMenuState;
    prevMenuState: MainMenuState;
  };
};

type PlayerType = {
  player: {
    name: string;
    host: boolean;
  };
};

type InfoType = {
  infoPanel: {
    data: Building | Soldier | null;
  };
};

export type PlayerGameType = {
  [code: string]: {
    [key: string]: string | ColorType | Building[] | Unit[] | StorageType;
    name: string;
    color: ColorType;
    buildings: Building[];
    units: Unit[];
    storage: StorageType;
  };
};

type Game = {
  game: {
    world: Cell[][];
    state: GameState;
    players: PlayerGameType;
    builder: EntityType;
    isChatOpen: boolean;
  };
};

export type StateType = AccessToken &
  Language &
  Images &
  NavigationType &
  PlayerType &
  InfoType &
  Game;

export type MessageResponse = {
  message: string;
};

export type StorageResponse = {
  storage: StorageType;
};

export type LabelButtonOptions = {
  hasTooltip: boolean;
  type: "house" | "unit";
  hasPrice: boolean;
};
