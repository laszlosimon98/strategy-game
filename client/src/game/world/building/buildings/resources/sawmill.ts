import { Building } from "@/game/world/building/building";
import { BuildingActionInterface } from "@/interfaces/buildingAction";
import { EntityType } from "@/types/gameType";

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
