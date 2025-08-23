import { Indices } from '@/src/game/classes/indices';
import { units } from '@/src/game/data/data';
import { EntityType, Position, PropertyType } from '@/src/game/types/types';

export class Unit {
  private entity: EntityType;
  private properties: PropertyType;

  public constructor(entity: EntityType, name: string) {
    this.entity = entity;
    this.properties = {
      ...units[name],
    };
  }

  public getEntity(): EntityType {
    return this.entity;
  }

  public setIndices(newIndices: Indices): void {
    this.entity.data.indices = newIndices;
  }

  public getIndices(): Indices {
    return this.entity.data.indices;
  }

  public setPosition(position: Position): void {
    this.entity.data.position = position;
  }

  public getPosition(): Position {
    return this.entity.data.position;
  }

  public getDamage(): number {
    return this.properties.damage;
  }

  public getHealth(): number {
    return this.properties.health;
  }

  public getRange(): number {
    return this.properties.range;
  }

  /**
   * Csökkenti az egység életerejét a kapott sebzéssel
   * @param {number} damage kapott sebzés
   */
  public takeDamage(damage: number): void {
    this.properties.health -= damage;
  }

  /**
   *
   * @returns Megnézi, hogy az egység él-e
   */
  public isAlive(): boolean {
    return this.properties.health > 0;
  }
}
