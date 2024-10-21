import { ctx } from "../../../init";
import { CallAble } from "../../../interfaces/callAble";
import { EntityType } from "../../../types/gameType";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { Timer } from "../../../utils/timer";
import { getRandomNumberFromInterval } from "../../../utils/utils";
import { Entity } from "../entity";
import { Tile } from "../tile";

enum UnitStates {
  Idle,
  Move,
  Attack,
}

const ANIMATION_COUNT: number = 8;
const UNIT_ASSET_SIZE: number = 64;

export class Unit extends Entity implements CallAble {
  private directions: Record<string, number>;
  private facing: string;

  private facingTimer: Timer;
  private moveTimer: Timer;

  private unitState: UnitStates;

  // private range: number;
  private animationCounter: number;
  private speed: number;
  private dimension: Dimension;

  private path: Tile[];

  public constructor(unit: EntityType) {
    super(unit);

    this.directions = this.initDirections();
    this.facing = this.randomFacing(Object.keys(this.directions));

    this.facingTimer = new Timer(getRandomNumberFromInterval(3000, 7000), () =>
      this.changeDirection()
    );

    this.moveTimer = new Timer(500);

    this.facingTimer.activate();

    this.unitState = UnitStates.Idle;

    this.animationCounter = 0;
    this.speed = 8;
    this.dimension = new Dimension(UNIT_ASSET_SIZE, UNIT_ASSET_SIZE);

    this.path = [];
  }

  private initDirections(): Record<string, number> {
    const result: Record<string, number> = {
      DOWN: 0,
      DOWN_LEFT: 64,
      LEFT: 128,
      UP_LEFT: 192,
      UP: 256,
      UP_RIGHT: 320,
      RIGHT: 384,
      DOWN_RIGHT: 448,
    };

    return result;
  }

  public draw(): void {
    ctx.drawImage(
      this.image,
      Math.floor(this.animationCounter) * UNIT_ASSET_SIZE,
      this.directions[this.facing],
      UNIT_ASSET_SIZE,
      UNIT_ASSET_SIZE,
      this.renderPos.x,
      this.renderPos.y,
      UNIT_ASSET_SIZE,
      UNIT_ASSET_SIZE
    );

    if (this.isHovered) {
      ctx.save();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        this.renderPos.x + this.image.width / 4,
        this.renderPos.y,
        this.image.width / 2,
        this.image.height
      );
      ctx.restore();
    }
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);

    if (this.unitState !== UnitStates.Idle) {
      this.animate(dt);
    }

    if (this.unitState === UnitStates.Idle) {
      if (this.facingTimer.isTimerActive()) {
        this.facingTimer.update();
      } else {
        this.facingTimer.activate();
      }
    }

    this.moveTimer.update();
  }

  public getName(): string {
    return "soldier";
  }

  public getDimension(): Dimension {
    return this.dimension;
  }

  public setFacing(facing: string): void {
    this.facing = facing;
  }

  public setPath(path: Tile[]): void {
    this.path = [...path];
  }

  private animate(dt: number): void {
    this.animationCounter += this.speed * dt;

    if (this.animationCounter >= ANIMATION_COUNT - 1) {
      this.animationCounter = 0;
    }
  }

  private randomFacing(arr: string[]): string {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  private changeDirection(): void {
    if (this.unitState === UnitStates.Idle) {
      const excludedKeys = Object.keys(this.directions).filter(
        (key) => key !== this.facing
      );
      const newFacing: string = this.randomFacing(excludedKeys);

      this.setFacing(newFacing);
    }
  }

  private calculateFacing(current: Tile, next: Tile): string {
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

    return facing;
  }

  public move(): void {
    if (this.path.length > 1) {
      if (!this.moveTimer.isTimerActive()) {
        const currentTile: Tile = this.path.shift() as Tile;
        const nextTile: Tile = this.path[0];

        this.facing = this.calculateFacing(currentTile, nextTile);

        const nextPos: Position = nextTile.getUnitPos();
        // let i = 5;

        // while (i > 0) {
        //   console.log(i);
        //   --i;
        // }

        const pos = new Position(
          nextPos.x - UNIT_ASSET_SIZE / 2,
          nextPos.y - UNIT_ASSET_SIZE
        );

        this.setPosition(pos);
        this.setIndices(nextTile.getIndices());

        this.moveTimer.activate();
      }
    }
  }
}
