import { Cell } from "@/game/cell";
import { Indices } from "@/utils/indices";

/**
 * AStar útkeresés
 *
 * Egyszerű A* algoritmust valósít meg rács alapú térképekhez. Visszaadja
 * a kezdő- és végcella közötti cellaindexek sorozatát, ha út található.
 */
export class AStar {
  private static currentCell: Cell;

  private constructor() {}

  /**
   * Visszaadja a kezdő és célcella között talált út celláinak indexeit.
   * @param start - a kezdő cella
   * @param end - a cél cella
   * @returns a megtalált út celláinak `Indices[]` tömbje
   */
  public static getPath(start: Cell, end: Cell): Indices[] {
    this.calculatePath(start, end);
    const path: Cell[] = this.buildPath();
    const pathIndices = this.convertPathToIndices(path);

    return pathIndices;
  }

  /**
   * Heurisztikus függvény: becsült távolság két cella között.
   * @param current - a jelenlegi cella
   * @param end - a cél cella
   * @returns a két cella közötti becsült távolság
   */
  private static heuristic(current: Cell, end: Cell): number {
    const { i: ci, j: cj } = current.getIndices();
    const { i: ei, j: ej } = current.getIndices();

    return Math.sqrt(Math.pow(ci - ei, 2) + Math.pow(cj - ej, 2));
    // return Math.abs(current.i - end.i) + Math.abs(current.j - end.j);
  }

  /**
   * Eltávolít egy cellát egy listából.
   * @param arr - a cellákat tartalmazó tömb
   * @param element - a törlendő cella
   */
  private static removeElementFromList(arr: Cell[], element: Cell): void {
    for (let i = arr.length - 1; i >= 0; --i) {
      if (arr[i].equals(element)) {
        arr.splice(i, 1);
      }
    }
  }

  /**
   * Frissíti egy szomszéd cella G, H és F értékeit a jelenlegi cella alapján.
   * @param neighbor - a frissítendő szomszéd cella
   * @param end - a cél cella
   */
  private static updateNeighbor(neighbor: Cell, end: Cell): void {
    neighbor.setG(
      this.currentCell.getG() + this.heuristic(this.currentCell, neighbor)
    );
    neighbor.setH(this.heuristic(neighbor, end));
    neighbor.setF(neighbor.getG() + neighbor.getH());
  }

  /**
   * Lefuttatja az A* keresést a `start` és `end` cellák között.
   * @param start - kezdő cella
   * @param end - cél cella
   * @returns `true`, ha út található, különben `false`
   */
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
        return true;
      }

      this.removeElementFromList(openList, this.currentCell);
      closedList.push(this.currentCell);

      const neighbors = this.currentCell.getNeighbors();

      for (let i = 0; i < neighbors.length; ++i) {
        const neighbor = neighbors[i];

        if (!closedList.includes(neighbor) && neighbor.isWalkAble()) {
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

    return false;
  }

  /**
   * Visszaépíti az utat a `previous` hivatkozások mentén, a célból a kezdő felé.
   * @returns a path cellákat tartalmazó tömb (kezdő -> cél)
   */
  private static buildPath(): Cell[] {
    const path: Cell[] = [];
    let current: Cell | undefined = this.currentCell;

    path.unshift(current);

    while (current!.getPrevious()) {
      current = current!.getPrevious();
      if (current) {
        path.unshift(current);
      }
    }

    return path;
  }

  /**
   * Átalakítja a cella objektumokból álló utat egy `Indices[]` tömbbé.
   * @param path - a cellákból álló út
   * @returns az út celláinak indexei
   */
  private static convertPathToIndices(path: Cell[]): Indices[] {
    const result = path.map((cell) => {
      return cell.getIndices();
    });

    return result;
  }
}
