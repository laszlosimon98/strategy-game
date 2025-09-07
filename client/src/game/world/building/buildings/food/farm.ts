import { Building } from "@/game/world/building/building";
import { BuildingActionInterface } from "@/interfaces/buildingAction";
import { EntityType } from "@/types/gameType";

export class Farm extends Building implements BuildingActionInterface {
  public constructor(building: EntityType) {
    super(building);
  }

  public action(): void {
    console.log("woodcutter");
  }
}
