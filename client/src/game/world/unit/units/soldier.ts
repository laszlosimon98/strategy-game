import { UnitStates } from "@/enums/unitsState";
import { Unit } from "@/game/world/unit/unit";
import { StateManager } from "@/manager/stateManager";
import { ctx } from "@/init";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";
import type { SoldierPropertiesType, EntityType } from "@/types/game.types";
import { Position } from "@/utils/position";
import { RangeIndicator } from "@/utils/rangeIndicator";
import { Timer } from "@/utils/timer";

export class Soldier extends Unit {
  protected properties: SoldierPropertiesType;
  private unitHealth: number;

  protected attackTimer: Timer;
  private rangeIndicator: RangeIndicator;

  // private visionIndicator: RangeIndicator;

  private opponent: Soldier | undefined;

  constructor(
    entity: EntityType,
    name: string,
    properties: SoldierPropertiesType
  ) {
    super(entity, name);
    this.properties = properties;
    this.unitHealth = this.properties.health;

    this.attackTimer = new Timer(1500);
    this.attackTimer.activate();

    this.rangeIndicator = new RangeIndicator(
      new Position(
        this.renderPos.x + settings.size.unit.width / 2,
        this.renderPos.y +
          settings.size.unit.height -
          settings.size.unit.height / 4
      ),
      this.properties.range
    );

    // this.visionIndicator = new RangeIndicator(
    //   new Position(
    //     this.renderPos.x + settings.size.unit.width / 2,
    //     this.renderPos.y + settings.size.unit.height - settings.size.unit.height / 4
    //   ),
    //   Math.max(this.properties.range, 5),
    //   state.game.players[this.entity.data.owner].color
    // );
  }

  public draw(): void {
    this.rangeIndicator.draw();
    // this.visionIndicator.draw();
    super.draw();

    if (this.properties.health < this.unitHealth || this.isHovered) {
      this.drawHealthBar();
    }
  }

  public update(dt: number, cameraPos: Position): void {
    super.update(dt, cameraPos);
    this.attackTimer.update();

    this.rangeIndicator.update(
      new Position(
        this.renderPos.x + settings.size.unit.width / 2,
        this.renderPos.y +
          settings.size.unit.height -
          settings.size.unit.height / 4
      )
    );

    // this.visionIndicator.update(
    //   new Position(
    //     this.renderPos.x + settings.size.unit.width / 2,
    //     this.renderPos.y + settings.size.unit.height - settings.size.unit.height / 4
    //   )
    // );

    this.attack();
  }

  private attack(): void {
    const opponent = this.getOpponent();
    if (this.getState() === UnitStates.Attacking && opponent) {
      if (!this.attackTimer.isTimerActive()) {
        ServerHandler.sendMessage("game:unitDealDamage", {
          unit: this.getEntity(),
          opponent: opponent.getEntity(),
        });
        this.attackTimer.activate();
      }
    }
  }

  private drawHealthBar(): void {
    ctx.save();
    ctx.fillStyle = StateManager.getPlayerColor(this.entity.data.owner);
    ctx.fillRect(
      this.renderPos.x + this.image.width / 2 - this.unitHealth / 4,
      this.renderPos.y - 3,
      Math.max(0, this.properties.health / 2),
      7
    );
    ctx.restore();
  }

  public setHealth(health: number): void {
    this.properties.health = health;
  }

  public setOpponent(soldier: Soldier | undefined): void {
    this.opponent = soldier;
  }

  public getOpponent(): Soldier | undefined {
    return this.opponent;
  }

  public getRange(): number {
    return this.rangeIndicator.getRange();
  }
}
