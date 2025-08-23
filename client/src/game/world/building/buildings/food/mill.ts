import { BuildingActionInterface } from "@/src/game/interfaces/buildingAction";
import { Building } from "@/src/game/world/building/building";
import { EntityType } from "@/src/services/types/gameTypes";

export class Mill extends Building implements BuildingActionInterface {
  public constructor(building: EntityType) {
    super(building);
  }

  public action(): void {
    console.log("woodcutter");
  }
}
