import { Soldier } from "@/game/units/soldier";
import { EntityType } from "@/types/state.types";

export class Archer extends Soldier {
  public constructor(entity: EntityType) {
    super(entity);

    this.damage = 9;
    this.health = 75;
    this.range = 5;
  }
}
