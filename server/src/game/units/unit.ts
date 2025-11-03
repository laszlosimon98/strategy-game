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

export class Unit extends Entity {
  private path: Cell[];
  private socket: Socket;

  public constructor(entity: EntityType, socket: Socket) {
    super(entity);
    this.path = [];
    this.socket = socket;
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
    if (this.path.length > 1) {
      const { currentPos, nextPos } = this.calculateCurrentAndNextPositions();
      this.entity.data.facing =
        StateManager.directions()[
          StateManager.calculateFacing(this.path[0], this.path[1])
        ];

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
      }
      this.setPosition(newPos);
    } else {
      this.reachedNextCell();
    }
  }

  private reachedNextCell(): void {
    const reachedCell: Cell | undefined = this.path.shift();
    this.updateIndices(reachedCell);
  }

  private updateIndices(nextCell: Cell | undefined): void {
    if (nextCell) {
      const { i, j }: Indices = this.entity.data.indices;
      const currentcell: Cell = StateManager.getWorld(this.socket)[i][j];
      currentcell.removeObstacle(ObstacleEnum.Unit);

      this.setIndices(nextCell.getIndices());
      nextCell.addObstacle(ObstacleEnum.Unit);
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
