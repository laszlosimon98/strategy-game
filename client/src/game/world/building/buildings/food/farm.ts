import { Building } from "@/game/world/building/building";
import type { BuildingActionInterface } from "@/interfaces/buildingActionInterface";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import type { EntityType } from "@/types/game.types";

export class Farm extends Building implements BuildingActionInterface {
  public constructor(building: EntityType) {
    super(building);
  }

  public action(): void {
    // console.warn("Farm: Búza kész");
    // console.log(this.entity);
    // ServerHandler.sendMessage("game:production", { entity: this.entity });
    // StateManager.updateStorageItem(ServerHandler.getId(), "foods", "grain", 1);
    // console.log(StateManager.getStorage(ServerHandler.getId()));
    // super.action();
  }
}
