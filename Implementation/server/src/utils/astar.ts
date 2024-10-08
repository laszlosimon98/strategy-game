import { Cell } from "./cell";
import { Indices } from "./point";

export class AStar {
  private static currentCell: Cell;

  private constructor() {}

  private static heuristic(current: Cell, end: Cell): number {
    return Math.sqrt(
      Math.pow(current.i - end.i, 2) + Math.pow(current.j - end.j, 2)
    );
    // return Math.abs(current.i - end.i) + Math.abs(current.j - end.j);
  }

  private static removeElementFromList(arr: Cell[], element: Cell): void {
    for (let i = arr.length - 1; i >= 0; --i) {
      if (arr[i].equals(element)) {
        arr.splice(i, 1);
      }
    }
  }

  private static updateNeighbor(neighbor: Cell, end: Cell): void {
    neighbor.setG(
      this.currentCell.getG() + this.heuristic(this.currentCell, neighbor)
    );
    neighbor.setH(this.heuristic(neighbor, end));
    neighbor.setF(neighbor.getG() + neighbor.getH());
  }

  private static calculatePath(start: Cell, end: Cell): boolean {
    const openList: Cell[] = [];
    const closedList: Cell[] = [];

    start.setF(0);
    start.setG(0);
    start.setH(this.heuristic(start, end));

    openList.push(start);

    while (openList.length > 0) {
      let lowest: number = 0;

      for (let i = 0; i < openList.length; ++i) {
        if (openList[i].getF() < openList[lowest].getF()) {
          lowest = i;
        }
      }

      this.currentCell = openList[lowest];

      if (this.currentCell.equals(end)) {
        console.log("Út megtalálva!");
        return true;
      }

      this.removeElementFromList(openList, this.currentCell);
      closedList.push(this.currentCell);

      const neighbors = this.currentCell.getNeighbors();

      for (let i = 0; i < neighbors.length; ++i) {
        const neighbor = neighbors[i];

        if (!closedList.includes(neighbor) && neighbor.getBuilding() === null) {
          if (openList.includes(neighbor)) {
            if (this.currentCell.getF() < neighbor.getF()) {
              this.updateNeighbor(neighbor, end);
            }
          } else {
            neighbor.setPrevious(this.currentCell);
            openList.push(neighbor);
          }
        }
      }
    }

    console.log("Nincs megoldas");
    return false;
  }

  public static getPath(start: Cell, end: Cell): Indices[] {
    const isPath: boolean = this.calculatePath(start, end);

    const path: Cell[] = [];
    let temp: Cell | undefined = this.currentCell;

    path.unshift(temp);

    while (temp!.getPrevious()) {
      temp = temp!.getPrevious();
      if (temp) {
        path.unshift(temp);
      }
    }

    const result = path.map((cell) => {
      return new Indices(cell.i, cell.j);
    });

    return result;
  }
}
