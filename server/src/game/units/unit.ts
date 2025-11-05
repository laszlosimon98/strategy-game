import type { EntityType } from "@/types/state.types";
import { Entity } from "@/game/entities/entity";
import { Cell } from "@/game/cell";
import { getRandomElementFromArray } from "@/utils/utils";
import { Position } from "@/utils/position";
import { settings } from "@/settings";
import { Vector } from "@/utils/vector";
import { StateManager } from "@/manager/stateManager";
import { ObstacleEnum } from "@/enums/ObstacleEnum";
import { Indices } from "@/utils/indices";
import { Socket } from "socket.io";
import { PathFinder } from "@/game/pathFind/pathFinder";

export abstract class Unit extends Entity {
  private path: Cell[];
  private socket: Socket;
  private goal: Indices;

  public constructor(entity: EntityType, socket: Socket) {
    super(entity);
    this.path = [];
    this.socket = socket;
    this.goal = Indices.zero();
  }

  public setGoal(goal: Indices): void {
    this.goal = goal;
  }

  public getGoal(): Indices {
    return this.goal;
  }

  public calculatePath(): void {
    const current: Indices = this.getIndices();
    if (current.equal(this.goal)) return;

    const start: Indices =
      this.path.length > 0 ? this.path[0].getIndices() : current;
    const path: Indices[] = PathFinder.getPath(this.socket, start, this.goal);
    if (!path || path.length === 0) return;

    const world: Cell[][] = StateManager.getWorld(this.socket);
    this.path = path.map(({ i, j }) => world[i][j]);
  }

  public calculateNewIdleFacing(): void {
    this.entity.data.facing =
      StateManager.directions()[
        getRandomElementFromArray<string>(
          Object.keys(StateManager.directions())
        )
      ];
  }

  public setPath(path: Cell[]): void {
    this.path = path;
  }

  public isMoving(): boolean {
    return this.path.length > 0;
  }

  public move(dt: number): void {
    if (this.path.length <= 1) {
      this.reachedNextCell();
      return;
    }

    const { currentPos, nextPos } = this.calculateCurrentAndNextPositions();
    const facingIndex = StateManager.calculateFacing(
      this.path[0],
      this.path[1]
    );

    this.entity.data.facing = StateManager.directions()[facingIndex];

    const { x: startX, y: startY }: Position = currentPos;
    const { x: endX, y: endY }: Position = nextPos;

    let dirVector: Vector = new Vector(endX - startX, endY - startY);
    const distance = dirVector.magnitude();
    const maxMove = settings.unitSpeed * dt;
    let newPos: Position;

    if (distance > maxMove) {
      const moveVector: Vector = dirVector.normalize().mult(maxMove);
      newPos = currentPos.add(moveVector as Position);
    } else {
      newPos = nextPos;
      this.reachedNextCell();
      this.calculatePath();
    }

    this.setPosition(newPos);
  }

  private reachedNextCell(): void {
    const reachedCell: Cell | undefined = this.path.shift();
    this.updateIndices(reachedCell);
  }

  private updateIndices(currentCell: Cell | undefined): void {
    if (currentCell) {
      const { i, j }: Indices = this.entity.data.indices;

      const prevCell: Cell = StateManager.getWorld(this.socket)[i][j];
      prevCell.removeObstacle(ObstacleEnum.Unit);

      const prevSoldier = prevCell.getSoldier();
      prevCell.setSoldier(null);

      this.setIndices(currentCell.getIndices());
      currentCell.addObstacle(ObstacleEnum.Unit);
      currentCell.setSoldier(prevSoldier);
    }
  }

  private calculateCurrentAndNextPositions(): {
    currentPos: Position;
    nextPos: Position;
  } {
    const currentPos: Position = this.getPosition();
    const nextPos: Position = new Position(
      this.path[1].getUnitPos().x - settings.assetSize / 2,
      this.path[1].getUnitPos().y - settings.assetSize
    );

    return {
      currentPos,
      nextPos,
    };
  }
}
