import { PageState } from "../states/pageState";
import { faker } from "@faker-js/faker";
import { GameMainMenuState, GameSubMenuState } from "../states/gameMenuState";
import { GameStateEnum } from "../game/utils/gameStateEnum";
import { PointerEnum } from "../game/utils/pointerEnum";
import { SelectedBuildingType } from "../game/types/types";

export const globalState = {
  playerName: faker.person.firstName(),
  host: false,
  serverStatus: "",
  state: PageState.MainMenu,
  gameMenuState: GameMainMenuState.Unselected,
  subMenuState: GameSubMenuState.Unselected,
};

export const gameState = {
  pointer: PointerEnum.Tile,
  state: GameStateEnum.default,
};

export const initBuildingState: SelectedBuildingType = {
  data: {
    url: "",
    dimensions: {
      width: 0,
      height: 0,
    },
  },
};

export const selectedBuilding: SelectedBuildingType = { ...initBuildingState };

export const infoPanel = {
  name: "",
  data: {},
};
