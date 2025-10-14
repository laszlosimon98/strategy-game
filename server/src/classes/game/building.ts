import { Production } from "@/classes/game/production";
import { ProductionBuildingInterface } from "@/interfaces/ProductionBuildingInterface";
import { Requirement } from "@/types/production.types";
import type { EntityType } from "@/types/state.types";
import { StorageTypes, ProductionItem } from "@/types/storage.types";

export class Building implements ProductionBuildingInterface {
  private entity: EntityType;
  production: Production | null = null;

  public constructor(entity: EntityType) {
    this.entity = entity;
  }

  public getEntity(): EntityType {
    return this.entity;
  }

  public setOwner(newOwner: string): void {
    this.entity.data.owner = newOwner;
  }

  public getCooldown(): number | null {
    if (this.production === null) return null;
    return this.production.getCooldownTime();
  }

  public getProductionTime(): number | null {
    if (this.production === null) return null;
    return this.production.getProductionTime();
  }

  public getRequirements(): Requirement | null {
    return null;
  }

  public hasRequirements(): boolean {
    return this.getRequirements() !== null;
  }

  public getItemType(): StorageTypes | null {
    if (this.production === null) return null;
    return this.production.getItemType();
  }

  public getProductionItem(): ProductionItem | null {
    if (this.production === null) return null;
    return this.production.getProductionItem();
  }

  public isProductionBuilding(): boolean {
    return this.production !== null;
  }
}
