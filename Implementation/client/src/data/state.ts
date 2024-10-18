import { PageState } from "../enums/pageState";
import { faker } from "@faker-js/faker";
import { Pointer } from "../enums/pointer";
import { GameState } from "../enums/gameState";
import { BuildingType, stateType } from "../types/gameType";
import { MainMenuState, SubMenuState } from "../enums/gameMenuState";
import { Indices } from "../utils/indices";
import { Dimension } from "../utils/dimension";

export const initBuilding: BuildingType = {
  data: {
    indices: Indices.zero(),
    owner: "",
    url: "",
    dimensions: Dimension.zero(),
  },
};

export const state: stateType = {
  images: {
    page: {},
    game: {},
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
