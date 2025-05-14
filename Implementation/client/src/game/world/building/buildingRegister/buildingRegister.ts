import { Building } from "@/game/world/building/building";
import { Bakery } from "@/game/world/building/buildings/food/bakery";
import { Farm } from "@/game/world/building/buildings/food/farm";
import { Mill } from "@/game/world/building/buildings/food/mill";
import { Well } from "@/game/world/building/buildings/food/well";
import { Barracks } from "@/game/world/building/buildings/military/barracks";
import { GuardHouse } from "@/game/world/building/buildings/military/guardhouse";
import { IronSmelter } from "@/game/world/building/buildings/military/ironsmelter";
import { ToolSmith } from "@/game/world/building/buildings/military/toolsmith";
import { WeaponSmith } from "@/game/world/building/buildings/military/weaponsmith";
import { Residence } from "@/game/world/building/buildings/other/residence";
import { Forester } from "@/game/world/building/buildings/resources/forester";
import { Sawmill } from "@/game/world/building/buildings/resources/sawmill";
import { Stonecutter } from "@/game/world/building/buildings/resources/stonecutter";
import { Woodcutter } from "@/game/world/building/buildings/resources/woodcutter";
import { Storage } from "@/game/world/building/buildings/other/storage";

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
