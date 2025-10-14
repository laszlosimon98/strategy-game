import { Building } from "@/classes/game/building";
import { Production } from "@/classes/game/production";
import { Requirement } from "@/types/production.types";
import { EntityType } from "@/types/state.types";

export class Bakery extends Building {
  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(9000, 7000, "foods", "bread");
  }

  public getRequirements(): Requirement | null {
    return {
      primary: { type: "foods", name: "flour" },
      secondary: { type: "foods", name: "water" },
    };
  }
}
