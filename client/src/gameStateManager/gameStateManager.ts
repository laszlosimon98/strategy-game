import { MainMenuState, SubMenuState } from "@/enums/gameMenuState";
import { GameState } from "@/enums/gameState";
import { PageState } from "@/enums/pageState";
import type { Building } from "@/game/world/building/building";
import type { Unit } from "@/game/world/unit/unit";
import type { Soldier } from "@/game/world/unit/units/soldier";
import { ServerHandler } from "@/server/serverHandler";
import type {
  ColorsType,
  EntityType,
  ImageItemType,
  InitialStateType,
  PlayerGameType,
} from "@/types/game.types";
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

  public static getInitData(): EntityType {
    return this.initEntity;
  }

  // ------------------- Images -------------------

  public static setImages(images: any) {
    this.state.images = images;
  }

  public static getImages(...path: string[]): ImageItemType {
    return path.reduce(
      (acc: any, key: string) => acc?.[key],
      this.state.images
    );
  }

  // FIXME: any
  public static getFlag(entity: EntityType): any {
    return this.state.images.colors[
      this.state.game.players[entity.data.owner].color
    ].flag;
  }

  // ------------------- Navigation -------------------

  public static getPageState(): PageState {
    return this.state.navigation.pageState;
  }

  public static setPageState(state: PageState): void {
    this.state.navigation.pageState = state;
  }

  public static getGameMenuState(): MainMenuState {
    return this.state.navigation.gameMenuState;
  }

  public static setGameMenuStateByIndex(index: number): void {
    this.state.navigation.gameMenuState = index;
  }

  public static setGameMenuState(state: MainMenuState): void {
    this.state.navigation.gameMenuState = state;
  }

  public static setSubMenuStateByIndex(index: number): void {
    this.state.navigation.subMenuState = index;
  }

  public static getSubMenuState(): SubMenuState {
    return this.state.navigation.subMenuState;
  }

  public static getPrevMenuState(): MainMenuState {
    return this.state.navigation.prevMenuState;
  }

  public static setPrevMenuState(state: MainMenuState) {
    this.state.navigation.prevMenuState = state;
  }

  // ------------------- Player -------------------

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

  // ------------------- InfoPanel -------------------

  public static getInfoPanelData(): Building | Unit | undefined {
    return this.state.infoPanel.data;
  }

  public static setInfoPanelData(data: Building | Unit): void {
    this.state.infoPanel.data = data;
  }

  // ------------------- Language -------------------

  public static getLanguage(): "hu" | "en" {
    return this.state.language;
  }

  // ------------------- Server -------------------

  public static setServerStatus(status: "online" | "offline"): void {
    this.state.server.status = status;
  }

  // ------------------- State -------------------

  public static setState(state: GameState): void {
    this.state.game.state = state;
  }

  public static getState(): GameState {
    return this.state.game.state;
  }

  public static setGameState(state: GameState): void {
    this.state.game.state = state;
  }

  // ------------------- Players -------------------

  public static initPlayers(players: PlayerGameType): void {
    Object.keys(players).forEach((id) => {
      this.state.game.players[id] = {
        name: players[id].name,
        color: players[id].color,
        buildings: [],
        units: [],
        movingUnits: [],
        storage: players[id].storage,
      };
    });
  }

  public static getPlayers(): PlayerGameType {
    return this.state.game.players;
  }

  public static getPlayerById(id: string): PlayerGameType[""] {
    return this.state.game.players[id];
  }

  public static getPlayerColor(id: string): ColorsType {
    return this.getPlayerById(id).color;
  }

  // ------------------- Builder -------------------

  public static resetBuilder(): void {
    this.state.game.builder.data = { ...this.initEntity.data };
  }

  public static setBuilder(image: ImageItemType) {
    this.state.game.builder.data = {
      ...this.state.game.builder.data,
      ...image,
    };
  }

  public static getBuilder(): EntityType {
    return this.state.game.builder;
  }

  public static getBuildings(id: string): Building[] {
    return this.getPlayerById(id).buildings;
  }

  public static createBuilding(entity: EntityType, building: Building): void {
    const id: string = entity.data.owner;
    const buildingsReference: Building[] = this.getBuildings(id);
    buildingsReference.push(building);
  }

  // ------------------- Unit -------------------
  public static createUnit(id: string, unit: Unit): void {
    const unitsReference: Unit[] = this.getPlayerById(id).units;
    unitsReference.push(unit);
  }

  public static addUnitToMovingArray(id: string, unit: Unit): void {
    const movingUnitsReference: Unit[] = this.getPlayerById(id).movingUnits;
    movingUnitsReference.push(unit);
  }

  public static getMovingUnits(id: string): Unit[] {
    return this.getPlayerById(id).movingUnits;
  }

  public static getSoldiers(id: string): Soldier[] {
    return this.getPlayerById(id).units;
  }

  public static findSoldier(entity: EntityType): Soldier {
    const { owner, id } = entity.data;
    const units: Soldier[] = this.getSoldiers(owner);

    return units.find((unit) => unit.getEntity().data.id === id) as Soldier;
  }
}
