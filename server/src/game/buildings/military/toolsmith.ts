import { Building } from "@/game/buildings/building";
import { Production } from "@/game/buildings/production";
import { Requirement } from "@/types/production.types";
import { EntityType } from "@/types/state.types";

export class ToolSmith extends Building {
  readonly production: Production | null = null;

  public constructor(building: EntityType) {
    super(building);
    this.production = new Production(6500, 9500, "weapons", "bow");
  }

  public getRequirements(): Requirement | null {
    return {
      primary: { type: "ores", name: "coal" },
      secondary: { type: "ores", name: "iron_ore" },
    };
  }
}
