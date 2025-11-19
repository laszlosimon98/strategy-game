import { Building } from "@/game/building";
import { Production } from "@/game/production";
import { EntityType } from "@/types/state.types";

export class Well extends Building {
  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(7000, 5000, "foods", "water");
  }
}
