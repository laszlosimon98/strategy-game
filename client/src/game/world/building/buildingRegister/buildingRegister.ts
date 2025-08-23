import { Building } from "@/src/game/world/building/building";
import { Bakery } from "@/src/game/world/building/buildings/food/bakery";
import { Farm } from "@/src/game/world/building/buildings/food/farm";
import { Mill } from "@/src/game/world/building/buildings/food/mill";
import { Well } from "@/src/game/world/building/buildings/food/well";
import { Barracks } from "@/src/game/world/building/buildings/military/barracks";
import { GuardHouse } from "@/src/game/world/building/buildings/military/guardhouse";
import { IronSmelter } from "@/src/game/world/building/buildings/military/ironsmelter";
import { ToolSmith } from "@/src/game/world/building/buildings/military/toolsmith";
import { WeaponSmith } from "@/src/game/world/building/buildings/military/weaponsmith";
import { Residence } from "@/src/game/world/building/buildings/other/residence";
import { Forester } from "@/src/game/world/building/buildings/resources/forester";
import { Sawmill } from "@/src/game/world/building/buildings/resources/sawmill";
import { Stonecutter } from "@/src/game/world/building/buildings/resources/stonecutter";
import { Woodcutter } from "@/src/game/world/building/buildings/resources/woodcutter";
import { Storage } from "@/src/game/world/building/buildings/other/storage";

export const buildingRegister: Record<string, typeof Building> = {
  bakery: Bakery,
  barracks: Barracks,
  farm: Farm,
  forester: Forester,
  guardhouse: GuardHouse,
  ironsmelter: IronSmelter,
  mill: Mill,
  residence: Residence,
  sawmill: Sawmill,
  stonecutter: Stonecutter,
  storage: Storage,
  toolsmith: ToolSmith,
  weaponsmith: WeaponSmith,
  well: Well,
  woodcutter: Woodcutter,
};
