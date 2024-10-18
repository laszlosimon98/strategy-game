import { BuildingActionInterface } from "../../../../interfaces/buildingAction";
import { BuildingType } from "../../../../types/gameType";
import { Building } from "../building";

export class Stonecutter extends Building implements BuildingActionInterface {
  public constructor(building: BuildingType) {
    super(building);
  }

  public action(): void {
    setTimeout(() => {
      console.log("stonecutter");
    }, 1000);
  }
}
