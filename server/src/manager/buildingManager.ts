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
import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { DestroyBuildingResponse } from "@/types/world.types";
import { Manager } from "@/manager/manager";

export class BuildingManager extends Manager {
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

  protected constructor() {
    super();
  }

  public static getBuildingPrices(): BuildingPrices {
    return this.buildingPrices;
  }

  public static build(
    socket: Socket,
    state: StateType,
    entity: EntityType,
    needMaterial: boolean = true
  ): Building | ReturnMessage {
    const { i, j } = entity.data.indices;

    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return { message: "A kiválaszott helyre nem lehet építeni!" };

    if (
      !this.isPossibleToBuild(i, j, socket, room) ||
      !World.isCellInTerritory(socket, entity, room)
    ) {
      return { message: "A kiválaszott helyre nem lehet építeni!" };
    }

    const buildingName = entity.data.name;

    if (
      needMaterial &&
      !this.hasMaterialsToBuild(socket, room, buildingName as Buildings)
    ) {
      return { message: "Nincs elég nyersanyag az építéshez!" };
    }

    const building: Building = this.creator<Building>(
      buildingRegister[buildingName],
      entity
    );

    building.setOwner(entity.data.owner);
    this.createBuilding(room, socket, state, building);
    World.occupyCells(socket, building, room);
    this.setProduction(entity, building);

    return building;
  }

  public static destroy(
    socket: Socket,
    entity: EntityType,
    state: StateType,
    needValidation: boolean = true
  ): DestroyBuildingResponse | null {
    const room: string = ServerHandler.getCurrentRoom(socket);
    if (!room) return null;

    const world: Cell[][] = StateManager.getWorld(room, socket);
    const { i, j } = entity.data.indices;

    if (world[i][j].getHighestPriorityObstacleType() !== ObstacleEnum.House) {
      return null;
    }

    const building: Building | undefined = this.getBuildingByEntity(
      room,
      state,
      entity
    );

    if (
      !building ||
      (needValidation &&
        building &&
        !Validator.verifyOwner(socket, building.getEntity()))
    ) {
      return null;
    }

    const { lostBuildings, markedCells, updatedCells } = World.cleanTerritory(
      socket,
      building
    );

    return {
      updatedCells,
      markedCells,
      lostBuildings,
    };
  }

  public static destroyBuilding(
    room: string,
    state: StateType,
    building: Building
  ): void {
    const buildingIndex: number = state[room].players[
      building.getEntity().data.owner
    ].buildings.findIndex(
      (b) => b.getEntity().data.id === building.getEntity().data.id
    );

    if (buildingIndex === -1) return;

    state[room].players[building.getEntity().data.owner].buildings.splice(
      buildingIndex,
      1
    );
  }

  public static getBuildings(
    room: string,
    owner: string,
    state: StateType
  ): Building[] {
    return [...state[room].players[owner].buildings];
  }

  public static getBuildingByEntity(
    room: string,
    state: StateType,
    entity: EntityType
  ): Building | undefined {
    const buildings: Building[] = this.getBuildings(
      room,
      entity.data.owner,
      state
    );
    return buildings.find((b) => b.getEntity().data.id === entity.data.id);
  }

  private static isPossibleToBuild = (
    xPos: number,
    yPos: number,
    socket: Socket,
    room: string
  ): boolean => {
    return StateManager.getWorld(room, socket)[xPos][yPos].isBuildAble();
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
}
