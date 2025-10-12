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
    console.warn("Farm: Búza kész");

    // TODO: nem kell az updateStorageItem, kliens nem frissítheti
    // ez az egész külön épület extends Building nem kell (unit nál sem fog kelleni, de azt majd később)
    // elküldjük a szervernek az entity-t és ott hozza létre, ott lesz ez az extends dolog szóval sok mindent át kell vinni szerverre
    // és ott most már meg kell oldani, hogy a pálya elmentse, hogy mi van rajta és a szerver ott fogja számolni a termeléses dolgokat
    // kliensen csak az marad, ami megjelenít vagy üzen a szervernek valami action hatására, de semmit sem szabad itt számolni,
    // mindent át kell vinni a szerverre
    StateManager.updateStorageItem(ServerHandler.getId(), "foods", "grain", 1);
    console.log(StateManager.getStorage(ServerHandler.getId()));
    super.action();
  }
}
