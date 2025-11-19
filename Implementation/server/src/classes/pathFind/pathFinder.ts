import { Cell } from "../game/cell";
import { Indices } from "../utils/indices";
import { AStar } from "./astar";

export class PathFinder {
  private constructor() {}

  private static resetWorld(world: Cell[][]): void {
    world.forEach((cells) =>
      cells.forEach((cell) => cell.setPrevious(undefined))
    );
  }

  public static getPath(
    world: Cell[][],
    start: Indices,
    end: Indices
  ): Indices[] {
    this.resetWorld(world);

    const startCell: Cell = world[start.i][start.j];
    const endCell: Cell = world[end.i][end.j];

    const path: Indices[] = AStar.getPath(startCell, endCell);

    return path;
  }
}
