import { faker } from "@faker-js/faker/locale/hu";

import { MainMenuState, SubMenuState } from "@/enums/gameMenuState";
import { GameState } from "@/enums/gameState";
import { PageState } from "@/enums/pageState";
import { ServerHandler } from "@/server/serverHandler";
import { EntityType, stateType } from "@/types/gameType";
import { Dimension } from "@/utils/dimension";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";

export const initState: EntityType = {
  data: {
    id: "",
    owner: ServerHandler.getId(),
    url: "",
    static: "",
    indices: Indices.zero(),
    dimensions: Dimension.zero(),
    position: Position.zero(),
  },
};

export const state: stateType = {
  language: "hu",
  images: {
    buildings: {},
    ui: {},
    colors: {},
    ground: {},
    obstacles: {},
  },
  navigation: {
    pageState: PageState.MainMenu,
    gameMenuState: MainMenuState.Unselected,
    subMenuState: SubMenuState.Unselected,
    prevMenuState: MainMenuState.Unselected,
  },
  server: {
    status: "offline",
  },
  player: {
    name: faker.person.firstName(),
    host: false,
  },
  infoPanel: {
    data: undefined,
  },
  game: {
    worldSize: 15, // Ennek majd a szerverről kell jönnie
    state: GameState.Default,
    players: {},
    builder: {
      data: { ...initState.data },
    },
  },
};
