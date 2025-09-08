import { Soldier } from "@/game/world/unit/units/soldier";
import type { EntityType, SoldierPropertiesType } from "@/types/game.types";
import { Position } from "@/utils/position";

export class Knight extends Soldier {
  constructor(
    entity: EntityType,
    name: string,
    propterties: SoldierPropertiesType
  ) {
    super(entity, name, propterties);
  }

  public draw(): void {
    super.draw();
  }

  public update(dt: number, cameraPos: Position): void {
    super.update(dt, cameraPos);
  }
}
