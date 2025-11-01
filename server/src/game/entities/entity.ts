import { Position } from "@/utils/position";
import { EntityType } from "@/types/state.types";
import { Indices } from "@/utils/indices";

export abstract class Entity {
  protected entity: EntityType;

  protected constructor(entity: EntityType) {
    this.entity = entity;
  }

  public setOwner(newOwner: string): void {
    this.entity.data.owner = newOwner;
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
