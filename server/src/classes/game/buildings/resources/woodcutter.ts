import { Building } from "@/classes/game/building";
import { Production } from "@/classes/game/production";
import { EntityType } from "@/types/state.types";

export class Woodcutter extends Building {
  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(6000, 7500, "materials", "wood");
  }
}
