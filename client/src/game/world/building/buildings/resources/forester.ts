import { Building } from "@/game/world/building/building";
import type { BuildingActionInterface } from "@/interfaces/buildingActionInterface";
import type { EntityType } from "@/types/game.types";

export class Forester extends Building implements BuildingActionInterface {
  public constructor(building: EntityType) {
    super(building);
  }

  public action(): void {
    console.log("woodcutter");
  }
}
