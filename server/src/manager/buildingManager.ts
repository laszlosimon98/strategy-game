import { Building } from "@/game/building";
import { buildingRegister } from "@/game/buildingRegister";
import { Cell } from "@/game/cell";
import { World } from "@/game/world";
import { ServerHandler } from "@/server/serverHandler";
import { getImageNameFromUrl } from "@/utils/utils";
import { Validator } from "@/utils/validator";
import { StateManager } from "@/manager/stateManager";
import { BuildingPrices, Buildings } from "@/types/building.types";
import { ReturnMessage } from "@/types/setting.types";
import { EntityType, StateType } from "@/types/state.types";
import { Socket } from "socket.io";
import { GuardHouse } from "@/game/buildings/military/guardhouse";
import { DestroyBuildingResponse, Territory } from "@/types/world.types";
import { ObstacleEnum } from "@/enums/ObstacleEnum";

export class BuildingManager {
  private static buildingPrices: BuildingPrices = {
    bakery: { boards: 2, stone: 2 },
    barracks: { boards: 2, stone: 1 },
    farm: { boards: 3, stone: 3 },
    forester: { boards: 2, stone: 0 },
    guardhouse: { boards: 2, stone: 3 },
    ironsmelter: { boards: 2, stone: 2 },
    mill: { boards: 2, stone: 2 },
    residence: { boards: 3, stone: 1 },
    sawmill: { boards: 2, stone: 2 },
    stonecutter: { boards: 2, stone: 0 },
    storage: { boards: 2, stone: 2 },
    toolsmith: { boards: 2, stone: 2 },
    weaponsmith: { boards: 2, stone: 2 },
    well: { boards: 2, stone: 0 },
    woodcutter: { boards: 2, stone: 0 },
  };

  private constructor() {}

  private static isPossibleToBuild = (
    xPos: number,
    yPos: number,
    socket: Socket
  ): boolean => {
    return StateManager.getWorld(socket)[xPos][yPos].isBuildAble();
  };

  private static createBuilding(
    room: string,
    socket: Socket,
    state: StateType,
    building: Building
  ): void {
    state[room].players[building.getEntity().data.owner].buildings.push(
      building
    );
  }

  private static destroyBuilding(
    room: string,
    socket: Socket,
    state: StateType,
    building: Building
  ): void {
    const buildingIndex: number = state[room].players[
      socket.id
    ].buildings.findIndex(
      (b) => b.getEntity().data.id === building.getEntity().data.id
    );

    if (buildingIndex === -1) return;

    state[room].players[socket.id].buildings.splice(buildingIndex, 1);
  }

  private static hasMaterialsToBuild(
    socket: Socket,
    room: string,
    buildingName: Buildings
  ): boolean {
    const { boards, stone } = this.buildingPrices[buildingName as Buildings];

    const hasPlayerEnoughBoards: boolean = StateManager.hasMaterial(
      socket,
      room,
      "materials",
      "boards",
      boards
    );
    const hasPlayerEnoughStone: boolean = StateManager.hasMaterial(
      socket,
      room,
      "materials",
      "stone",
      stone
    );

    return hasPlayerEnoughBoards && hasPlayerEnoughStone;
  }

  private static setProduction(entity: EntityType, building: Building) {
    entity.data.cooldownTimer = building.getCooldown();
    entity.data.productionTime = building.getProductionTime();

    if (building.isProductionBuilding()) {
      entity.data.isProductionBuilding = true;
    }
  }

  private static creator<T>(
    Creator: new (...args: any[]) => T,
    ...args: ConstructorParameters<typeof Creator>
  ): T {
    return new Creator(...args);
  }

  public static getBuildingPrices(): BuildingPrices {
    return this.buildingPrices;
  }

  public static build(
    socket: Socket,
    state: StateType,
    entity: EntityType
  ): Building | ReturnMessage {
    const { i, j } = entity.data.indices;

    if (
      !this.isPossibleToBuild(i, j, socket) ||
      !World.isCellInTerritory(socket, entity)
    ) {
      return { message: "A kiválaszott helyre nem lehet építeni!" };
    }

    const buildingName = getImageNameFromUrl(entity.data.url);
    const room: string = ServerHandler.getCurrentRoom(socket);

    if (this.hasMaterialsToBuild(socket, room, buildingName as Buildings)) {
      const building: Building = this.creator<Building>(
        buildingRegister[entity.data.name],
        entity
      );

      building.setOwner(entity.data.owner);
      this.createBuilding(room, socket, state, building);
      World.occupyCells(socket, building);
      this.setProduction(entity, building);

      return building;
    } else {
      return { message: "Nincs elég nyersanyag az építéshez!" };
    }
  }

  public static destroy(
    socket: Socket,
    entity: EntityType,
    state: StateType
  ): DestroyBuildingResponse {
    const room: string = ServerHandler.getCurrentRoom(socket);
    const world: Cell[][] = StateManager.getWorld(socket);
    const { i, j } = entity.data.indices;

    const failedMessage: DestroyBuildingResponse = {
      status: "failed",
      message: "Sikertelen épület elbontás!",
      restoredCells: [],
      lostTerritoryBuildings: [],
    };

    if (world[i][j].getHighestPriorityObstacleType() !== ObstacleEnum.House) {
      return failedMessage;
    }

    const building: Building | undefined = this.getBuildingByEntity(
      room,
      socket,
      state,
      entity
    );

    if (
      !building ||
      (building &&
        !Validator.canPlayerDemolishOwnBuilding(
          socket,
          building.getEntity().data.owner
        ))
    ) {
      return failedMessage;
    }
    this.destroyBuilding(room, socket, state, building);

    let restoredCells: Territory[] = [];
    let lostTerritoryBuildings: Building[] = [];

    if (building instanceof GuardHouse) {
      const result = World.handleGuardHouseDestruction(socket, building);

      if (!result) return failedMessage;

      restoredCells = result.restoredCells;
      lostTerritoryBuildings = result.lostTerritoryBuildings;

      lostTerritoryBuildings.forEach((b) => {
        this.destroyBuilding(room, socket, state, b);
        World.restoreCells(socket, b);
      });
    }

    World.restoreCells(socket, building);

    return {
      status: "completed",
      message: "Épület sikeresen elbontva!",
      restoredCells,
      lostTerritoryBuildings,
    };
  }

  public static getBuildings(
    room: string,
    socket: Socket,
    state: StateType
  ): Building[] {
    return [...state[room].players[socket.id].buildings];
  }

  public static getBuilding(
    room: string,
    socket: Socket,
    state: StateType,
    building: Building
  ): Building | undefined {
    const buildings: Building[] = this.getBuildings(room, socket, state);
    return buildings.find(
      (b) => b.getEntity().data.id === building.getEntity().data.id
    );
  }

  public static getBuildingByEntity(
    room: string,
    socket: Socket,
    state: StateType,
    entity: EntityType
  ): Building | undefined {
    const buildings: Building[] = this.getBuildings(room, socket, state);
    return buildings.find((b) => b.getEntity().data.id === entity.data.id);
  }
}
