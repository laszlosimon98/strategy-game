import { MainMenuState, SubMenuState } from "@/enums/gameMenuState";
import { GameState } from "@/enums/gameState";
import { PageState } from "@/enums/pageState";
import type { Building } from "@/game/world/building/building";
import type { Cell } from "@/game/world/cell";
import { Unit } from "@/game/world/unit/unit";
import type { Soldier } from "@/game/world/unit/units/soldier";
import { BuildingManager } from "@/manager/buldingManager";
import { PlayerManager } from "@/manager/playerManager";
import { StorageManager } from "@/manager/storageManager";
import { UnitManager } from "@/manager/unitManager";
import { ServerHandler } from "@/server/serverHandler";
import type { BuildingPrices } from "@/types/building.types";
import type {
  ColorType,
  EntityType,
  ImageItemType,
  StateType,
  PlayerGameType,
} from "@/types/game.types";
import type { StatisticType } from "@/types/statistic.type";
import type { StorageType } from "@/types/storage.types";
import { Dimension } from "@/utils/dimension";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";

export class StateManager {
  private static initEntity: EntityType = {
    data: {
      id: "",
      owner: ServerHandler.getId(),
      url: "",
      static: "",
      name: "",
      indices: Indices.zero(),
      dimensions: Dimension.zero(),
      position: Position.zero(),
      attackTimer: 0,
      cooldownTimer: 0,
      healingTimer: 0,
      productionTime: 0,
      isProductionBuilding: false,
      facing: 0,
    },
  };

  private static state: StateType = {
    accessToken: "",
    language: "hu",
    images: {
      buildings: {},
      ui: {},
      units: {},
      ground: {},
      obstacles: {},
      utils: {},
    },
    navigation: {
      pageState: PageState.MainMenu,
      gameMenuState: MainMenuState.Unselected,
      subMenuState: SubMenuState.Unselected,
      prevMenuState: MainMenuState.Unselected,
    },
    player: {
      name: "Játékos",
      host: false,
    },
    statistic: {
      player: {
        username: "",
        losses: 0,
        wins: 0,
      },
      topfive: [],
    },
    infoPanel: {
      data: null,
    },
    game: {
      world: [],
      state: GameState.Default,
      players: {},
      builder: {
        data: { ...this.initEntity.data },
      },
      isChatOpen: false,
    },
  };

  private constructor() {}

  public static getInitData(): EntityType {
    return this.initEntity;
  }

  // ------------------- AccessToken -------------------
  public static getAccessToken(): string {
    return this.state.accessToken;
  }

  public static setAccessToken(token: string): void {
    this.state.accessToken = token;
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

  public static getFlag(entity: EntityType): any {
    return this.getImages(
      "utils",
      this.getPlayerColor(entity.data.owner),
      "flag"
    );
  }

  public static getStaticImage(owner: string, name: string): ImageItemType {
    return this.getImages("units", this.getPlayerColor(owner), name);
  }

  // ------------------- Chat -------------------
  public static isChatOpen(): boolean {
    return this.state.game.isChatOpen;
  }

  public static setChatState(state: boolean): void {
    this.state.game.isChatOpen = state;
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

  public static playerLeft(id: string): void {
    const player = this.state.game.players[id];
    player.buildings = [];
    player.storage = {} as StorageType;
    player.units = [];

    delete this.state.game.players[id];
  }

  // ------------------- InfoPanel -------------------

  public static getInfoPanelData(): Building | Soldier | null {
    return this.state.infoPanel.data;
  }

  public static setInfoPanelData(data: Building | Soldier | null): void {
    this.state.infoPanel.data = data;
  }

  // ------------------- Language -------------------

  public static getLanguage(): "hu" | "en" {
    return this.state.language;
  }

  // ------------------- World -------------------

  public static getWorld(): Cell[][] {
    return this.state.game.world;
  }

  public static setWorld(world: Cell[][]): void {
    this.state.game.world = world;
  }

  public static setCellOwner(indices: Indices, owner: string | null): void {
    const { i, j } = indices;
    this.state.game.world[i][j].setOwner(owner);
  }

  // ------------------- Storage -------------------

  public static getStorage(id: string): StorageType | null {
    const player = this.getPlayerById(id);
    return StorageManager.getStorage(player);
  }

  public static updateStorage(id: string, newStorageValues: StorageType): void {
    const player = this.getPlayerById(id);

    StorageManager.updateStorage(player, newStorageValues);
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
    PlayerManager.initPlayers(this.state, players);
  }

  public static getPlayers(): PlayerGameType {
    return PlayerManager.getPlayers(this.state);
  }

  public static getPlayerById(id: string): PlayerGameType[""] {
    return PlayerManager.getPlayerById(this.state, id);
  }

  public static getPlayerColor(id: string): ColorType {
    return PlayerManager.getPlayerColor(this.state, id);
  }

  // ------------------- Builder -------------------

  public static resetBuilder(): void {
    BuildingManager.resetBuilder(this.state, this.initEntity);
  }

  public static setBuilder(image: ImageItemType): void {
    BuildingManager.setBuilder(this.state, image);
  }

  public static getBuilder(): EntityType {
    return BuildingManager.getBuilder(this.state);
  }

  public static getBuildings(id: string): Building[] {
    return BuildingManager.getBuildings(this.state, id);
  }

  public static createBuilding(entity: EntityType, building: Building): void {
    BuildingManager.createBuilding(this.state, entity, building);
  }

  public static getBuildingPrices(): BuildingPrices {
    return BuildingManager.getBuildingPrices();
  }

  public static setBuildingPrices(prices: BuildingPrices): void {
    BuildingManager.setBuildingPrices(prices);
  }

  public static destroyBuilding(entity: EntityType): void {
    BuildingManager.destroyBuilding(entity, this.state);
  }

  // ------------------- Unit -------------------

  public static createUnit(id: string, unit: Unit): void {
    UnitManager.createUnit(this.state, id, unit);
  }

  public static getUnits(id: string): Unit[] {
    return UnitManager.getUnits(this.state, id);
  }

  public static getUnit(entity: EntityType): Unit | undefined {
    return UnitManager.getUnit(this.state, entity);
  }

  public static removeUnit(entity: EntityType): void {
    UnitManager.removeUnit(this.state, entity);
  }

  // ------------------- Statistic -------------------

  public static savePlayerStat(stat: StatisticType): void {
    this.state.statistic.player = stat;
    console.log(this.state.statistic.player);
  }

  public static saveTopFive(stats: StatisticType[]): void {
    this.state.statistic.topfive = [...stats];
  }

  public static getPlayerStat(): StatisticType {
    return this.state.statistic.player;
  }

  public static getTopFive(): StatisticType[] {
    return this.state.statistic.topfive;
  }
}
