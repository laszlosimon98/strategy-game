import { ctx } from "@/src/game/main";
import { Building } from "@/src/game/world/building/building";
import { EntityType } from "@/src/services/types/game.types";

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
