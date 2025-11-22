import { Building } from "@/game/buildings/building";
import { Production } from "@/game/buildings/production";
import { Requirement } from "@/types/production.types";
import { EntityType } from "@/types/state.types";

export class IronSmelter extends Building {
  readonly production: Production | null = null;

  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(7000, 9000, "metals", "iron");
  }

  public getRequirements(): Requirement | null {
    return {
      primary: { type: "ores", name: "coal" },
      secondary: { type: "ores", name: "iron_ore" },
    };
  }
}
