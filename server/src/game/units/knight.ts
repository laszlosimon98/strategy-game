import { Soldier } from "@/game/units/soldier";
import { EntityType } from "@/types/state.types";

export class Knight extends Soldier {
  public constructor(entity: EntityType) {
    super(entity);

    this.damage = 13;
    this.health = 100;
    this.range = 1;
  }
}
