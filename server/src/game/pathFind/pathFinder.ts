import { Cell } from "@/game/cell";
import { AStar } from "@/game/pathFind/astar";
import { StateManager } from "@/manager/stateManager";
import { Indices } from "@/utils/indices";
import { Socket } from "socket.io";

export class PathFinder {
  private constructor() {}

  public static getPath(
    room: string,
    socket: Socket,
    start: Indices,
    end: Indices
  ): Indices[] {
    const world: Cell[][] = StateManager.getWorld(room, socket);
    this.resetWorld(world);

    const startCell: Cell = world[start.i][start.j];
    const endCell: Cell = world[end.i][end.j];

    const path: Indices[] = AStar.getPath(startCell, endCell);

    return path;
  }

  private static resetWorld(world: Cell[][]): void {
    world.forEach((cells) =>
      cells.forEach((cell) => cell.setPrevious(undefined))
    );
  }
}
