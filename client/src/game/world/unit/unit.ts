import { UnitStates } from "@/enums/unitsState";
import { Entity } from "@/game/world/entity";
import { ctx } from "@/init";
import { ServerHandler } from "@/server/serverHandler";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { Timer } from "@/utils/timer";
import { getRandomNumberFromInterval } from "@/utils/utils";

import type { EntityType } from "@/types/game.types";
import type { RendererInterface } from "@/interfaces/rendererInterface";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";

export abstract class Unit extends Entity implements RendererInterface {
  private dimension: Dimension;
  private facing: number;
  private unitState: UnitStates;
  private facingTimer: Timer;
  private checkSurroundingsTimer: Timer;
  private animationCounter: number;

  public constructor(entity: EntityType) {
    super(entity);

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

    this.checkSurroundingsTimer = new Timer(1000, () =>
      this.checkSurroundings()
    );

    this.facingTimer.activate();
    this.checkSurroundingsTimer.activate();
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
    }

    if (this.unitState === UnitStates.Idle) {
      if (this.facingTimer.isTimerActive()) {
        this.facingTimer.update();
      }
    }

    if (this.checkSurroundingsTimer.isTimerActive()) {
      this.checkSurroundingsTimer.update();
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

  public getState(): UnitStates {
    return this.unitState;
  }

  public setFacing(facing: number): void {
    this.facing = facing;
    this.facingTimer.activate();
  }

  public reset(): void {
    this.animationCounter = 0;
    this.setState(UnitStates.Idle);
  }

  private playAnimation(dt: number): void {
    this.animationCounter += settings.animation.speed * dt;

    if (this.animationCounter >= settings.animation.count - 1) {
      this.animationCounter = 0;
    }
  }

  private newFacingRequets(): void {
    ServerHandler.sendMessage("game:unit-idle-facing", { entity: this.entity });
  }

  private checkSurroundings(): void {
    ServerHandler.sendMessage("game:unit-check-sorroundings", {
      entity: this.entity,
    });
    this.checkSurroundingsTimer.activate();
  }
}
