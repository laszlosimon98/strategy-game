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
  ): {
    newBuilding: Building | undefined;
    changedCells: Cell[];
  } {
    const { i, j } = entity.data.indices;

    if (!this.isPossibleToBuild(i, j, socket)) {
      return { newBuilding: undefined, changedCells: [] };
    }

    const world: Cell[][] = World.getWorld(socket);
    const newBuilding: Building = new Building(entity);
    const changedCells: Cell[] = [];
    newBuilding.setOwner(socket.id);

    state[Communicate.getCurrentRoom(socket)].players[socket.id].buildings.push(
      newBuilding
    );

    // for (let k = -1; k <= 1; ++k) {
    //   for (let l = -1; l <= 1; ++l) {
    //     if (i + k > 0 && i + k < MAP_SIZE && j + l > 0 && j + l < MAP_SIZE) {
    //       const cell: Cell = world[i + k][j + l];
    //       cell.setBuilding(true);
    //       cell.setPrevType(cell.getType());
    //       cell.setType("dirt");
    //       changedCells.push(cell);
    //     }
    //   }
    // }

    for (let l = 0; l < 2; ++l) {
      for (let k = 0; k < 2; ++k) {
        if (l === 1 && l === k) continue;
        if (i + l < MAP_SIZE && j + k < MAP_SIZE) {
          const cell: Cell = world[i + l][j + k];
          cell.setBuilding(true);
          cell.setPrevType(cell.getType());
          cell.setType("dirt");
          changedCells.push(cell);
        }
      }
    }

    return { newBuilding, changedCells };
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

      for (let l = 0; l < 2; ++l) {
        for (let k = 0; k < 2; ++k) {
          if (l === 1 && l === k) continue;
          if (i + l < MAP_SIZE && j + k < MAP_SIZE) {
            const cell: Cell = world[i + l][j + k];
            cell.setBuilding(false);
            cell.setType(cell.getPrevType());
          }
        }
      }

      // for (let k = -1; k <= 1; ++k) {
      //   for (let l = -1; l <= 1; ++l) {
      //     if (i + k > 0 && i + k < MAP_SIZE && j + l > 0 && j + l < MAP_SIZE) {
      //       const cell: Cell = world[i + k][j + l];
      //       cell.setBuilding(false);
      //       cell.setType(cell.getPrevType());
      //     }
      //   }
      // }
      return true;
    }
    return false;
  }
}
