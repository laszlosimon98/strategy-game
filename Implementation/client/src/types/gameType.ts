import { MainMenuState, SubMenuState } from "../enums/gameMenuState";
import { GameState } from "../enums/gameState";
import { PageState } from "../enums/pageState";
import { Pointer } from "../enums/pointer";
import { Building } from "../game/world/building";

export type TileType = "grass" | "grass_flower" | "grass_rock";

export type BuildingAssetType = {
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
};

export type SelectedBuildingType = {
  data: BuildingAssetType;
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

type BuildingType = {
  building: {
    selected: SelectedBuildingType;
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

export type GameType = {
  game: {
    state: GameState;
    players: {
      [key: string]: {
        buildings: Building[];
      };
    };
  };
};

export type stateType = ImagesType &
  NavigationType &
  ServerType &
  PlayerType &
  BuildingType &
  InfoType &
  PointerType &
  GameType;
