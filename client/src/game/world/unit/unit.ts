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
  ySort,
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

  private currentCellPos: Position;
  private nextCellPos: Position;

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

    this.currentCellPos = Position.zero();
    this.nextCellPos = Position.zero();
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
      this.animate(dt);
    }

    if (this.unitState === UnitStates.Idle) {
      if (this.facingTimer.isTimerActive()) {
        this.facingTimer.update();
      } else {
        this.facingTimer.activate();
      }
    }
  }

  public setState(newState: UnitStates): void {
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

  public getDimension(): Dimension {
    return this.dimension;
  }

  public reset(): void {
    this.animationCounter = 0;
    this.setState(UnitStates.Idle);
    this.path = [];
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
      ySort(StateManager.getSoldiers(ServerHandler.getId()));
    } else {
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

  private animate(dt: number): void {
    this.animationCounter += settings.animation.speed * dt;

    if (this.animationCounter >= settings.animation.count - 1) {
      this.animationCounter = 0;
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

  private async setNextCell() {
    const currentCell: Cell = this.path[0];
    const nextCell: Cell = this.path[1];

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
}
