import { Socket } from "socket.io";
import { Indices } from "../utils/indices";
import { World } from "./world";
import { BuildType } from "../../types/types";
import { Validator } from "../validator";
import { Building } from "./building";
import { state } from "../../data/state";
import { Communicate } from "../communicate";

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

    const world = World.getWorld(socket);
    const newBuilding: Building = new Building(building);
    newBuilding.setOwner(socket.id);

    state[Communicate.getCurrentRoom(socket)].players[socket.id].buildings.push(
      newBuilding
    );
    world[i][j].setBuilding(true);

    return newBuilding;
  }

  public static destroy(indices: Indices, socket: Socket): boolean {
    return false;
    // const i = indices.i;
    // const j = indices.j;
    // const world = World.getWorld(socket);
    // // const building: BuildingType = world[i][j].getBuilding();
    // if (!Validator.isSenderAndOwnerSame(socket, building.owner)) {
    //   return false;
    // }
    // // world[i][j].setBuilding({ building: undefined, owner: undefined });
    // World.setWorld(world, socket);
    // return true;
  }
}
