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
  getRandomElementFromArray,
  getRandomNumberFromInterval,
} from "@/utils/utils";
import { Vector } from "@/utils/vector";

import type { EntityType } from "@/types/game.types";
import type { RendererInterface } from "@/interfaces/rendererInterface";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";

export abstract class Unit extends Entity implements RendererInterface {
  private path: Cell[];
  private dimension: Dimension;

  private unitState: UnitStates;

  private directions: Record<string, number>;
  private facing: string;

  private facingTimer: Timer;
  private animationCounter: number;

  public constructor(entity: EntityType) {
    super(entity);
    this.path = [];

    this.entity = {
      data: {
        ...entity.data,
        static: StateManager.getStaticImage(
          entity.data.owner,
          this.entity.data.name
        ).url,
      },
    };

    this.dimension = new Dimension(
      settings.size.unitAsset,
      settings.size.unitAsset
    );

    this.unitState = UnitStates.Idle;

    this.directions = this.initDirections();
    this.facing = getRandomElementFromArray<string>(
      Object.keys(this.directions)
    );

    this.animationCounter = 0;

    this.facingTimer = new Timer(getRandomNumberFromInterval(2000, 5000));
    this.facingTimer.activate();
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
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);

    if (this.unitState !== UnitStates.Idle) {
      this.playAnimation(dt);
    }

    if (this.unitState === UnitStates.Idle) {
      if (this.facingTimer.isTimerActive()) {
        this.facingTimer.update();
      } else {
        this.facingTimer.activate();
      }
    }

    if (this.unitState === UnitStates.Walking) {
      this.move(dt);
    }
  }

  public getDimension(): Dimension {
    return this.dimension;
  }

  public setUnitState(unitState: UnitStates): void {
    this.unitState = unitState;
  }

  public setPath(path: Cell[]): void {
    this.path = [...path];
  }

  private reset(): void {
    this.animationCounter = 0;
    this.setState(UnitStates.Idle);
    this.path = [];
  }

  private move(dt: number): void {
    if (this.path.length > 1) {
      // this.setNextFace();
      const { currentPos, nextPos } = this.calculateCurrentAndNextPositions();

      const { x: startX, y: startY }: Position = currentPos;
      const { x: endX, y: endY }: Position = nextPos;

      let dirVector: Vector = new Vector(endX - startX, endY - startY);
      const distance = dirVector.getDistance();
      const maxMove = settings.speed.unit * dt;
      let newPos: Position;

      if (distance > maxMove) {
        this.setNextCell();
        const moveVector: Vector = dirVector.normalize().mult(maxMove);
        newPos = this.getPosition().add(moveVector as Position);
      } else {
        newPos = nextPos;
        this.path.shift();
      }
      // ySort(StateManager.getSoldiers(ServerHandler.getId()));
    }
  }

  private initDirections(): Record<string, number> {
    const assetSize: number = settings.size.unitAsset;
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

  private playAnimation(dt: number): void {
    this.animationCounter += settings.animation.speed * dt;

    if (this.animationCounter >= settings.animation.count - 1) {
      this.animationCounter = 0;
    }
  }

  // private calculateFacing(current: Cell, next: Cell): void {
  //   const { i: currentI, j: currentJ } = current.getIndices();
  //   const { i: nextI, j: nextJ } = next.getIndices();

  //   if (nextI < currentI && nextJ < currentJ) {
  //     this.facing = "UP";
  //   } else if (nextI === currentI && nextJ < currentJ) {
  //     this.facing = "UP_RIGHT";
  //   } else if (nextI > currentI && nextJ < currentJ) {
  //     this.facing = "RIGHT";
  //   } else if (nextI > currentI && nextJ === currentJ) {
  //     this.facing = "DOWN_RIGHT";
  //   } else if (nextI > currentI && nextJ > currentJ) {
  //     this.facing = "DOWN";
  //   } else if (nextI === currentI && nextJ > currentJ) {
  //     this.facing = "DOWN_LEFT";
  //   } else if (nextI < currentI && nextJ > currentJ) {
  //     this.facing = "LEFT";
  //   } else if (nextI < currentI && nextJ === currentJ) {
  //     this.facing = "UP_LEFT";
  //   }
  // }

  private async setNextCell() {
    const currentCell: Cell = this.path[0];
    const nextCell: Cell = this.path[1];

    const indices: Indices = await ServerHandler.receiveAsyncMessage(
      "game:unitMoving"
    );

    this.setIndices(indices);
    // this.calculateFacing(currentCell, nextCell);
  }

  private calculateCurrentAndNextPositions(): {
    currentPos: Position;
    nextPos: Position;
  } {
    const currentPos: Position = this.getPosition();
    const nextPos: Position = new Position(
      this.path[1].getUnitPos().x - settings.size.unitAsset / 2,
      this.path[1].getUnitPos().y - settings.size.unitAsset
    );

    return {
      currentPos,
      nextPos,
    };
  }

  // private setNextFace(): void {
  //   const currentCell: Cell = this.path[0];
  //   const nextCell: Cell = this.path[1];
  //   this.calculateFacing(currentCell, nextCell);
  // }

  private setState(newState: UnitStates): void {
    this.unitState = newState;

    const name: string = this.entity.data.name;
    const owner: string = this.entity.data.owner;
    const color: string = StateManager.getPlayerColor(owner);

    const entity: EntityType = {
      data: {
        ...this.entity.data,
        url: StateManager.getImages("units", color, `${name}${this.unitState}`)
          .url,
      },
    };

    this.setEntity(entity);
    this.updateImage();
  }
}
