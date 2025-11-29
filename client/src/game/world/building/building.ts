import { Flag } from "@/game/world/building/flag";
import { Entity } from "@/game/world/entity";
import { ctx } from "@/init";
import type { RendererInterface } from "@/interfaces/rendererInterface";
import { StateManager } from "@/manager/stateManager";
import { CommunicationHandler } from "@/communication/communicationHandler";
import type { EntityType } from "@/types/game.types";
import { Position } from "@/utils/position";
import { Timer } from "@/utils/timer";

/**
 * Épület osztály, származik az `Entity` osztályból
 */
export class Building extends Entity implements RendererInterface {
  private flagEntity: EntityType | undefined;
  private flag: Flag | undefined;

  private productionTimer: Timer | null = null;
  private cooldownTimer: Timer | null = null;

  // Milyen időközönként ellenőrzi, hogy van-e közelben ellenség
  private occupationCheckTimer: Timer | null = null;

  // Meddig tart a foglalás
  private occupationTimer: Timer | null = null;

  private enemyOwner: string = "";

  public constructor(entity: EntityType, hasFlag: boolean = true) {
    super(entity);

    if (entity.data.isProductionBuilding) {
      this.productionTimer = new Timer(entity.data.productionTime, () =>
        this.action()
      );

      this.cooldownTimer = new Timer(entity.data.cooldownTimer, () =>
        this.cooldown()
      );

      this.cooldownTimer.activate();
    }

    if (entity.data.name === "guardhouse") {
      this.occupationCheckTimer = new Timer(500, () => this.action());
      this.occupationCheckTimer.activate();

      this.occupationTimer = new Timer(5000, () => this.occupationTimerOver());
    }

    if (hasFlag) {
      this.flagEntity = {
        data: {
          ...StateManager.getFlag(entity),
          indices: {
            ...entity.data.indices,
            i: entity.data.indices.i + 1,
          },
          owner: entity.data.owner,
          position: entity.data.position,
        },
      };

      this.flag = new Flag(this.flagEntity);
    }
  }

  public draw(): void {
    super.draw();

    if (this.isHovered) {
      ctx.save();
      ctx.strokeStyle = StateManager.getPlayerColor(this.entity.data.owner);
      ctx.lineWidth = 2;
      ctx.strokeRect(
        this.renderPos.x,
        this.renderPos.y,
        this.image.width,
        this.image.height
      );
      ctx.restore();
    }
    this.flag?.draw();
  }

  public update(dt: number, cameraScroll: Position): void {
    super.update(dt, cameraScroll);
    this.flag?.update(dt, cameraScroll);

    if (this.productionTimer?.isTimerActive()) {
      this.productionTimer.update();
    }

    if (this.cooldownTimer?.isTimerActive()) {
      this.cooldownTimer.update();
    }

    if (this.occupationCheckTimer?.isTimerActive()) {
      this.occupationCheckTimer.update();
    }

    if (this.occupationTimer?.isTimerActive()) {
      this.occupationTimer.update();
    }
  }

  public setPosition(pos: Position): void {
    super.setPosition(pos);

    if (this.flag) {
      const flagPosition: Position = new Position(
        this.entity.data.position.x -
          this.flag.getDimension().width / 2 -
          15 +
          this.getDimension().width,
        this.entity.data.position.y -
          this.flag.getDimension().height -
          5 +
          this.getDimension().height
      );
      this.flag.setPosition(flagPosition);
    }
  }

  public setBuilding(building: EntityType) {
    this.entity.data = { ...building.data };
    this.image.src = this.entity.data.url;
  }

  /**
   * Ha termelő épület, akkor elküld a szervernek egy requestet, ami jelzi, hogy készen áll a termelésre.
   * Ha őrtorony típusú, akkor ellenőrzést küld, hogy nincs-e a közelben ellenséges katona, aki foglalni akarja.
   */
  public action(): void {
    if (this.entity.data.owner === CommunicationHandler.getId()) {
      if (this.entity.data.isProductionBuilding) {
        this.sendProductionRequest();
      }

      if (this.entity.data.name === "guardhouse") {
        this.sendCheckRequest();
      }
    }
  }

  /**
   * Letelt a foglalás. Őrtorony elfoglalva üzenetcsomag küldése a szervernek.
   */
  public occupationTimerOver(): void {
    if (this.enemyOwner === CommunicationHandler.getId()) {
      CommunicationHandler.sendMessage("game:guardhouse-occupied", {
        entity: this.entity,
      });
    }
  }

  public cooldown(): void {
    this.productionTimer?.activate();
  }

  /**
   * Megkezdődött a foglalás, időzítő elinditása.
   * @param enemyOwner ellenséges őrtorony tulajdonosa
   */
  public startOccupation(enemyOwner: string): void {
    this.enemyOwner = enemyOwner;
    if (!this.occupationTimer?.isTimerActive()) {
      this.occupationTimer?.activate();
    }
  }

  public stopOccupation(): void {
    this.occupationTimer?.deactivate();
  }

  private sendProductionRequest(): void {
    CommunicationHandler.sendMessage("game:production", {
      entity: this.entity,
    });
    this.cooldownTimer?.activate();
  }

  private sendCheckRequest(): void {
    CommunicationHandler.sendMessage("game:guardhouse-check", {
      entity: this.entity,
    });
    this.occupationCheckTimer?.activate();
  }
}
