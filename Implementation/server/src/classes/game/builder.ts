import { Socket } from "socket.io";
import { Indices } from "../utils/indices";
import { World } from "./world";
import { BuildType } from "../../types/types";
import { Validator } from "../validator";
import { Building } from "./building";
import { state } from "../../data/state";
import { Communicate } from "../communicate";
import { Cell } from "./cell";

export class Builder {
  private constructor() {}

  public static isPossibleToBuild = (
    xPos: number,
    yPos: number,
    socket: Socket
  ): boolean => {
    return World.getWorld(socket)[xPos][yPos].isBuildAble();
  };

  public static build({ building, socket }: BuildType): Building | undefined {
    const i = building.data.indices.i;
    const j = building.data.indices.j;

    if (!this.isPossibleToBuild(i, j, socket)) {
      return;
    }

    const world: Cell[][] = World.getWorld(socket);
    const newBuilding: Building = new Building(building);
    newBuilding.setOwner(socket.id);

    state[Communicate.getCurrentRoom(socket)].players[socket.id].buildings.push(
      newBuilding
    );
    world[i][j].setBuilding(true);

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
        const buildingIndices: Indices = building.getBuilding().data.indices;

        if (
          !Validator.areSenderAndOwnerSame(
            socket,
            building.getBuilding().data.owner
          )
        ) {
          return false;
        }

        if (buildingIndices.i === i && buildingIndices.j === j) {
          buildings.splice(index, 1);
        }
      }

      world[i][j].setBuilding(false);
      return true;
    }
    return false;
  }
}
