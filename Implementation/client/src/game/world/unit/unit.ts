import { state } from "../../../data/state";
import { UnitStates } from "../../../enums/unitsState";
import { ctx } from "../../../init";
import { CallAble } from "../../../interfaces/callAble";
import { EntityType } from "../../../types/gameType";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { Timer } from "../../../utils/timer";
import { getRandomNumberFromInterval } from "../../../utils/utils";
import { Vector } from "../../../utils/vector";
import { Entity } from "../entity";
import { Tile } from "../tile";

const ANIMATION_COUNT: number = 8;
const UNIT_ASSET_SIZE: number = 64;
const UNIT_SPEED = 100;
const ANIMATION_SPEED = 8;

export class Unit extends Entity implements CallAble {
  private name: string;
  private path: Tile[];
  private dimension: Dimension;

  private state: UnitStates;

  private directions: Record<string, number>;
  private facing: string;

  private unitSpeed: number;
  private speedVector: Vector;

  private facingTimer: Timer;
  private moveTimer: Timer;

  // private range: number;
  private animationCounter: number;

  private isTileReach: boolean;
  private pathTaken: number;
  private percentPerSpeed: number;

  public constructor(entity: EntityType) {
    super(entity);
    this.name = "soldier";
    this.path = [];

    this.entity = {
      data: {
        ...entity.data,
        static:
          state.images.colors[state.game.players[entity.data.owner].color]
            .static.url,
      },
    };
    this.dimension = new Dimension(UNIT_ASSET_SIZE, UNIT_ASSET_SIZE);

    this.state = UnitStates.Idle;

    this.directions = this.initDirections();
    this.facing = this.randomFacing(Object.keys(this.directions));

    this.unitSpeed = UNIT_SPEED;
    this.speedVector = Vector.zero();

    this.animationCounter = 0;

    this.facingTimer = new Timer(getRandomNumberFromInterval(2000, 5000), () =>
      this.changeDirection()
    );
    this.facingTimer.activate();

    this.moveTimer = new Timer(500);

    this.isTileReach = true;
    this.pathTaken = 0;
    this.percentPerSpeed = 0;
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

    if (this.state !== UnitStates.Idle) {
      this.animate(dt);
    }

    if (this.state === UnitStates.Idle) {
      if (this.facingTimer.isTimerActive()) {
        this.facingTimer.update();
      } else {
        this.facingTimer.activate();
      }
    }

    if (this.state === UnitStates.Walking) {
      this.move(dt);
    }

    this.moveTimer.update();
  }

