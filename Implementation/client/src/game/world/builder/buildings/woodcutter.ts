import { BuildingActionInterface } from "../../../../interfaces/buildingAction";
import { BuildingType } from "../../../../types/gameType";
import { Building } from "../building";

export class Woodcutter extends Building implements BuildingActionInterface {
  public constructor(building: BuildingType) {
    super(building);
  }

  public action(): void {
    console.log("woodcutter");
  }
}
