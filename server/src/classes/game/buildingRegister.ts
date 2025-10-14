import { Building } from "@/classes/game/building";
import { Bakery } from "@/classes/game/buildings/food/bakery";
import { Farm } from "@/classes/game/buildings/food/farm";
import { Mill } from "@/classes/game/buildings/food/mill";
import { Well } from "@/classes/game/buildings/food/well";
import { Barracks } from "@/classes/game/buildings/military/barracks";
import { GuardHouse } from "@/classes/game/buildings/military/guardhouse";
import { IronSmelter } from "@/classes/game/buildings/military/ironsmelter";
import { ToolSmith } from "@/classes/game/buildings/military/toolsmith";
import { WeaponSmith } from "@/classes/game/buildings/military/weaponsmith";
import { Residence } from "@/classes/game/buildings/other/residence";
import { Storage } from "@/classes/game/buildings/other/storage";
import { Forester } from "@/classes/game/buildings/resources/forester";
import { Sawmill } from "@/classes/game/buildings/resources/sawmill";
import { Stonecutter } from "@/classes/game/buildings/resources/stonecutter";
import { Woodcutter } from "@/classes/game/buildings/resources/woodcutter";

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
