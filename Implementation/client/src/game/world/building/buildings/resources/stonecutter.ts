import { BuildingActionInterface } from "@/game/interfaces/buildingAction";
import { EntityType } from "@/game/types/gameType";
import { Building } from "@/game/world/building/building";

export class Stonecutter extends Building implements BuildingActionInterface {
  public constructor(building: EntityType) {
    super(building);
  }

  public action(): void {
    setTimeout(() => {
      console.log("stonecutter");
    }, 1000);
  }
}
