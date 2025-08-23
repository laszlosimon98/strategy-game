import { BuildingActionInterface } from "@/game/interfaces/buildingAction";
import { EntityType } from "@/game/types/gameType";
import { Building } from "@/game/world/building/building";

export class Woodcutter extends Building implements BuildingActionInterface {
  public constructor(building: EntityType) {
    super(building);
  }

  public action(): void {
    console.log("woodcutter");
  }
}
