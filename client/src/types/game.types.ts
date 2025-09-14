import { MainMenuState, SubMenuState } from "@/enums/gameMenuState";
import { GameState } from "@/enums/gameState";
import { PageState } from "@/enums/pageState";
import { Building } from "@/game/world/building/building";
import { Unit } from "@/game/world/unit/unit";
import { Soldier } from "@/game/world/unit/units/soldier";
import { Dimension } from "@/utils/dimension";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";

export type ColorsType =
  | "black"
  | "blue"
  | "brown"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "white";

// type ColorItemType =
//   | "archerattacking"
//   | "archeridle"
//   | "archerstatic"
//   | "archerwalking"
//   | "flag"
//   | "knightattacking"
//   | "knightidle"
//   | "knightstatic"
//   | "knightwalking";

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

type Language = { language: "hu" | "en" };

type Images = {
  images: {
    buildings: any;
    // colors: {
    //   [colors in ColorsType]: {
    //     [item in ColorItemType]: ItemType;
    //   };
    // };
    colors: any;
    ground: any;
    ui: any;
    obstacles: any;
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
    [key: string]: string | ColorsType | Building[] | Unit[];
    name: string;
    color: ColorsType;
    buildings: Building[];
    units: Soldier[];
    movingUnits: Unit[];
  };
};

type Game = {
  game: {
    worldSize: number;
    state: GameState;
    players: PlayerGameType;
    builder: EntityType;
  };
};

export type InitialStateType = Language &
  Images &
  NavigationType &
  ServerType &
  PlayerType &
  InfoType &
  Game;
