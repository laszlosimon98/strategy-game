import { ChangeAble } from "../../../interfaces/changeAble";
import { RenderInterface } from "../../../interfaces/render";
import { Position } from "../../../utils/position";
import { Dimension } from "../../../utils/dimension";
import { Entity } from "../entity";
import { EntityType } from "../../../types/gameType";

export class Flag extends Entity implements RenderInterface, ChangeAble {
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
