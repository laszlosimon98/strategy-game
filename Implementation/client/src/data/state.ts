import { PageState } from "../enums/pageState";
import { faker } from "@faker-js/faker";
import { Pointer } from "../enums/pointer";
import { GameState } from "../enums/gameState";
import { EntityType, stateType } from "../types/gameType";
import { MainMenuState, SubMenuState } from "../enums/gameMenuState";
import { Indices } from "../utils/indices";
import { Dimension } from "../utils/dimension";

export const initBuilding: EntityType = {
  data: {
    indices: Indices.zero(),
    owner: "",
    url: "",
    dimensions: Dimension.zero(),
  },
};

export const state: stateType = {
  language: "hu",
  images: {
    buildings: {},
    ui: {},
    colors: {},
    ground: {},
  },
  navigation: {
    pageState: PageState.MainMenu,
    gameMenuState: MainMenuState.Unselected,
    subMenuState: SubMenuState.Unselected,
  },
  server: {
    status: "offline",
  },
  player: {
    name: faker.person.firstName(),
    host: false,
  },
  info: {
    name: "",
    data: {},
  },
  pointer: {
    state: Pointer.Tile,
  },
  game: {
    state: GameState.Default,
    players: {},
    selectedBuilding: {
      data: { ...initBuilding.data },
    },
  },
};
