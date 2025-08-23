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

  private hasObstacle: boolean;
  private obstacleType: string | null = null;

  public constructor(indices: Indices) {
    this.indices = indices;

    this.g = 0;
    this.h = 0;
    this.f = 0;

    this.neighbors = [];
    this.previous = undefined;

    this.prevType = "grass";
    this.type = "grass";

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

  public setObstacle(state: boolean): void {
    this.hasObstacle = state;
  }

  public cellHasObstacle(): boolean {
    return this.hasObstacle;
  }

  public setObstacleType(type: string | null): void {
    this.obstacleType = type;
  }

  public getObstacleType(): string | null {
    return this.obstacleType;
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

  /**
   * Hozzáadja a szomszéd listához a cellát
   * @param {Cell} cell szomszédos cella
   */
  public addNeighbors(cell: Cell): void {
    this.neighbors.push(cell);
  }

  public getNeighbors(): Cell[] {
    return this.neighbors;
  }

  /**
   *
   * @returns megnézi, hogy van-e a cellán akadály
   */
  public isWalkAble(): boolean {
    return !this.hasObstacle;
  }

  /**
   *
   * @returns megnézi, hogy a cellára lehet-e építeni
   */
  public isBuildAble(): boolean {
    return this.type === "grass" && this.isWalkAble();
  }

  /**
   *
   * @param {Cell} other másik cella
   * @returns egyenlő-e a két cella
   */
  public equals(other: Cell) {
    return (
      this.indices.i === other.indices.i && this.indices.j === other.indices.j
    );
  }
}
