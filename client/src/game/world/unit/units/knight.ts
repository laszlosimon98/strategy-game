import { Soldier } from "@/game/world/unit/units/soldier";
import { EntityType, SoldierPropertiesType } from "@/types/gameType";
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
