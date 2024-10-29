import { MainMenuState, SubMenuState } from "../enums/gameMenuState";
import { GameState } from "../enums/gameState";
import { PageState } from "../enums/pageState";
import { Building } from "../game/world/building/building";
import { Unit } from "../game/world/unit/unit";
import { Soldier } from "../game/world/unit/units/soldier";
import { Dimension } from "../utils/dimension";
import { Indices } from "../utils/indices";
import { Position } from "../utils/position";

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

export type SoldierPropertiesType = {
  damage: number;
  range: number;
  health: number;
};

type LanguageType = { language: "hu" | "en" };

type ImagesType = {
  images: {
    buildings: any;
    colors: any;
    ground: any;
    ui: any;
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

type ServerType = {
  server: {
    status: "online" | "offline";
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
    data: Building | Unit | undefined;
  };
};

export type PlayerGameType = {
  [code: string]: {
    [key: string]: string | ColorType | Building[] | Unit[];
    name: string;
    color: ColorType;
    buildings: Building[];
    units: Soldier[];
    movingUnits: Unit[];
  };
};

type GameType = {
  game: {
    worldSize: number;
    state: GameState;
    players: PlayerGameType;
    builder: EntityType;
  };
};

export type stateType = LanguageType &
  ImagesType &
  NavigationType &
  ServerType &
  PlayerType &
  InfoType &
  GameType;
