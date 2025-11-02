import { Cell } from "@/game/cell";
import { AStar } from "@/game/pathFind/astar";
import { Indices } from "@/utils/indices";

export class PathFinder {
  private constructor() {}

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

  private static resetWorld(world: Cell[][]): void {
    world.forEach((cells) =>
      cells.forEach((cell) => cell.setPrevious(undefined))
    );
  }
}
