import { Buildings } from "@/types/building.types";
import { ProductionAction, ProductionTimes } from "@/types/production.types";

export class ProductionManager {
  public static productionTimes: ProductionTimes = {
    bakery: { cooldown: 7000, production: 9000 },
    barracks: { cooldown: 0, production: 0 },
    farm: { cooldown: 6000, production: 8000 },
    forester: { cooldown: 8000, production: 6500 },
    guardhouse: { cooldown: 0, production: 0 },
    ironsmelter: { cooldown: 9000, production: 7000 },
    mill: { cooldown: 6000, production: 8500 },
    residence: { cooldown: 0, production: 0 },
    sawmill: { cooldown: 7000, production: 7500 },
    stonecutter: { cooldown: 8000, production: 7000 },
    storage: { cooldown: 0, production: 0 },
    toolsmith: { cooldown: 9500, production: 6500 },
    weaponsmith: { cooldown: 10000, production: 6000 },
    well: { cooldown: 5000, production: 7000 },
    woodcutter: { cooldown: 6000, production: 7500 },
  };
  private constructor() {}

  public static getBuildingProductionTime(
    buildingName: Buildings
  ): ProductionAction {
    return this.productionTimes[buildingName];
  }
}
