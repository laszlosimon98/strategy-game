import { EntityType, Position } from "../../types/types";
import { Indices } from "../utils/indices";

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
