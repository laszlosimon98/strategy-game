import { CallAble } from "@/game/interfaces/callAble";
import { ctx } from "@/game/main";
import { Dimension } from "@/game/utils/dimension";
import { Indices } from "@/game/utils/indices";
import { Position } from "@/game/utils/position";
import { Timer } from "@/game/utils/timer";
import {
  getRandomNumberFromInterval,
  findUnit,
  ySort,
} from "@/game/utils/utils";
import { Vector } from "@/game/utils/vector";
import { Cell } from "@/game/world/cell";
import { Entity } from "@/game/world/entity";
import { UnitStatus } from "@/game/enums/unitStatus";
import { ServerHandler } from "@/server/serverHandler";
import { EntityType } from "@/services/types/gameTypes";
import { imagesFromState, playersFromState } from "@/game/data/state";
import { dispatch } from "@/services/store";
import { removeMovingUnit } from "@/services/slices/gameSlice";

const ANIMATION_COUNT: number = 8;
const UNIT_ASSET_SIZE: number = 64;
const UNIT_SPEED = 80;
const ANIMATION_SPEED = 8;

export abstract class Unit extends Entity implements CallAble {
  protected name: string;

  private path: Cell[];
  private dimension: Dimension;

  private prevState: UnitStatus;
  private state: UnitStatus;

  private directions: Record<string, number>;
  private facing: string;

  private facingTimer: Timer;
  private animationCounter: number;

  private currentCellPos: Position;
  private nextCellPos: Position;

  public constructor(entity: EntityType, name: string) {
    super(entity);
    this.name = name;
    this.path = [];

    // FIXME: valszeg nem jó
    this.entity = {
      data: {
        ...entity.data,
        static:
          imagesFromState.colors[playersFromState[entity.data.owner].color][
            this.name + "static"
          ].url,
      },
    };
    this.dimension = new Dimension(UNIT_ASSET_SIZE, UNIT_ASSET_SIZE);

    this.prevState = UnitStatus.Idle;
    this.state = UnitStatus.Idle;

    this.directions = this.initDirections();
    this.facing = this.randomFacing(Object.keys(this.directions));

    this.animationCounter = 0;

    this.facingTimer = new Timer(
      getRandomNumberFromInterval(2000, 5000),
      this.changeDirection
    );
    this.facingTimer.activate();

    this.currentCellPos = Position.zero();
    this.nextCellPos = Position.zero();
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

    if (this.state !== UnitStatus.Idle) {
      this.animate(dt);
    }

    if (this.state === UnitStatus.Idle) {
      if (this.facingTimer.isTimerActive()) {
        this.facingTimer.update();
      } else {
        this.facingTimer.activate();
      }
    }
  }

  public getPrevState(): UnitStatus {
    return this.prevState;
  }

  public setPrevState(state: UnitStatus): void {
    this.prevState = state;
  }

  public getState(): UnitStatus {
    return this.state;
  }

  public setState(newState: UnitStatus): void {
    this.state = newState;

    const owner: string = this.entity.data.owner;
    const color: string = playersFromState[owner].color;

    const entity: EntityType = {
      data: {
        ...this.entity.data,
        url: imagesFromState.colors[color][this.name + this.state].url,
      },
    };

    this.setEntity(entity);
    this.setImage(entity.data.url);
  }

  public getPath(): Cell[] {
    return this.path;
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

  public setPath(path: Cell[]): void {
    this.path = [...path];
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
    if (this.state === UnitStatus.Idle) {
      const excludedKeys = Object.keys(this.directions).filter(
        (key) => key !== this.facing
      );
      const newFacing: string = this.randomFacing(excludedKeys);

      this.setFacing(newFacing);
    }
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

  public resetAnimation(): void {
    this.animationCounter = 0;
  }

  public reset(): void {
    this.animationCounter = 0;
    this.setState(UnitStatus.Idle);
    this.path = [];

    const movingUnit = findUnit(this.getEntity());
    if (movingUnit) {
      dispatch(
        removeMovingUnit({
          id: ServerHandler.getId(),
          removingUnit: movingUnit,
        })
      );
    }
  }

  private async setNextCell() {
    const currentCell: Cell = this.path[0];
    const nextCell: Cell = this.path[1];
    const goal: Cell = this.path[this.path.length - 1];

    this.sendMovingRequest(nextCell.getIndices(), goal.getIndices());
    const indices: Indices = await ServerHandler.receiveAsyncMessage(
      "game:unitMoving"
    );

    this.setIndices(indices);
    this.calculateFacing(currentCell, nextCell);
  }

  private initCells(): void {
    this.currentCellPos = this.getPosition();
    this.nextCellPos = new Position(
      this.path[1].getUnitPos().x - UNIT_ASSET_SIZE / 2,
      this.path[1].getUnitPos().y - UNIT_ASSET_SIZE
    );
  }

  private setNextFace(): void {
    const currentCell: Cell = this.path[0];
    const nextCell: Cell = this.path[1];
    this.calculateFacing(currentCell, nextCell);
  }

  public move(dt: number): void {
    if (this.path.length > 1) {
      this.setNextFace();
      this.initCells();

      const { x: startX, y: startY }: Position = this.currentCellPos;
      const { x: endX, y: endY }: Position = this.nextCellPos;

      const dirVector: Vector = new Vector(endX - startX, endY - startY);
      const distance = dirVector.getDistance();
      const maxMove = UNIT_SPEED * dt;
      let newPos: Position;

      if (distance > maxMove) {
        this.setNextCell();
        const moveVector: Vector = dirVector.normalize().mult(maxMove);
        newPos = this.getPosition().add(moveVector as Position);
      } else {
        newPos = this.nextCellPos;
        this.path.shift();
      }
      this.sendUpdatePositionRequest(this.entity, newPos, this.facing);
      // ySort(playersFromState[ServerHandler.getId()].units);
    } else {
      this.sendDestinationReachedRequest(this.entity);
    }
  }

  private sendDestinationReachedRequest(entity: EntityType): void {
    ServerHandler.sendMessage("game:unitDestinationReached", entity);
  }

  private sendMovingRequest(next: Indices, goal: Indices): void {
    ServerHandler.sendMessage("game:unitMoving", {
      entity: this.entity,
      next,
      goal,
    });
  }

  private sendUpdatePositionRequest(
    entity: EntityType,
    newPos: Position,
    direction: string
  ): void {
    ServerHandler.sendMessage("game:unitUpdatePosition", {
      entity,
      newPos,
      direction,
    });
  }
}
