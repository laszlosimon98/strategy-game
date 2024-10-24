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
    newBuilding.setOwner(socket.id);

    state[Communicate.getCurrentRoom(socket)].players[socket.id].buildings.push(
      newBuilding
    );

    for (let k = -1; k <= 1; ++k) {
      for (let l = -1; l <= 1; ++l) {
        if (i + k > 0 && i + k < MAP_SIZE && j + l > 0 && j + l < MAP_SIZE) {
          world[i + k][j + l].setBuilding(true);
        }
      }
    }

    return newBuilding;
  }

  public static destroy(indices: Indices, socket: Socket): boolean {
    const world: Cell[][] = World.getWorld(socket);
    const i = indices.i;
    const j = indices.j;

    if (world[i][j].hasCellBuilding()) {
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

      for (let k = -1; k <= 1; ++k) {
        for (let l = -1; l <= 1; ++l) {
          if (i + k > 0 && i + k < MAP_SIZE && j + l > 0 && j + l < MAP_SIZE) {
            world[i + k][j + l].setBuilding(false);
          }
        }
      }
      return true;
    }
    return false;
  }
}
