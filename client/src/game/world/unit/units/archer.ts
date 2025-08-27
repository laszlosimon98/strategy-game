import { Position } from "@/src/game/utils/position";
import { Soldier } from "@/src/game/world/unit/units/soldier";
import {
  EntityType,
  SoldierPropertiesType,
} from "@/src/services/types/game.types";

export class Archer extends Soldier {
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
