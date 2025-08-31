import { BuildingActionInterface } from "@/game/interfaces/building-action";
import { Building } from "@/game/world/building/building";
import { EntityType } from "@/services/types/game.types";

export class Residence extends Building implements BuildingActionInterface {
  public constructor(building: EntityType) {
    super(building);
  }

  public action(): void {
    console.log("woodcutter");
  }
}
