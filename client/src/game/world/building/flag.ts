import { Entity } from "@/game/world/entity";
import type { CallAble } from "@/interfaces/callAble";
import type { EntityType } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class Flag extends Entity implements CallAble {
  constructor(entity: EntityType) {
    super(entity);
  }

  draw(): void {
    super.draw();
  }

  update(dt: number, cameraScroll: Position): void {
    super.update(dt, cameraScroll);
  }

  getPosition(): Position {
    return super.getPosition();
  }

  getDimension(): Dimension {
    return super.getDimension();
  }
}
