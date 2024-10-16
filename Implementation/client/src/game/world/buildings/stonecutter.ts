import { Indices } from "../../../utils/indices";
import { BuildingType } from "../../types/types";
import { Building } from "../building";

export class Stonecutter extends Building {
  public constructor(indices: Indices, building: BuildingType) {
    super(indices, building);
  }

  public action(): void {
    setTimeout(() => {
      console.log("stonecutter");
    }, 1000);
  }
}
