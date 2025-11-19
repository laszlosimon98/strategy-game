import { Building } from "@/game/building";
import { EntityType } from "@/types/state.types";

export class Residence extends Building {
  public constructor(building: EntityType) {
    super(building);
  }
}
