import { ctx } from "../../../init";
import { BuildingType } from "../../../types/gameType";
import { Building } from "../building";

export class FakeBuilding extends Building {
  public constructor(building: BuildingType) {
    super(building);
  }

  draw(): void {
    ctx.save();
    ctx.globalAlpha = 0.75;
    super.draw();
    ctx.restore();
  }
}
