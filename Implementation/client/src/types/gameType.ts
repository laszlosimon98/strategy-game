import { MainMenuState, SubMenuState } from "../enums/gameMenuState";
import { GameState } from "../enums/gameState";
import { PageState } from "../enums/pageState";
import { Pointer } from "../enums/pointer";
import { Building } from "../game/world/builder/building";
import { Dimension } from "../utils/dimension";
import { Indices } from "../utils/indices";

export type TileType = "grass" | "grass_flower" | "grass_rock";
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
    indices: Indices;
    owner: string;
    url: string;
    dimensions: Dimension;
  };
};

export type BuildingType = EntityType;
export type UnitType = EntityType;

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
  info: {
    name: string;
    data: any;
  };
};

type PointerType = {
  pointer: {
    state: Pointer;
  };
};

export type PlayerGameType = {
  [code: string]: {
    name: string;
    color: ColorType;
    buildings: Building[];
  };
};

type GameType = {
  game: {
    state: GameState;
    players: PlayerGameType;
    selectedBuilding: BuildingType;
  };
};

export type stateType = LanguageType &
  ImagesType &
  NavigationType &
  ServerType &
  PlayerType &
  InfoType &
  PointerType &
  GameType;
