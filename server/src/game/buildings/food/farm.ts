import { Building } from "@/game/buildings/building";
import { Production } from "@/game/buildings/production";
import { EntityType } from "@/types/state.types";

export class Farm extends Building {
  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(8000, 6000, "foods", "grain");
  }
}
