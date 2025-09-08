import { Indices } from "@/classes/utils/indices";
import { GameStateManager } from "@/manager/gameStateManager";
import type { Position } from "@/types/position.types";
import type { EntityType } from "@/types/state.types";
import type { PropertyType } from "@/types/units.types";

export class Unit {
  private entity: EntityType;
  private properties: PropertyType;

  public constructor(entity: EntityType, name: string) {
    this.entity = entity;
    this.properties = {
      ...GameStateManager.getUnitProperties()[name],
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

  public takeDamage(damage: number): void {
    this.properties.health -= damage;
  }

  public isAlive(): boolean {
    return this.properties.health > 0;
  }
}
