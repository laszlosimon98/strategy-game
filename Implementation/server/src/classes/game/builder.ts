import { Socket } from "socket.io";
import { Indices } from "../utils/indices";
import { World } from "./world";
import { Cell } from "../utils/cell";

export type BuildType = {
  indices: Indices;
  image: string;
  width?: number;
  height?: number;
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

    return World.getWorld(socket)[i][j].getBuilding();
  }

  public static build({ indices, image, socket }: BuildType): void {
    const i = indices.i;
    const j = indices.j;

    if (!this.checkIfPossibleToBuild(i, j, socket)) {
      return;
    }

    const world = World.getWorld(socket);
    world[i][j].setBuilding(image);
    World.setWorld(world, socket);
  }

  public static destroy(indices: Indices, socket: Socket): void {
    const i = indices.i;
    const j = indices.j;

    const world = World.getWorld(socket);
    world[i][j].setBuilding(undefined);
    World.setWorld(world, socket);
  }
}
