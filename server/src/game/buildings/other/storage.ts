import { Building } from "@/game/buildings/building";
import { EntityType } from "@/types/state.types";

export class Storage extends Building {
  public constructor(building: EntityType) {
    super(building);
  }
}
