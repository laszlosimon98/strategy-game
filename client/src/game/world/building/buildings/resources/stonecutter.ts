import { BuildingActionInterface } from "@/src/game/interfaces/building-action";
import { Building } from "@/src/game/world/building/building";
import { EntityType } from "@/src/services/types/game.types";

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
