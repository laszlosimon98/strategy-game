import { EntityType } from "../../types/types";
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
}
