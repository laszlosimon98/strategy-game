import { Building } from "@/classes/game/building";
import { Cell } from "@/classes/game/cell";
import { World } from "@/classes/game/world";
import { ServerHandler } from "@/classes/serverHandler";
import { Indices } from "@/classes/utils/indices";
import { getImageNameFromUrl } from "@/classes/utils/utils";
import { Validator } from "@/classes/validator";
import { StateManager } from "@/manager/stateManager";
import { settings } from "@/settings";
import { BuildingPrices, Buildings } from "@/types/building.types";
import { ErrorMessage } from "@/types/setting.types";
import { EntityType, StateType } from "@/types/state.types";
import { StorageType } from "@/types/storage.types";
import { Socket } from "socket.io";

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
    return World.getWorld(socket)[xPos][yPos].isBuildAble();
  };

  private static occupyCells(
    indices: Indices,
    world: Cell[][],
    buildingName: string
  ) {
    const i = indices.i;
    const j = indices.j;

    for (let l = 0; l < 2; ++l) {
      for (let k = 0; k < 2; ++k) {
        if (l === 1 && l === k) continue;
        if (i + l < settings.mapSize && j + k < settings.mapSize) {
          const cell: Cell = world[i + l][j + k];
          cell.setObstacle(true);
          cell.setObstacleType(buildingName);
        }
      }
    }
  }

  private static restoreCells(indices: Indices, world: Cell[][]) {
    const i = indices.i;
    const j = indices.j;

    for (let l = 0; l < 2; ++l) {
      for (let k = 0; k < 2; ++k) {
        if (l === 1 && l === k) continue;
        if (i + l < settings.mapSize && j + k < settings.mapSize) {
          const cell: Cell = world[i + l][j + k];
          cell.setObstacle(false);
          cell.setObstacleType(null);
        }
      }
    }
  }

  private static createBuilding(
    room: string,
    socket: Socket,
    state: StateType,
    building: Building
  ): void {
    state[room].players[socket.id].buildings.push(building);
  }

  private static destroyBuilding(
    room: string,
    socket: Socket,
    state: StateType,
    building: Building
  ): void {
    const buildingToDemolish: Building | undefined = this.getBuilding(
      room,
      socket,
      state,
      building
    );

    if (!buildingToDemolish) return;

    const buildingIndex: number = state[room].players[
      socket.id
    ].buildings.findIndex(
      (b) => b.getEntity().data.id === buildingToDemolish.getEntity().data.id
    );

    if (buildingIndex === -1) return;

    state[room].players[socket.id].buildings.splice(buildingIndex, 1);
  }

  private static hasMaterialsToBuild(
    room: string,
    buildingName: Buildings
  ): boolean {
    const currentStorageState: StorageType = StateManager.getStorage(room);
    const { boards, stone } = this.buildingPrices[buildingName as Buildings];

    const { boards: storageBoards, stone: storageStone } =
      currentStorageState.materials;

    return storageBoards.amount - boards > 0 && storageStone.amount - stone > 0;
  }

  public static getBuildingPrices(): BuildingPrices {
    return this.buildingPrices;
  }

  public static build(
    socket: Socket,
    state: StateType,
    entity: EntityType
  ): Building | ErrorMessage {
    const { i, j } = entity.data.indices;

    if (!this.isPossibleToBuild(i, j, socket)) {
      return { message: "A kiválaszott helyre nem lehet építeni!" };
    }

    const buildingName = getImageNameFromUrl(entity.data.url);
    const room: string = ServerHandler.getCurrentRoom(socket);

    if (this.hasMaterialsToBuild(room, buildingName as Buildings)) {
      const world: Cell[][] = World.getWorld(socket);
      const building: Building = new Building(entity);

      building.setOwner(socket.id);

      this.createBuilding(room, socket, state, building);

      this.occupyCells(entity.data.indices, world, buildingName);

      return building;
    } else {
      return { message: "Nincs elég nyersanyag az építéshez!" };
    }
  }

  public static destroy(
    socket: Socket,
    indices: Indices,
    state: StateType
  ): boolean {
    const room: string = ServerHandler.getCurrentRoom(socket);
    const world: Cell[][] = World.getWorld(socket);
    const i = indices.i;
    const j = indices.j;

    if (world[i][j].cellHasObstacle()) {
      const buildings: Building[] = this.getBuildings(room, socket, state);

      for (let index = buildings.length - 1; index >= 0; --index) {
        const building: Building = buildings[index];
        const buildingIndices: Indices = building.getEntity().data.indices;

        if (
          !Validator.canDemolishBuilding(
            socket,
            building.getEntity().data.owner
          )
        ) {
          return false;
        }

        if (buildingIndices.i === i && buildingIndices.j === j) {
          this.destroyBuilding(room, socket, state, building);
        }
      }

      this.restoreCells(indices, world);

      return true;
    }
    return false;
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
}