  public getName(): string {
    return this.name;
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

  public setState(newState: UnitStates): void {
    this.state = newState;

    const owner: string = this.entity.data.owner;
    const color: string = state.game.players[owner].color;

    const entity: EntityType = {
      data: {
        ...this.entity.data,
        url: state.images.colors[color][this.name + this.state].url,
      },
    };

    this.setEntity(entity);
    this.setImage(entity.data.url);
  }

  private animate(dt: number): void {
    this.animationCounter += ANIMATION_SPEED * dt;

    if (this.animationCounter >= ANIMATION_COUNT - 1) {
      this.animationCounter = 0;
    }
  }

  private randomFacing(arr: string[]): string {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  private changeDirection(): void {
    if (this.state === UnitStates.Idle) {
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
    let dirVector = Vector.zero();

    if (nextI < currentI && nextJ < currentJ) {
      facing = "UP";
      dirVector = new Vector(0, -1);
    } else if (nextI === currentI && nextJ < currentJ) {
      facing = "UP_RIGHT";
      dirVector = new Vector(1, -0.5);
    } else if (nextI > currentI && nextJ < currentJ) {
      facing = "RIGHT";
      dirVector = new Vector(1, 0);
    } else if (nextI > currentI && nextJ === currentJ) {
      facing = "DOWN_RIGHT";
      dirVector = new Vector(1, 0.5);
    } else if (nextI > currentI && nextJ > currentJ) {
      facing = "DOWN";
      dirVector = new Vector(0, 1);
    } else if (nextI === currentI && nextJ > currentJ) {
      facing = "DOWN_LEFT";
      dirVector = new Vector(-1, 0.5);
    } else if (nextI < currentI && nextJ > currentJ) {
      facing = "LEFT";
      dirVector = new Vector(-1, 0);
    } else if (nextI < currentI && nextJ === currentJ) {
      facing = "UP_LEFT";
      dirVector = new Vector(-1, -0.5);
    }

    this.speedVector = dirVector.mult(this.unitSpeed);

    return facing;
  }

  private calculateDistance(from: Position, to: Position): number {
    const x = to.x - from.x;
    const y = to.y - from.y;
    const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    return distance;
  }

  private reset(): void {
    this.animationCounter = 0;
    this.setState(UnitStates.Idle);
    this.path.shift();
  }

  private setNextTile(dt: number): void {
    if (this.path.length > 1) {
      const currentTile: Tile = this.path[0];
      const nextTile: Tile = this.path[1];

      this.facing = this.calculateFacing(currentTile, nextTile);

      const nextPos: Position = nextTile.getUnitPos();
      const actualNextPos: Position = new Position(
        nextPos.x - UNIT_ASSET_SIZE / 2,
        nextPos.y - UNIT_ASSET_SIZE
      );

      const distance = this.calculateDistance(
        this.getPosition(),
        actualNextPos
      );

      this.percentPerSpeed = distance / (UNIT_SPEED * dt);

      this.path.shift();
    } else if (this.path.length === 1) {
      this.reset();
    }
  }

  private move(dt: number): void {
    if (this.isTileReach) {
      this.setNextTile(dt);
      this.isTileReach = false;
      this.pathTaken = 0;
    }

    if (Math.min(100, this.pathTaken) < 100) {
      this.setPosition(this.getPosition().add(this.speedVector.mult(dt)));

      console.log(this.percentPerSpeed);
      this.pathTaken += this.percentPerSpeed;
    }
    if (Math.min(100, this.pathTaken) === 100) {
      // this.reset();
      this.isTileReach = true;
    }

    // if (this.path.length > 1) {
    //   const currentTile: Tile = this.path[0];
    //   const nextTile: Tile = this.path[1];

    //   this.facing = this.calculateFacing(currentTile, nextTile);

    //   const nextPos: Position = nextTile.getUnitPos();

    //   const actualNextPos: Position = new Position(
    //     nextPos.x - UNIT_ASSET_SIZE / 2,
    //     nextPos.y - UNIT_ASSET_SIZE
    //   );

    //   const distance = Math.max(
    //     0,
    //     this.calculateDistance(this.getPosition(), actualNextPos)
    //   );

    //   console.log(distance);

    //   if (distance > 0) {
    //     this.setPosition(this.getPosition().add(this.speedVector.mult(dt)));
    //   }

    //   if (distance === 0) {
    //     this.setPosition(actualNextPos);
    //     this.setIndices(nextTile.getIndices());

    //     this.reset();
    //   }
    // } else if (this.path.length === 1) {
    //   this.reset();
    // }

    // if (this.path.length > 1) {
    //   if (!this.moveTimer.isTimerActive()) {
    //     const currentTile: Tile = this.path.shift() as Tile;
    //     const nextTile: Tile = this.path[0];
    //     this.facing = this.calculateFacing(currentTile, nextTile);
    //     const nextPos: Position = nextTile.getUnitPos();
    //     const pos = new Position(
    //       nextPos.x - UNIT_ASSET_SIZE / 2,
    //       nextPos.y - UNIT_ASSET_SIZE
    //     );
    //     console.log(this.calculateDistance(this.getPosition(), pos));
    //     this.setPosition(pos);
    //     this.setIndices(nextTile.getIndices());
    //     this.moveTimer.activate();
    //   }
    // } else if (this.path.length === 1) {
    //   this.animationCounter = 0;
    //   this.setState(UnitStates.Idle);
    //   this.path.shift();
    // }
  }
}
