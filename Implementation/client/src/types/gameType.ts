import { MainMenuState, SubMenuState } from "../enums/gameMenuState";
import { GameState } from "../enums/gameState";
import { PageState } from "../enums/pageState";
import { Pointer } from "../enums/pointer";
import { Building } from "../game/world/builder/building";
import { Dimension } from "../utils/dimension";
import { Indices } from "../utils/indices";

export type TileType = "grass" | "grass_flower" | "grass_rock";

export type BuildingType = {
  data: {
    indices: Indices;
    owner: string;
    url: string;
    dimensions: Dimension;
  };
};

export type ImagesType = {
  images: {
    page: any;
    game: any;
  };
};

export type NavigationType = {
  navigation: {
    pageState: PageState;
    gameMenuState: MainMenuState;
    subMenuState: SubMenuState;
  };
};
export type ServerType = {
  server: {
    status: "online" | "offline";
  };
};

export type PlayerType = {
  player: {
    name: string;
    host: boolean;
  };
};

export type InfoType = {
  info: {
    name: string;
    data: any;
  };
};

export type PointerType = {
  pointer: {
    state: Pointer;
  };
};

export type PlayerGameType = {
  [code: string]: {
    name: string;
    buildings: Building[];
  };
};

export type GameType = {
  game: {
    state: GameState;
    players: PlayerGameType;
    selectedBuilding: BuildingType;
  };
};

export type stateType = ImagesType &
  NavigationType &
  ServerType &
  PlayerType &
  InfoType &
  PointerType &
  GameType;
