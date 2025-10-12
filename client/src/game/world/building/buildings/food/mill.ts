import { Building } from "@/game/world/building/building";
import type { BuildingActionInterface } from "@/interfaces/buildingActionInterface";
import type { EntityType } from "@/types/game.types";

export class Mill extends Building implements BuildingActionInterface {
  public constructor(building: EntityType) {
    super(building);
  }

  public action(): void {
    console.warn("Malom: Liszt kész");
    super.action();
  }

  public cooldown(): void {
    console.error("Malom: Pihenő vége");
    super.cooldown();
  }
}
