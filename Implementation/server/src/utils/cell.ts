import { TileType } from "../gameState";

export class Cell {
  i: number;
  j: number;

  private g: number;
  private h: number;
  private f: number;

  private neighbors: Cell[];
  private previous: Cell | undefined;

  private type: TileType;
  private building: string | null;
  private obstacle: string | null;

  constructor(i: number, j: number) {
    this.i = i;
    this.j = j;

    this.g = 0;
    this.h = 0;
    this.f = 0;

    this.neighbors = [];
    this.previous = undefined;

    this.type = "grass";
    this.building = null;
    this.obstacle = null;
  }

  addNeighbors(cell: Cell): void {
    this.neighbors.push(cell);
  }

  getNeighbors(): Cell[] {
    return this.neighbors;
  }

  isPlaceable(): boolean {
    return this.building === null && this.obstacle === null;
  }

  setType(type: TileType): void {
    this.type = type;
  }

  getType(): TileType {
    return this.type;
  }

  setBuilding(image: string | null): void {
    this.building = image;
  }

  getBuilding(): string | null {
    return this.building;
  }

  getPrevious(): Cell | undefined {
    return this.previous;
  }

  setPrevious(prev: Cell): void {
    this.previous = prev;
  }

  setG(value: number): void {
    this.g = value;
  }

  getG(): number {
    return this.g;
  }

  setH(value: number): void {
    this.h = value;
  }

  getH(): number {
    return this.h;
  }

  setF(value: number): void {
    this.f = value;
  }

  getF(): number {
    return this.f;
  }

  equals(other: Cell) {
    return this.i === other.i && this.j === other.j;
  }
}
