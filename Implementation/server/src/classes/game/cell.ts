import { TileType } from "../../types/types";

export class Cell {
  i: number;
  j: number;

  private g: number;
  private h: number;
  private f: number;

  private neighbors: Cell[];
  private previous?: Cell | undefined;

  private type: TileType;

  private hasBuilding: boolean;
  private hasObstacle: boolean;

  public constructor(i: number, j: number) {
    this.i = i;
    this.j = j;

    this.g = 0;
    this.h = 0;
    this.f = 0;

    this.neighbors = [];
    this.previous = undefined;

    this.type = "grass";

    this.hasBuilding = false;
    this.hasObstacle = false;
  }

  public addNeighbors(cell: Cell): void {
    this.neighbors.push(cell);
  }

  public getNeighbors(): Cell[] {
    return this.neighbors;
  }

  public isWalkAble(): boolean {
    return !this.hasBuilding && !this.hasObstacle;
  }

  public isBuildAble(): boolean {
    return this.type === "grass" && this.isWalkAble();
  }

  public hasCellBuilding(): boolean {
    return this.hasBuilding;
  }

  public setBuilding(state: boolean): void {
    this.hasBuilding = state;
  }

  public setObstacle(state: boolean): void {
    this.hasObstacle = state;
  }

  public setType(type: TileType): void {
    this.type = type;
  }

  public getType(): TileType {
    return this.type;
  }

  public getPrevious(): Cell | undefined {
    return this.previous;
  }

  public setPrevious(prev: Cell | undefined): void {
    this.previous = prev;
  }

  public setG(value: number): void {
    this.g = value;
  }

  public getG(): number {
    return this.g;
  }

  public setH(value: number): void {
    this.h = value;
  }

  public getH(): number {
    return this.h;
  }

  public setF(value: number): void {
    this.f = value;
  }

  public getF(): number {
    return this.f;
  }

  public equals(other: Cell) {
    return this.i === other.i && this.j === other.j;
  }
}
