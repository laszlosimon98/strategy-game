import type { EntityType } from "@/types/state.types";
import { Entity } from "@/game/entities/entity";
import { Cell } from "@/game/cell";
import { getRandomElementFromArray } from "@/utils/utils";
import { Position } from "@/utils/position";

export class Unit extends Entity {
  private path: Cell[];
  private facing: string;
  private directions: Record<string, number>;

  public constructor(entity: EntityType) {
    super(entity);
    this.path = [];

    this.directions = this.initDirections();
    this.facing = getRandomElementFromArray<string>(
      Object.keys(this.directions)
    );
  }

  public calculateNewIdleFacing(): number {
    return this.directions[
      getRandomElementFromArray<string>(Object.keys(this.directions))
    ];
  }

  private initDirections(): Record<string, number> {
    const assetSize: number = 64;

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

    if (nextI < currentI && nextJ < currentJ) {
      this.facing = "UP";
    } else if (nextI === currentI && nextJ < currentJ) {
      this.facing = "UP_RIGHT";
    } else if (nextI > currentI && nextJ < currentJ) {
      this.facing = "RIGHT";
    } else if (nextI > currentI && nextJ === currentJ) {
      this.facing = "DOWN_RIGHT";
    } else if (nextI > currentI && nextJ > currentJ) {
      this.facing = "DOWN";
    } else if (nextI === currentI && nextJ > currentJ) {
      this.facing = "DOWN_LEFT";
    } else if (nextI < currentI && nextJ > currentJ) {
      this.facing = "LEFT";
    } else if (nextI < currentI && nextJ === currentJ) {
      this.facing = "UP_LEFT";
    }
  }

  private calculateCurrentAndNextPositions(): {
    currentPos: Position;
    nextPos: Position;
  } {
    const currentPos: Position = this.getPosition();
    const nextPos: Position = new Position(
      this.path[1].getUnitPos().x - 64 / 2,
      this.path[1].getUnitPos().y - 64
    );

    return {
      currentPos,
      nextPos,
    };
  }
}
