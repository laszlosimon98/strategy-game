import { Production } from "@/game/production";
import { Requirement } from "@/types/production.types";
import { ProductionItem } from "@/types/storage.types";

export interface ProductionBuildingInterface {
  readonly production: Production | null;
  getCooldown: () => number | null;
  getProductionTime: () => number | null;
  getRequirements: () => Requirement | null;
  getProductionItem: () => ProductionItem | null;
  hasRequirements: () => boolean;
}
