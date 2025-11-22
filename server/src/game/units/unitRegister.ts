import { Archer } from "@/game/units/archer";
import { Knight } from "@/game/units/knight";
import { Soldier } from "@/game/units/soldier";

export const unitRegister: Record<string, typeof Soldier> = {
  knight: Knight,
  archer: Archer,
};
