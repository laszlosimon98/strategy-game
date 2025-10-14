import { ProductionItem, StorageTypes } from "@/types/storage.types";

export class Production {
  private productionTime: number;
  private cooldownTime: number;
  private itemType: StorageTypes;
  private productionItem: ProductionItem;

  public constructor(
    productionTime: number,
    cooldownTime: number,
    itemType: StorageTypes,
    productionItem: ProductionItem
  ) {
    this.productionTime = productionTime;
    this.cooldownTime = cooldownTime;

    this.itemType = itemType;
    this.productionItem = productionItem;
  }

  public getProductionTime(): number {
    return this.productionTime;
  }

  public getCooldownTime(): number {
    return this.cooldownTime;
  }

  public getItemType(): StorageTypes {
    return this.itemType;
  }

  public getProductionItem(): ProductionItem {
    return this.productionItem;
  }

  public setProductionItem(item: ProductionItem): void {
    this.productionItem = item;
  }
}
