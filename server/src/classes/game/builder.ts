import { Socket } from "socket.io";
import { Communicate } from "@/classes/communicate";
import { Building } from "@/classes/game/building";
import { Cell } from "@/classes/game/cell";
import { World } from "@/classes/game/world";
import { Indices } from "@/classes/utils/indices";
import { getImageNameFromUrl } from "@/classes/utils/utils";
import { Validator } from "@/classes/validator";
import { EntityType } from "@/types/state.types";
import { settings } from "@/settings";
import { GameStateManager } from "@/manager/gameStateManager";

export class Builder {
  private constructor() {}

  public static isPossibleToBuild = (
    xPos: number,
    yPos: number,
    socket: Socket
  ): boolean => {
    return World.getWorld(socket)[xPos][yPos].isBuildAble();
  };

  public static build(
    entity: EntityType,
    socket: Socket
  ): Building | undefined {
    const { i, j } = entity.data.indices;

    if (!this.isPossibleToBuild(i, j, socket)) {
      return;
    }

    const world: Cell[][] = World.getWorld(socket);
    const building: Building = new Building(entity);
    const buildingName = getImageNameFromUrl(entity.data.url);

    building.setOwner(socket.id);

    const room: string = Communicate.getCurrentRoom(socket);
    GameStateManager.createBuilding(room, socket, building);

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

    return building;
  }

  public static destroy(indices: Indices, socket: Socket): boolean {
    const room: string = Communicate.getCurrentRoom(socket);
    const world: Cell[][] = World.getWorld(socket);
    const i = indices.i;
    const j = indices.j;

    if (world[i][j].cellHasObstacle()) {
      const buildings: Building[] = GameStateManager.getBuildings(room, socket);

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
          buildings.splice(index, 1);
        }
      }

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
      return true;
    }
    return false;
  }
}
