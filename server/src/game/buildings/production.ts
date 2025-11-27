import { ProductionItem, CategoryType } from "@/types/storage.types";

/**
 * Egy épület termelési beállításait tárolja: termelési idő, pihenési idő
 * a termelés kategóriája és maga a termelt tétel.
 * Alapvető getter és setter metódusokkal
 */
export class Production {
  private productionTime: number;
  private cooldownTime: number;
  private category: CategoryType | "";
  private productionItem: ProductionItem | "";

  public constructor(
    productionTime: number,
    cooldownTime: number,
    category: CategoryType | "",
    productionItem: ProductionItem | ""
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

  public getCategory(): CategoryType | null {
    return this.category === "" ? null : this.category;
  }

  public getProductionItem(): ProductionItem | null {
    return this.productionItem === "" ? null : this.productionItem;
  }

  public setProductionItem(item: ProductionItem): void {
    this.productionItem = item;
  }
}
