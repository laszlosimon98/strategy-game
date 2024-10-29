import { Building } from "../building";
import { Bakery } from "../buildings/food/bakery";
import { Farm } from "../buildings/food/farm";
import { Mill } from "../buildings/food/mill";
import { Well } from "../buildings/food/well";
import { Barracks } from "../buildings/military/barracks";
import { GuardHouse } from "../buildings/military/guardhouse";
import { IronSmelter } from "../buildings/military/ironsmelter";
import { ToolSmith } from "../buildings/military/toolsmith";
import { WeaponSmith } from "../buildings/military/weaponsmith";
import { Residence } from "../buildings/other/residence";
import { Storage } from "../buildings/other/storage";
import { Forester } from "../buildings/resources/forester";
import { Sawmill } from "../buildings/resources/sawmill";
import { Stonecutter } from "../buildings/resources/stonecutter";
import { Woodcutter } from "../buildings/resources/woodcutter";

export const buildingRegister: Record<string, typeof Building> = {
  bakery: Bakery,
  barracks: Barracks,
  farm: Farm,
  forester: Forester,
  guardHouse: GuardHouse,
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
