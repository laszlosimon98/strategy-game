import { Building } from "@/classes/game/building";
import { Cell } from "@/classes/game/cell";
import { World } from "@/classes/game/world";
import { ServerHandler } from "@/classes/serverHandler";
import { Indices } from "@/classes/utils/indices";
import { getImageNameFromUrl } from "@/classes/utils/utils";
import { Validator } from "@/classes/validator";
import { settings } from "@/settings";
import { BuildingPrices } from "@/types/building.types";
import { EntityType, StateType } from "@/types/state.types";
import { Socket } from "socket.io";

export class BuildingManager {
  private static buildingPrices: BuildingPrices = {
    bakery: { wood: 2, stone: 2 },
    barracks: { wood: 2, stone: 1 },
    farm: { wood: 3, stone: 3 },
    forester: { wood: 2, stone: 0 },
    guardhouse: { wood: 2, stone: 3 },
    ironsmelter: { wood: 2, stone: 2 },
    mill: { wood: 2, stone: 2 },
    residence: { wood: 0, stone: 0 },
    sawmill: { wood: 2, stone: 2 },
    stonecutter: { wood: 2, stone: 0 },
    storage: { wood: 2, stone: 2 },
    toolsmith: { wood: 2, stone: 2 },
    weaponsmith: { wood: 2, stone: 2 },
    well: { wood: 2, stone: 0 },
    woodcutter: { wood: 2, stone: 0 },
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

  public static getBuildingPrices(): BuildingPrices {
    return this.buildingPrices;
  }

  public static build(
    socket: Socket,
    state: StateType,
    entity: EntityType
  ): Building | undefined {
    const { i, j } = entity.data.indices;

    if (!this.isPossibleToBuild(i, j, socket)) {
      return;
    }

    const world: Cell[][] = World.getWorld(socket);
    const building: Building = new Building(entity);
    const buildingName = getImageNameFromUrl(entity.data.url);

    building.setOwner(socket.id);

    const room: string = ServerHandler.getCurrentRoom(socket);
    this.createBuilding(room, socket, state, building);

    this.occupyCells(entity.data.indices, world, buildingName);

    return building;
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
