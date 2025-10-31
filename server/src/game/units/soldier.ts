import { Unit } from "@/game/units/unit";
import { EntityType } from "@/types/state.types";
import { PropertyType } from "@/types/units.types";

export class Soldier extends Unit {
  protected damage: number;
  protected health: number;
  protected range: number;

  public constructor(entity: EntityType) {
    super(entity);
    this.damage = 0;
    this.health = 0;
    this.range = 0;
  }

  public getProperties(): PropertyType {
    const properties: PropertyType = {
      damage: this.damage,
      health: this.health,
      range: this.range,
    };

    return properties;
  }

  public takeDamage(damage: number): void {
    this.health -= damage;
  }

  public isAlive(): boolean {
    return this.health > 0;
  }
}
