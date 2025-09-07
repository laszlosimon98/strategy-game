import { Socket } from "socket.io";
import { Indices } from "../utils/indices";
import { World } from "./world";
import { Validator } from "../validator";
import { Building } from "./building";
import { state } from "../../data/state";
import { Communicate } from "../communicate";
import { Cell } from "./cell";
import { EntityType } from "../../types/types";
import { MAP_SIZE } from "../../settings";
import { getImageNameFromUrl } from "../utils/utils";

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
    const newBuilding: Building = new Building(entity);
    const buildingName = getImageNameFromUrl(entity.data.url);

    newBuilding.setOwner(socket.id);

    state[Communicate.getCurrentRoom(socket)].players[socket.id].buildings.push(
      newBuilding
    );

    for (let l = 0; l < 2; ++l) {
      for (let k = 0; k < 2; ++k) {
        if (l === 1 && l === k) continue;
        if (i + l < MAP_SIZE && j + k < MAP_SIZE) {
          const cell: Cell = world[i + l][j + k];
          cell.setObstacle(true);
          cell.setObstacleType(buildingName);
        }
      }
    }

    return newBuilding;
  }

  public static destroy(indices: Indices, socket: Socket): boolean {
    const world: Cell[][] = World.getWorld(socket);
    const i = indices.i;
    const j = indices.j;

    if (world[i][j].cellHasObstacle()) {
      const buildings: Building[] =
        state[Communicate.getCurrentRoom(socket)].players[socket.id].buildings;

      for (let index = buildings.length - 1; index >= 0; --index) {
        const building: Building = buildings[index];
        const buildingIndices: Indices = building.getEntity().data.indices;

        if (
          !Validator.areSenderAndOwnerSame(
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
          if (i + l < MAP_SIZE && j + k < MAP_SIZE) {
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
