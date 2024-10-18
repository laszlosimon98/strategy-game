import { ctx } from "../../../init";
import { MouseIntersect } from "../../../interfaces/mouseIntersect";
import { RenderInterface } from "../../../interfaces/render";
import { UnitType } from "../../../types/gameType";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { Entity } from "../entity";

enum UnitStates {
  Idle,
  Move,
  Attack,
}

export enum Directions {
  DOWN = 0,
  DOWN_LEFT = 64,
  LEFT = 128,
  UP_LEFT = 192,
  UP = 256,
  UP_RIGHT = 320,
  RIGHT = 384,
  DOWN_RIGHT = 448,
}

const ANIMATION_COUNT: number = 8;
const UNIT_ASSET_SIZE: number = 64;

export class Unit extends Entity implements RenderInterface, MouseIntersect {
  // private range: number;
  private animationCounter: number;
  private direction: Directions;
  private speed: number;
  private dimension: Dimension;

  constructor(unit: UnitType) {
    super(unit);
    this.animationCounter = 0;
    this.direction = Directions.RIGHT;
    this.speed = 12;

    this.dimension = new Dimension(UNIT_ASSET_SIZE, UNIT_ASSET_SIZE);
  }

  draw(): void {
    ctx.drawImage(
      this.image,
      Math.floor(this.animationCounter) * UNIT_ASSET_SIZE,
      this.direction,
      UNIT_ASSET_SIZE,
      UNIT_ASSET_SIZE,
      this.renderPos.x,
      this.renderPos.y,
      UNIT_ASSET_SIZE,
      UNIT_ASSET_SIZE
    );
  }

  update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);

    this.updateAnimation(dt);
  }

  updateAnimation(dt: number): void {
    this.animationCounter += this.speed * dt;

    if (this.animationCounter >= ANIMATION_COUNT - 1) {
      this.animationCounter = 0;
    }
  }

  public getDimension(): Dimension {
    return this.dimension;
  }
}
