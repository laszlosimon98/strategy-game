import { Building } from "@/game/buildings/building";
import { Production } from "@/game/buildings/production";
import { Requirement } from "@/types/production.types";
import { EntityType } from "@/types/state.types";

export class Mill extends Building {
  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(8500, 6000, "foods", "flour");
  }

  public getRequirements(): Requirement | null {
    return {
      primary: { type: "foods", name: "grain" },
    };
  }
}
