import { BuildingAssetType } from "../../../types/gameType";
import { Indices } from "../../../utils/indices";
import { Building } from "../building";

export class Stonecutter extends Building {
  public constructor(indices: Indices, building: BuildingAssetType) {
    super(indices, building);
  }

  public action(): void {
    setTimeout(() => {
      console.log("stonecutter");
    }, 1000);
  }
}
