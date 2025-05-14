import { ServerHandler } from "server/serverHandler";
import { UNIT_SIZE } from "@/game/settings";
import { Position } from "@/game/utils/position";
import { RangeIndicator } from "@/game/utils/rangeIndicator";
import { Timer } from "@/game/utils/timer";
import { Unit } from "@/game/world/unit/unit";
import { ctx } from "@/game/main";
import { SoldierPropertiesType, EntityType } from "services/types/gameTypes";
import { UnitStatus } from "@/game/enums/unitStatus";

export class Soldier extends Unit {
  protected properties: SoldierPropertiesType;

  protected attackTimer: Timer;
  private rangeIndicator: RangeIndicator;

  private opponent: Soldier | undefined;

  constructor(
    entity: EntityType,
    name: string,
    properties: SoldierPropertiesType
  ) {
    super(entity, name);
    this.properties = properties;

    this.attackTimer = new Timer(1500);
    this.attackTimer.activate();

    this.rangeIndicator = new RangeIndicator(this.properties.range);
  }

  public draw(): void {
    this.rangeIndicator.draw();
    super.draw();

    if (this.properties.health < 100) {
      this.drawHealthBar();
    }
  }

  public update(dt: number, cameraPos: Position): void {
    super.update(dt, cameraPos);
    this.attackTimer.update();

    this.rangeIndicator.update(
      new Position(
        this.renderPos.x + UNIT_SIZE.width / 2,
        this.renderPos.y + UNIT_SIZE.height - UNIT_SIZE.height / 4
      )
    );
    this.attack();
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

  private attack(): void {
    const opponent = this.getOpponent();
    if (this.getState() === UnitStatus.Attacking && opponent) {
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
    ctx.fillStyle = "#f00";
    ctx.fillRect(
      this.renderPos.x + this.image.width / 2 - 25,
      this.renderPos.y - 5,
      50,
      10
    );

    ctx.fillStyle = "#0f0";
    ctx.fillRect(
      this.renderPos.x + this.image.width / 2 - 25,
      this.renderPos.y - 5,
      Math.max(0, this.properties.health / 2),
      10
    );
    ctx.restore();
  }
}
