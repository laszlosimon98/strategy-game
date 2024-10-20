import { ctx } from "../../../init";
import { EntityType } from "../../../types/gameType";
import { Building } from "./building";

export class FakeBuilding extends Building {
  public constructor(building: EntityType) {
    super(building);
  }

  draw(): void {
    ctx.save();
    ctx.globalAlpha = 0.75;
    super.draw();
    ctx.restore();
  }
}
