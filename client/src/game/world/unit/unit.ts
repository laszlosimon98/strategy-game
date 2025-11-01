import { UnitStates } from "@/enums/unitsState";
import { Cell } from "@/game/world/cell";
import { Entity } from "@/game/world/entity";
import { ctx } from "@/init";
import { ServerHandler } from "@/server/serverHandler";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { Timer } from "@/utils/timer";
import { getRandomNumberFromInterval } from "@/utils/utils";
import { Vector } from "@/utils/vector";

import type { EntityType } from "@/types/game.types";
import type { RendererInterface } from "@/interfaces/rendererInterface";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";

export abstract class Unit extends Entity implements RendererInterface {
  private path: Cell[];
  private dimension: Dimension;
  private facing: number;
  private unitState: UnitStates;
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
    this.animationCounter = 0;
    this.facing = 0;

    this.facingTimer = new Timer(getRandomNumberFromInterval(2000, 5000), () =>
      this.newFacingRequets()
    );
    this.facingTimer.activate();
  }

  public draw(): void {
    ctx.drawImage(
      this.image,
      Math.floor(this.animationCounter) * settings.size.unitAsset,
      this.facing,
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

      if (this.unitState === UnitStates.Walking) {
        this.move(dt);
      }
    }

    if (this.unitState === UnitStates.Idle) {
      if (this.facingTimer.isTimerActive()) {
        this.facingTimer.update();
      }
    }
  }

  public getDimension(): Dimension {
    return this.dimension;
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

  public setPath(path: Cell[]): void {
    this.path = path;
  }

  public setFacing(facing: number): void {
    this.facing = facing;
    this.facingTimer.activate();
  }

  private reset(): void {
    this.animationCounter = 0;
    this.setState(UnitStates.Idle);
    this.path = [];
  }

  private move(dt: number): void {
    if (this.path.length > 1) {
      const { currentPos, nextPos } = this.calculateCurrentAndNextPositions();

      const { x: startX, y: startY }: Position = currentPos;
      const { x: endX, y: endY }: Position = nextPos;

      let dirVector: Vector = new Vector(endX - startX, endY - startY);
      const distance = dirVector.magnitude();
      const maxMove = settings.speed.unit * dt;
      let newPos: Position;

      if (distance > maxMove) {
        const moveVector: Vector = dirVector.normalize().mult(maxMove);
        newPos = this.getPosition().add(moveVector as Position);
      } else {
        newPos = nextPos;
        this.path.shift();
      }

      this.setPosition(newPos);
      // ySort(StateManager.getSoldiers(ServerHandler.getId()));
    } else {
      this.reset();
    }
  }
  private playAnimation(dt: number): void {
    this.animationCounter += settings.animation.speed * dt;

    if (this.animationCounter >= settings.animation.count - 1) {
      this.animationCounter = 0;
    }
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

  private newFacingRequets(): void {
    ServerHandler.sendMessage("game:unit-idle-facing", { entity: this.entity });
  }
}
