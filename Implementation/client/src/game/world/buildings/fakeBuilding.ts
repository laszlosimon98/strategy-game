import { ctx } from "../../../init";
import { BuildingAssetType } from "../../../types/gameType";
import { Indices } from "../../../utils/indices";
import { Building } from "../building";

export class FakeBuilding extends Building {
  public constructor(indices: Indices, building: BuildingAssetType) {
    super(indices, building);
  }

  draw(): void {
    ctx.save();
    ctx.globalAlpha = 0.75;
    super.draw();
    ctx.restore();
  }
}
