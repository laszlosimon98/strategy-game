import { PageState } from "../states/pageState";
import { faker } from "@faker-js/faker";
import { Vector } from "../utils/vector";
import { GameMainMenuState, GameSubMenuState } from "../states/gameMenuState";

export const globalState = {
  playerName: faker.person.firstName(),
  host: false,
  serverStatus: "",
  mousePos: new Vector(0, 0),
  state: PageState.MainMenu,
  gameMenuState: GameMainMenuState.Unselected,
  subMenuState: GameSubMenuState.Unselected,
};
