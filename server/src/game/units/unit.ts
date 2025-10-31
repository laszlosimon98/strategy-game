import { Indices } from "@/utils/indices";
import { StateManager } from "@/manager/stateManager";
import type { Position } from "@/types/utils.types";
import type { EntityType } from "@/types/state.types";

export class Unit {
  private entity: EntityType;

  public constructor(entity: EntityType) {
    this.entity = entity;
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
}
