import { Cell } from "../game/cell";
import { Indices } from "../utils/indices";

export class AStar {
  private static currentCell: Cell;

  private constructor() {}

  /**
   * Kiszámol egy heurisztikát a aktuális és a cél cella között,
   * ez segíti az algoritmus az útkeresésben
   * @param current aktuális cella
   * @param end  cél cella
   * @returns kiszámolt heurisztika
   */
  private static heuristic(current: Cell, end: Cell): number {
    const { i: ci, j: cj } = current.getIndices();
    const { i: ei, j: ej } = current.getIndices();

    return Math.sqrt(Math.pow(ci - ei, 2) + Math.pow(cj - ej, 2));
    // return Math.abs(current.i - end.i) + Math.abs(current.j - end.j);
  }

  /**
   * törli a megadott cellát a megadott cella tömből
   * @param {Cell[]} arr cella tömb
   * @param {Cell} element cella
   */
  private static removeElementFromList(arr: Cell[], element: Cell): void {
    for (let i = arr.length - 1; i >= 0; --i) {
      if (arr[i].equals(element)) {
        arr.splice(i, 1);
      }
    }
  }

  /**
   * beállítja az F, H és G értékeket a szomszéd cellának
   * @param {Cell} neighbor egy szomszéd
   * @param {Cell} end a cél cella
   */
  private static updateNeighbor(neighbor: Cell, end: Cell): void {
    neighbor.setG(
      this.currentCell.getG() + this.heuristic(this.currentCell, neighbor)
    );
    neighbor.setH(this.heuristic(neighbor, end));
    neighbor.setF(neighbor.getG() + neighbor.getH());
  }

  /**
   * Meghatározza az A* algoritmussal az útat a két megadott cella között
   * @param {Cell} start start cella
   * @param {Cell} end cél cella
   * @returns sikeres volt-e az útépítés a start és a cél cella között
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
   * Meghatározza az utat két cella között, felépíti az utat és átalakítja indexeké
   * @param {Cell} start start cella
   * @param {Cell} end cél cella
   * @returns Visszatér egy index tömbbel, ami az optimális utat jelöli
   */
  public static getPath(start: Cell, end: Cell): Indices[] {
    this.calculatePath(start, end);
    const path: Cell[] = this.buildPath();
    const pathIndices = this.convertPathToIndices(path);
    // this.destroyPath();

    return pathIndices;
  }

  /**
   *
   * @returns Felépíti az útat a start és a cél cella között
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

  private static destroyPath(): void {
    let current: Cell | undefined = this.currentCell;

    while (current!.getPrevious()) {
      let prev: Cell | undefined = current?.getPrevious();
      current!.setPrevious(undefined);
      current = prev;
    }
  }

  /**
   *
   * @param {Cell[]} path a start és a cél cella közötti cellák, amiket a algoritmus megtalált, mint optimális út
   * @returns Visszatér az útból kinyert indexekel
   */
  private static convertPathToIndices(path: Cell[]): Indices[] {
    const result = path.map((cell) => {
      return cell.getIndices();
    });

    return result;
  }
}
