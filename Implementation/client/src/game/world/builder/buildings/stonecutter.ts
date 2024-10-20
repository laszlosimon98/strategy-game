import { BuildingActionInterface } from "../../../../interfaces/buildingAction";
import { EntityType } from "../../../../types/gameType";
import { Building } from "../building";

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
