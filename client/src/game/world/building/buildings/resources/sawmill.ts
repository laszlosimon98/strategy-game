import { Building } from "@/game/world/building/building";
import type { BuildingActionInterface } from "@/interfaces/buildingActionInterface";
import type { EntityType } from "@/types/game.types";

export class Sawmill extends Building implements BuildingActionInterface {
  public constructor(building: EntityType) {
    super(building);
  }

  public action(): void {
    setTimeout(() => {
      console.log("stonecutter");
    }, 1000);
  }
}
