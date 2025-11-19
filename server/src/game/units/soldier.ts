import { Unit } from "@/game/units/unit";
import { EntityType } from "@/types/state.types";
import { PropertyType } from "@/types/units.types";
import { Socket } from "socket.io";

export class Soldier extends Unit {
  protected damage: number;
  protected health: number;
  protected range: number;
  protected target: Soldier | null;

  public constructor(entity: EntityType, socket: Socket) {
    super(entity, socket);
    this.damage = 0;
    this.health = 0;
    this.range = 0;

    this.target = null;
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

  public setTarget(target: Soldier | null): void {
    this.target = target;
  }

  public getTarget(): Soldier | null {
    return this.target;
  }
}
