import { Buildings } from "@/types/building.types";
import {
  ProductionAction,
  ProductionTimes,
  Requirement,
  Requirements,
} from "@/types/production.types";

export class ProductionManager {
  private static productionTimes: ProductionTimes = {
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

  private static requirements: Requirements = {
    bakery: {
      primary: { type: "foods", name: "flour" },
      secondary: { type: "foods", name: "water" },
    },
    barracks: null,
    farm: null,
    forester: null,
    guardhouse: null,
    ironsmelter: {
      primary: { type: "ores", name: "coal" },
      secondary: { type: "ores", name: "iron_ore" },
    },
    mill: { primary: { type: "foods", name: "grain" } },
    residence: null,
    sawmill: { primary: { type: "materials", name: "boards" } },
    stonecutter: null,
    storage: null,
    toolsmith: {
      primary: { type: "ores", name: "coal" },
      secondary: { type: "metals", name: "iron" },
    },
    weaponsmith: {
      primary: { type: "ores", name: "coal" },
      secondary: { type: "metals", name: "iron" },
    },
    well: null,
    woodcutter: null,
  };

  private constructor() {}

  public static getBuildingProductionTime(
    buildingName: Buildings
  ): ProductionAction {
    return this.productionTimes[buildingName];
  }

  public static getBuildingRequirements(buildingName: Buildings): Requirement {
    return this.requirements[buildingName];
  }
}
