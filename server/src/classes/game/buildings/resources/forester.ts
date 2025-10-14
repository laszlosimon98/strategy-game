import { Building } from "@/classes/game/building";
import { EntityType } from "@/types/state.types";

export class Forester extends Building {
  public constructor(building: EntityType) {
    super(building);
  }
}
