import { PageState } from "../states/pageState";
import { faker } from "@faker-js/faker";
import { GameMainMenuState, GameSubMenuState } from "../states/gameMenuState";

export const globalState = {
  playerName: faker.person.firstName(),
  host: false,
  serverStatus: "",
  state: PageState.MainMenu,
  gameMenuState: GameMainMenuState.Unselected,
  subMenuState: GameSubMenuState.Unselected,
};
