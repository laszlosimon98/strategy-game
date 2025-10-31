import { Unit } from "@/game/units/unit";
import { Archer } from "@/game/units/archer";
import { Knight } from "@/game/units/knight";

export const buildingRegister: Record<string, typeof Unit> = {
  knight: Knight,
  archer: Archer,
};
