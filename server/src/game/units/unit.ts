import type { EntityType } from "@/types/state.types";
import { Entity } from "@/game/entities/entity";
import { Cell } from "@/game/cell";
import { getRandomElementFromArray } from "@/utils/utils";
import { Position } from "@/utils/position";
import { settings } from "@/settings";
import { Vector } from "@/utils/vector";

export class Unit extends Entity {
  private path: Cell[];
  private directions: Record<string, number>;

  public constructor(entity: EntityType) {
    super(entity);
    this.path = [];

    this.directions = this.initDirections();
  }

  public calculateNewIdleFacing(): void {
    this.entity.data.facing =
      this.directions[
        getRandomElementFromArray<string>(Object.keys(this.directions))
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
      this.calculateFacing(this.path[0], this.path[1]);

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
        this.path.shift();
        // this.updateIndices(this.path.shift());
      }
      this.setPosition(newPos);
    } else {
      this.path.shift();
      // this.updateIndices(this.path.shift());
    }
  }

  private updateIndices(cell: Cell | undefined): void {
    if (cell) {
      this.setIndices(cell.getIndices());
    }
  }

  private initDirections(): Record<string, number> {
    const assetSize: number = settings.assetSize;

    const result: Record<string, number> = {
      DOWN: assetSize * 0,
      DOWN_LEFT: assetSize * 1,
      LEFT: assetSize * 2,
      UP_LEFT: assetSize * 3,
      UP: assetSize * 4,
      UP_RIGHT: assetSize * 5,
      RIGHT: assetSize * 6,
      DOWN_RIGHT: assetSize * 7,
    };

    return result;
  }

  private calculateFacing(current: Cell, next: Cell): void {
    const { i: currentI, j: currentJ } = current.getIndices();
    const { i: nextI, j: nextJ } = next.getIndices();

    let facing: string = "";

    if (nextI < currentI && nextJ < currentJ) {
      facing = "UP";
    } else if (nextI === currentI && nextJ < currentJ) {
      facing = "UP_RIGHT";
    } else if (nextI > currentI && nextJ < currentJ) {
      facing = "RIGHT";
    } else if (nextI > currentI && nextJ === currentJ) {
      facing = "DOWN_RIGHT";
    } else if (nextI > currentI && nextJ > currentJ) {
      facing = "DOWN";
    } else if (nextI === currentI && nextJ > currentJ) {
      facing = "DOWN_LEFT";
    } else if (nextI < currentI && nextJ > currentJ) {
      facing = "LEFT";
    } else if (nextI < currentI && nextJ === currentJ) {
      facing = "UP_LEFT";
    }

    this.entity.data.facing = this.directions[facing];
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
