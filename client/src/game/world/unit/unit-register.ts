import { Archer } from "@/src/game/world/unit/units/archer";
import { Knight } from "@/src/game/world/unit/units/knight";
import { Soldier } from "@/src/game/world/unit/units/soldier";

export const unitRegister: Record<string, typeof Soldier> = {
  knight: Knight,
  archer: Archer,
};
