import { MainMenuState, SubMenuState } from "@/enums/gameMenuState";
import { GameState } from "@/enums/gameState";
import { PageState } from "@/enums/pageState";
import { ServerHandler } from "@/server/serverHandler";
import type { EntityType, InitialStateType } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";
import { faker } from "@faker-js/faker/locale/hu";

export class GameStateManager {
  private static initEntity: EntityType = {
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

  private static state: InitialStateType = {
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
        data: { ...this.initEntity.data },
      },
    },
  };

  private constructor() {}

  public static setImages(images: any) {
    this.state.images = images;
  }

  public static getImages(): any {
    return this.state.images;
  }

  public static getPageState(): PageState {
    return this.state.navigation.pageState;
  }

  public static setPageState(state: PageState): void {
    this.state.navigation.pageState = state;
  }

  public static getPlayerName(): string {
    return this.state.player.name;
  }

  public static setPlayerName(name: string): void {
    this.state.player.name = name;
  }

  public static isPlayerHost(): boolean {
    return this.state.player.host;
  }

  public static setHost(host: boolean): void {
    this.state.player.host = host;
  }

  public static getLanguage(): "hu" | "en" {
    return this.state.language;
  }

  public static getUIUrl(name: string): string {
    return this.state.images.ui[name].url;
  }
}
