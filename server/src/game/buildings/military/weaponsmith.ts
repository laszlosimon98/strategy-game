import { Building } from "@/game/building";
import { Production } from "@/game/production";
import { Requirement } from "@/types/production.types";
import { EntityType } from "@/types/state.types";
import { ProductionItem } from "@/types/storage.types";

export class WeaponSmith extends Building {
  private counter: number;
  private productionList: Record<number, string> = {
    0: "sword",
    1: "shield",
    2: "bow",
  };

  public constructor(building: EntityType) {
    super(building);

    this.counter = 0;
    this.production = new Production(
      6000,
      10000,
      "weapons",
      this.productionList[this.counter % 3] as ProductionItem
    );
  }

  public getRequirements(): Requirement | null {
    return {
      primary: { type: "ores", name: "coal" },
      secondary: { type: "metals", name: "iron" },
    };
  }

  public getProductionItem(): ProductionItem | null {
    if (this.production === null) return null;
    this.counter++;
    const currentItem: ProductionItem = this.production.getProductionItem();
    const nextItem: ProductionItem = this.productionList[
      this.counter % 3
    ] as ProductionItem;

    this.production.setProductionItem(nextItem);
    return currentItem;
  }
}
