import { ctx } from "@/game/main";
import { Building } from "@/game/world/building/building";
import { EntityType } from "services/types/gameTypes";

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
