import { BuildingActionInterface } from "@/game/interfaces/building-action";
import { Building } from "@/game/world/building/building";
import { EntityType } from "@/services/types/game.types";

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
