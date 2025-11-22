import { Building } from "@/game/buildings/building";
import { Bakery } from "@/game/buildings/food/bakery";
import { Farm } from "@/game/buildings/food/farm";
import { Mill } from "@/game/buildings/food/mill";
import { Well } from "@/game/buildings/food/well";
import { Barracks } from "@/game/buildings/military/barracks";
import { GuardHouse } from "@/game/buildings/military/guardhouse";
import { IronSmelter } from "@/game/buildings/military/ironsmelter";
import { ToolSmith } from "@/game/buildings/military/toolsmith";
import { WeaponSmith } from "@/game/buildings/military/weaponsmith";
import { CoalMine } from "@/game/buildings/other/coalmine";
import { IronMine } from "@/game/buildings/other/ironmine";
import { Residence } from "@/game/buildings/other/residence";
import { Storage } from "@/game/buildings/other/storage";
import { Forester } from "@/game/buildings/resources/forester";
import { Sawmill } from "@/game/buildings/resources/sawmill";
import { Stonecutter } from "@/game/buildings/resources/stonecutter";
import { Woodcutter } from "@/game/buildings/resources/woodcutter";

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
  coalmine: CoalMine,
  ironmine: IronMine,
};
