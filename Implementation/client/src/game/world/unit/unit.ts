import { ctx } from "../../../init";
import { CallAble } from "../../../interfaces/callAble";
import { EntityType } from "../../../types/gameType";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { Timer } from "../../../utils/timer";
import { getRandomNumberFromInterval } from "../../../utils/utils";
import { Entity } from "../entity";

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

  private unitState: UnitStates;

  // private range: number;
  private animationCounter: number;
  private speed: number;
  private dimension: Dimension;

  public constructor(unit: EntityType) {
    super(unit);
    this.directions = this.initDirections();
    this.facing = this.randomFacing(Object.keys(this.directions));

    this.facingTimer = new Timer(getRandomNumberFromInterval(3000, 7000), () =>
      this.changeDirection()
    );

    this.facingTimer.activate();

    this.unitState = UnitStates.Idle;

    this.animationCounter = 0;
    this.speed = 8;
    this.dimension = new Dimension(UNIT_ASSET_SIZE, UNIT_ASSET_SIZE);
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

    if (this.facingTimer.isTimerActive()) {
      this.facingTimer.update();
    } else {
      this.facingTimer.activate();
    }
  }

  public getDimension(): Dimension {
    return this.dimension;
  }

  public setFacing(facing: string): void {
    this.facing = facing;
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
}
