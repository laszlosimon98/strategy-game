import { EntityType } from "@/types/state.types";

export class Building {
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
