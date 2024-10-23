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
const UNIT_SPEED = 80;
const ANIMATION_SPEED = 8;

export abstract class Unit extends Entity implements CallAble {
  protected name: string;

  private path: Tile[];
  private dimension: Dimension;

  private state: UnitStates;

  private directions: Record<string, number>;
  private facing: string;

  private unitSpeed: number;
  private speedVector: Vector;

  private facingTimer: Timer;
  private animationCounter: number;

  private isTileReach: boolean;
  private distanceVector: Vector;
  private distanceBetweenTwoTile: number;

  public constructor(entity: EntityType, name: string) {
    super(entity);
    this.name = name;
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

    this.isTileReach = true;
    this.distanceVector = Vector.zero();
    this.distanceBetweenTwoTile = 0;
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

  public setTileReached(state: boolean): void {
    this.isTileReach = state;
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

  private calculateFacing(current: Tile, next: Tile): void {
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

    this.facing = facing;
    this.speedVector = dirVector.normalize().mult(this.unitSpeed);
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
    this.path = [];
    this.isTileReach = true;
  }

  private setNextTile(): void {
    if (this.path.length > 1) {
      const currentTile: Tile = this.path[0];
      const nextTile: Tile = this.path[1];
      this.setIndices(nextTile.getIndices());

      this.calculateFacing(currentTile, nextTile);

      const nextPos: Position = nextTile.getUnitPos();

      const actualNextPos: Position = new Position(
        nextPos.x - UNIT_ASSET_SIZE / 2,
        nextPos.y - UNIT_ASSET_SIZE
      );

      this.distanceBetweenTwoTile = this.calculateDistance(
        this.getPosition(),
        actualNextPos
      );

      this.path.shift();
    } else if (this.path.length === 1) {
      const tile: Tile = this.path.shift() as Tile;
      this.setIndices(tile.getIndices());
      this.reset();
    }
  }

  private move(dt: number): void {
    if (this.isTileReach) {
      this.isTileReach = false;
      this.distanceVector = Vector.zero();
      this.setNextTile();
    }
    const speed: Vector = this.speedVector.mult(dt);
    this.distanceVector = this.distanceVector.add(speed) as Vector;

    if (
      Math.abs(this.distanceVector.x) < this.distanceBetweenTwoTile &&
      Math.abs(this.distanceVector.y) < this.distanceBetweenTwoTile
    ) {
      this.setPosition(this.getPosition().add(speed));
    } else {
      this.isTileReach = true;
    }
  }
}
