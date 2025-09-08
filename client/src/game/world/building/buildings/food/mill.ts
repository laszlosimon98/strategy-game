import { Building } from "@/game/world/building/building";
import type { BuildingActionInterface } from "@/interfaces/buildingAction";
import type { EntityType } from "@/types/game.types";

export class Mill extends Building implements BuildingActionInterface {
  public constructor(building: EntityType) {
    super(building);
  }

  public action(): void {
    console.log("woodcutter");
  }
}
