import { UnitStates } from "@/enums/unitsState";
import { Cell } from "@/game/world/cell";
import { Entity } from "@/game/world/entity";
import { ctx } from "@/init";
import { ServerHandler } from "@/server/serverHandler";
import { Dimension } from "@/utils/dimension";
import { Indices } from "@/utils/indices";
import { Position } from "@/utils/position";
import { Timer } from "@/utils/timer";
import {
  getRandomNumberFromInterval,
  removeElementFromArray,
  ySort,
} from "@/utils/utils";
import { Vector } from "@/utils/vector";

import type { EntityType } from "@/types/game.types";
import type { RendererInterface } from "@/interfaces/rendererInterface";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";

export abstract class Unit extends Entity implements RendererInterface {
  protected name: string;

  private path: Cell[];
  private dimension: Dimension;

  private prevState: UnitStates;
  private state: UnitStates;

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

    this.entity = {
      data: {
        ...entity.data,
        static: StateManager.getStaticImage(entity.data.owner, this.name),
      },
    };
    this.dimension = new Dimension(
      settings.size.unitAsset,
      settings.size.unitAsset
    );

    this.prevState = UnitStates.Idle;
    this.state = UnitStates.Idle;

    this.directions = this.initDirections();
    this.facing = this.randomFacing(Object.keys(this.directions));

    this.animationCounter = 0;

    this.facingTimer = new Timer(getRandomNumberFromInterval(2000, 5000), () =>
      this.changeDirection()
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
      Math.floor(this.animationCounter) * settings.size.unitAsset,
      this.directions[this.facing],
      settings.size.unitAsset,
      settings.size.unitAsset,
      this.renderPos.x,
      this.renderPos.y,
      settings.size.unitAsset,
      settings.size.unitAsset
    );

    // if (this.isHovered) {
    //   ctx.save();
    //   ctx.strokeStyle = StateManager.getPlayerColor(this.entity.data.owner);
    //   ctx.lineWidth = 2;
    //   ctx.strokeRect(
    //     this.renderPos.x + this.image.width / 4,
    //     this.renderPos.y,
    //     this.image.width / 2,
    //     this.image.height
    //   );
    //   ctx.restore();
    // }
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
  }

  public getPrevState(): UnitStates {
    return this.prevState;
  }

  public setPrevState(state: UnitStates): void {
    this.prevState = state;
  }

  public getState(): UnitStates {
    return this.state;
  }

  public setState(newState: UnitStates): void {
    this.state = newState;

    const owner: string = this.entity.data.owner;
    const color: string = StateManager.getPlayerColor(owner);

    const entity: EntityType = {
      data: {
        ...this.entity.data,
        url: StateManager.getImages("units", color, `${this.name}${this.state}`)
          .url,
      },
    };

    this.setEntity(entity);
    this.setImage(entity.data.url);
  }

  public getPath(): Cell[] {
    return this.path;
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
    this.animationCounter += settings.animation.speed * dt;

    if (this.animationCounter >= settings.animation.count - 1) {
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
    this.setState(UnitStates.Idle);
    this.path = [];

    const id: string = ServerHandler.getId();
    const movingUnits = StateManager.getMovingUnits(id);
    removeElementFromArray(
      movingUnits,
      StateManager.findSoldier(this.getEntity())
    );
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
      this.path[1].getUnitPos().x - settings.size.unitAsset / 2,
      this.path[1].getUnitPos().y - settings.size.unitAsset
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

      let dirVector: Vector = new Vector(endX - startX, endY - startY);
      const distance = dirVector.getDistance();
      const maxMove = settings.speed.unit * dt;
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
      ySort(StateManager.getSoldiers(ServerHandler.getId()));
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
