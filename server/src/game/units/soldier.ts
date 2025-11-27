import { Unit } from "@/game/units/unit";
import { settings, EPSILON } from "@/settings";
import { EntityType } from "@/types/state.types";
import { PropertyType } from "@/types/units.types";
import { calculateDistance } from "@/utils/utils";
import { Socket } from "socket.io";

/**
 * Irányítható katonák osztálya
 */
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

  /**
   * Visszaadja a katona tulajdonságait
   * @returns objektum: `damage`: sebzés mértéke, `health`: katona életereje, `range`: hatótávolság
   */
  public getProperties(): PropertyType {
    const properties: PropertyType = {
      damage: this.damage,
      health: this.health,
      range: this.range,
    };

    return properties;
  }

  /**
   * Csökkenti a katona életerejét
   * @param damage sebzés mértéke
   */
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

  /**
   * Megkeresi azt a katonát, amelyik bent van a hatótávolságban.
   * @param enemySoldiers ellenséges katonák tömbje
   * @returns Ha talál, akkor visszadja azt a katonát ami a hatótávon belül van, különben null
   */
  public getEnemySoldierInRange(enemySoldiers: Soldier[]): Soldier | null {
    for (let i = 0; i < enemySoldiers.length; ++i) {
      const enemy = enemySoldiers[i];
      if (enemy && enemy.isAlive() && this.isTargetInRange(enemy)) {
        return enemy;
      }
    }

    return null;
  }

  /**
   * Kiszámolja a katona és a célpont közötti távolságot
   * @param target a célpont
   * @returns
   */
  public isTargetInRange(target: Soldier): boolean {
    const distance = Math.floor(
      calculateDistance(this.getPosition(), target.getPosition())
    );

    return distance < this.getProperties().range * settings.cellSize + EPSILON;
  }

  public dealDamage(target: Soldier): void {
    target.takeDamage(this.damage);
  }
}
