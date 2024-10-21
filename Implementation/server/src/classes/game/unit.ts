import { EntityType } from "../../types/types";

export class Unit {
  private entity: EntityType;

  public constructor(entity: EntityType) {
    this.entity = entity;
  }

  public getEntity(): EntityType {
    return this.entity;
  }

  public setOwner(newOwner: string): void {
    this.entity.data.owner = newOwner;
  }
}
