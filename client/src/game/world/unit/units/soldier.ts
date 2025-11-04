import { Unit } from "@/game/world/unit/unit";
import { StateManager } from "@/manager/stateManager";
import { ctx } from "@/init";
import { settings } from "@/settings";
import type { SoldierPropertyType, EntityType } from "@/types/game.types";
import { Position } from "@/utils/position";
import { RangeIndicator } from "@/utils/rangeIndicator";

export class Soldier extends Unit {
  protected properties: SoldierPropertyType;
  // protected attackTimer: Timer;

  private unitStartHealth: number;
  private rangeIndicator: RangeIndicator;

  constructor(entity: EntityType, properties: SoldierPropertyType) {
    super(entity);
    this.properties = properties;
    this.unitStartHealth = this.properties.health;

    // this.attackTimer = new Timer(1500, () => this.attack());
    // this.attackTimer.activate();

    this.rangeIndicator = new RangeIndicator(this.properties.range);
  }

  public draw(): void {
    if (
      StateManager.getInfoPanelData()?.getEntity().data.id ===
      this.entity.data.id
    ) {
      this.rangeIndicator.draw();
    }
    super.draw();

    if (this.properties.health < this.unitStartHealth || this.isHovered) {
      this.drawHealthBar();
    }
  }

  public update(dt: number, cameraPos: Position): void {
    super.update(dt, cameraPos);
    // this.attackTimer.update();

    this.rangeIndicator.update(
      new Position(
        this.renderPos.x + settings.size.unit.width / 2,
        this.renderPos.y +
          settings.size.unit.height -
          settings.size.unit.height / 4
      )
    );
  }

  public getHealth(): number {
    return this.properties.health;
  }

  public getCurrentHealth(): number {
    return this.unitStartHealth;
  }

  public setHealth(health: number): void {
    this.properties.health = health;
  }

  private drawHealthBar(): void {
    ctx.save();
    ctx.fillStyle = StateManager.getPlayerColor(this.entity.data.owner);
    ctx.fillRect(
      this.renderPos.x + this.image.width / 2 - this.unitStartHealth / 4,
      this.renderPos.y - 3,
      Math.max(0, this.properties.health / 2),
      7
    );
    ctx.restore();
  }
}
