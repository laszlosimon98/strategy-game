import { CallAble } from "@/game/interfaces/callAble";
import { Dimension } from "@/game/utils/dimension";
import { Position } from "@/game/utils/position";
import { Entity } from "@/game/world/entity";
import { EntityType } from "@/services/types/game.types";

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
