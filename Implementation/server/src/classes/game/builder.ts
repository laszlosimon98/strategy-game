import { Socket } from "socket.io";
import { Indices } from "../utils/indices";
import { World } from "./world";
import { BuildingType } from "../../types/types";
import { Validator } from "../validator";

export type BuildType = {
  indices: Indices;
  image: string;
  socket: Socket;
};

export class Builder {
  private constructor() {}

  private static checkIfPossibleToBuild = (
    xPos: number,
    yPos: number,
    socket: Socket
  ): boolean => {
    return World.getWorld(socket)[xPos][yPos].isPlaceable();
  };

  public static getHouseImage(
    indices: Indices,
    socket: Socket
  ): string | undefined {
    const i = indices.i;
    const j = indices.j;

    return World.getWorld(socket)[i][j].getBuilding().image;
  }

  public static build({ indices, image, socket }: BuildType): void {
    const i = indices.i;
    const j = indices.j;

    if (!this.checkIfPossibleToBuild(i, j, socket)) {
      return;
    }

    const world = World.getWorld(socket);

    const newBuilding: BuildingType = {
      image,
      owner: socket.id,
    };

    world[i][j].setBuilding(newBuilding);

    World.setWorld(world, socket);
  }

  public static destroy(indices: Indices, socket: Socket): boolean {
    const i = indices.i;
    const j = indices.j;

    const world = World.getWorld(socket);
    const building: BuildingType = world[i][j].getBuilding();

    if (!Validator.isSenderAndOwnerSame(socket, building.owner)) {
      return false;
    }

    world[i][j].setBuilding({ image: undefined, owner: undefined });
    World.setWorld(world, socket);

    return true;
  }
}
