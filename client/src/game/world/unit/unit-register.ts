import { Archer } from "@/game/world/unit/units/archer";
import { Knight } from "@/game/world/unit/units/knight";
import { Soldier } from "@/game/world/unit/units/soldier";

export const unitRegister: Record<string, typeof Soldier> = {
  knight: Knight,
  archer: Archer,
};
