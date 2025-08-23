import { Archer } from "../units/archer";
import { Knight } from "../units/knight";
import { Soldier } from "../units/soldier";

export const unitRegister: Record<string, typeof Soldier> = {
  knight: Knight,
  archer: Archer,
};
