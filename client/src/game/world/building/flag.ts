import { CallAble } from "@/src/game/interfaces/callable";
import { Dimension } from "@/src/game/utils/dimension";
import { Position } from "@/src/game/utils/position";
import { Entity } from "@/src/game/world/entity";
import { EntityType } from "@/src/services/types/game.types";

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
