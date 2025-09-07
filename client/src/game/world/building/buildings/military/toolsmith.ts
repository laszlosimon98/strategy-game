import { BuildingActionInterface } from "../../../../../interfaces/buildingAction";
import { EntityType } from "../../../../../types/gameType";
import { Building } from "../../building";

export class ToolSmith extends Building implements BuildingActionInterface {
  public constructor(building: EntityType) {
    super(building);
  }

  public action(): void {
    console.log("woodcutter");
  }
}
