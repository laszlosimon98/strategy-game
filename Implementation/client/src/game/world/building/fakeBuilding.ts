import { ctx } from "../../../init";
import { EntityType } from "../../../types/gameType";
import { Building } from "./building";

export class FakeBuilding extends Building {
  public constructor(entity: EntityType, hasFlag: boolean) {
    super(entity, hasFlag);
  }

  draw(): void {
    ctx.save();
    ctx.globalAlpha = 0.75;
    super.draw();
    ctx.restore();
  }
}
