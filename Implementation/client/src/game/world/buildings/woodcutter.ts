import { BuildingAssetType } from "../../../types/gameType";
import { Indices } from "../../../utils/indices";
import { Building } from "../building";

export class Woodcutter extends Building {
  public constructor(indices: Indices, building: BuildingAssetType) {
    super(indices, building);
  }

  public action(): void {
    console.log("woodcutter");
  }
}
