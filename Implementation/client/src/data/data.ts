import { PageState } from "../states/pageState";
import { faker } from "@faker-js/faker";
import { Vector } from "../utils/vector";

export const globalState = {
  playerName: faker.person.firstName(),
  code: "",
  mousePos: new Vector(0, 0),
  state: PageState.MainMenu,
};
