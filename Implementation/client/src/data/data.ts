import { PageState } from "../states/pageState";
import { faker } from "@faker-js/faker";

export const globalState = {
  playerName: faker.person.firstName(),
  code: "",
  state: PageState.MainMenu,
};
