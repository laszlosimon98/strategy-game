import { Building } from "@/game/buildings/building";
import { Production } from "@/game/buildings/production";
import { Requirement } from "@/types/production.types";
import { EntityType } from "@/types/state.types";

export class Sawmill extends Building {
  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(7500, 7000, "materials", "boards");
  }

  public getRequirements(): Requirement | null {
    return {
      primary: { type: "materials", name: "wood" },
    };
  }
}
