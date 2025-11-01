import { Indices } from "@/utils/indices";
import type { Instance } from "@/types/world.types";
import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { Building } from "@/game/building";
import { TileEnum } from "@/enums/tileEnum";
import { Position } from "@/utils/position";
import { Vector } from "@/utils/vector";
import { settings } from "@/settings";

const priorityList: Record<ObstacleEnum, number> = {
  [ObstacleEnum.Empty]: 0,
  [ObstacleEnum.Decorated]: 1,
  [ObstacleEnum.Occupied]: 2,
  [ObstacleEnum.Border]: 3,
  [ObstacleEnum.House]: 4,
  [ObstacleEnum.Tree]: 4,
  [ObstacleEnum.Stone]: 4,
  [ObstacleEnum.Unit]: 4,
};

export class Cell {
  private indices: Indices;

  private g: number;
  private h: number;
  private f: number;

  private neighbors: Cell[];
  private previous?: Cell | undefined;

  private prevType: TileEnum;
  private type: TileEnum;

  private obstacleTypes: ObstacleEnum[];

  private instance: Instance;
  private building: Building | null;
  private owner: string | null;
  private hasTowerInfluence: boolean;

  private isometricPos: Position[];
  private unitPos: Position;

  public constructor(indices: Indices) {
    this.indices = indices;
    this.obstacleTypes = [ObstacleEnum.Empty];
    this.instance = null;
    this.owner = null;
    this.hasTowerInfluence = false;
    this.building = null;

    this.g = 0;
    this.h = 0;
    this.f = 0;

    this.neighbors = [];
    this.previous = undefined;

    this.prevType = TileEnum.Grass;
    this.type = TileEnum.Grass;

    this.isometricPos = new Vector(indices.i, indices.j).getIsometricPos();

    this.unitPos = new Position(
      this.isometricPos[2].x,
      this.isometricPos[2].y - settings.cellSize / 4
    );
  }

  public getUnitPos(): Position {
    return this.unitPos;
  }

  public getIndices(): Indices {
    return this.indices;
  }

  public setPrevType(type: TileEnum): void {
    this.prevType = type;
  }

  public getPrevType(): TileEnum {
    return this.prevType;
  }

  public addObstacle(type: ObstacleEnum): void {
    this.obstacleTypes.push(type);
  }

  public removeObstacle(obstacle: ObstacleEnum): void {
    this.obstacleTypes = this.obstacleTypes.filter((obs) => obs !== obstacle);
  }

  public getHighestPriorityObstacleType(): ObstacleEnum {
    let highestPriority: ObstacleEnum = ObstacleEnum.Empty;

    this.obstacleTypes.forEach((type) => {
      if (priorityList[type] > priorityList[highestPriority]) {
        highestPriority = type;
      }
    });

    return highestPriority;
  }

  public setType(type: TileEnum): void {
    this.type = type;
  }

  public getType(): TileEnum {
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

  public getBuilding(): Building | null {
    return this.building;
  }

  public setBuilding(building: Building | null): void {
    this.building = building;
  }

  public isWalkAble(): boolean {
    return [
      ObstacleEnum.Empty,
      ObstacleEnum.Decorated,
      ObstacleEnum.Occupied,
      ObstacleEnum.Border,
      // CellTypeEnum.Unit,
    ].includes(this.getHighestPriorityObstacleType());
  }

  public isBuildAble(): boolean {
    return (
      this.type === TileEnum.Grass &&
      this.getHighestPriorityObstacleType() === ObstacleEnum.Empty
    );
  }

  public equals(other: Cell) {
    return (
      this.indices.i === other.indices.i && this.indices.j === other.indices.j
    );
  }
}
