import { PageState } from "../enums/pageState";
import { faker } from "@faker-js/faker";
import { Pointer } from "../enums/pointer";
import { GameState } from "../enums/gameState";
import { SelectedBuildingType, stateType } from "../types/gameType";
import { MainMenuState, SubMenuState } from "../enums/gameMenuState";

export const initBuildingState: SelectedBuildingType = {
  data: {
    url: "",
    dimensions: {
      width: 0,
      height: 0,
    },
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
  building: {
    selected: { ...initBuildingState },
  },
  info: {
    name: "",
    data: {},
  },
  pointer: {
    state: Pointer.Tile,
  },
  game: {
    state: GameState.default,
    players: {},
  },
};
