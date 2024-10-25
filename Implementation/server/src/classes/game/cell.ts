import { TileType } from "../../types/types";
import { Indices } from "../utils/indices";

export class Cell {
  private indices: Indices;

  private g: number;
  private h: number;
  private f: number;

  private neighbors: Cell[];
  private previous?: Cell | undefined;

  private prevType: TileType;
  private type: TileType;

  private hasBuilding: boolean;
  private hasObstacle: boolean;

  public constructor(indices: Indices) {
    this.indices = indices;

    this.g = 0;
    this.h = 0;
    this.f = 0;

    this.neighbors = [];
    this.previous = undefined;

    this.prevType = "grass";
    this.type = "grass";

    this.hasBuilding = false;
    this.hasObstacle = false;
  }

  public getIndices(): Indices {
    return this.indices;
  }

  public setPrevType(type: TileType): void {
    this.prevType = type;
  }

  public getPrevType(): TileType {
    return this.prevType;
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

  public equals(other: Cell) {
    return (
      this.indices.i === other.indices.i && this.indices.j === other.indices.j
    );
  }
}
