import { Building } from "@/game/world/building/building";
import { ctx } from "@/init";
import type { EntityType } from "@/types/game.types";

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
