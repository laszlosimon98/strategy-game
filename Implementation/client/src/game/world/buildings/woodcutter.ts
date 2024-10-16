import { Indices } from "../../../utils/indices";
import { BuildingType } from "../../types/types";
import { Building } from "../building";

export class Woodcutter extends Building {
  public constructor(indices: Indices, building: BuildingType) {
    super(indices, building);
  }

  public action(): void {
    console.log("woodcutter");
  }
}
