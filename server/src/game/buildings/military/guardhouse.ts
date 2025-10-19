import { Building } from "@/game/building";
import { EntityType } from "@/types/state.types";

export class GuardHouse extends Building {
  public constructor(building: EntityType) {
    super(building);

    this.range = 7;
  }
}
