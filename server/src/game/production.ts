import { ProductionItem, CategoryType } from "@/types/storage.types";

export class Production {
  private productionTime: number;
  private cooldownTime: number;
  private category: CategoryType;
  private productionItem: ProductionItem;

  public constructor(
    productionTime: number,
    cooldownTime: number,
    category: CategoryType,
    productionItem: ProductionItem
  ) {
    this.productionTime = productionTime;
    this.cooldownTime = cooldownTime;

    this.category = category;
    this.productionItem = productionItem;
  }

  public getProductionTime(): number {
    return this.productionTime;
  }

  public getCooldownTime(): number {
    return this.cooldownTime;
  }

  public getCategory(): CategoryType {
    return this.category;
  }

  public getProductionItem(): ProductionItem {
    return this.productionItem;
  }

  public setProductionItem(item: ProductionItem): void {
    this.productionItem = item;
  }
}
