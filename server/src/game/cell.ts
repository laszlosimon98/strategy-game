import { Indices } from "@/utils/indices";
import type { Instance, TileType } from "@/types/world.types";
import { CellTypeEnum } from "@/enums/cellTypeEnum";

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
  private obstacleType: CellTypeEnum;

  private instance: Instance;
  private owner: string | null;
  private hasTowerInfluence: boolean;

  public constructor(indices: Indices) {
    this.indices = indices;
    this.obstacleType = CellTypeEnum.Empty;
    this.instance = null;
    this.owner = null;
    this.hasTowerInfluence = false;

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

  public setObstacleType(type: CellTypeEnum): void {
    this.obstacleType = type;
  }

  public getObstacleType(): CellTypeEnum {
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

  public addNeighbors(cell: Cell): void {
    this.neighbors.push(cell);
  }

  public getNeighbors(): Cell[] {
    return this.neighbors;
  }

  public getInstance(): Instance {
    return this.instance;
  }

  public setInstance(instance: Instance): void {
    this.instance = instance;
  }

  public getOwner(): string | null {
    return this.owner;
  }

  public setOwner(id: string | null): void {
    this.owner = id;
  }

  public setTowerInfluence(towerInfluence: boolean): void {
    this.hasTowerInfluence = towerInfluence;
  }

  public getTowerInfluence(): boolean {
    return this.hasTowerInfluence;
  }

  public isWalkAble(): boolean {
    return [
      CellTypeEnum.Empty,
      CellTypeEnum.Decorated,
      // CellTypeEnum.Unit,
    ].includes(this.obstacleType);
  }

  public isBuildAble(): boolean {
    return this.type === "grass" && !this.hasObstacle;
  }

  public equals(other: Cell) {
    return (
      this.indices.i === other.indices.i && this.indices.j === other.indices.j
    );
  }
}
