import { Soldier } from "@/game/world/unit/units/soldier";
import type { EntityType, SoldierPropertyType } from "@/types/game.types";
import { Position } from "@/utils/position";

export class Knight extends Soldier {
  constructor(entity: EntityType, property: SoldierPropertyType) {
    super(entity, property);
  }

  public draw(): void {
    super.draw();
  }

  public update(dt: number, cameraPos: Position): void {
    super.update(dt, cameraPos);
  }
}
