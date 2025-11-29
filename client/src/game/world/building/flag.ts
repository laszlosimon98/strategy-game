import { Entity } from "@/game/world/entity";
import type { RendererInterface } from "@/interfaces/rendererInterface";
import type { EntityType } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

/**
 * Házakhoz tartozó, játékos színével megegyező zászlók osztálya.
 */
export class Flag extends Entity implements RendererInterface {
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
