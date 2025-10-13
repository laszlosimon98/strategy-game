import { Buildings } from "@/types/building.types";

export type ProductionAction = {
  cooldown: number;
  production: number;
};

export type ProductionTimes = {
  [building in Buildings]: ProductionAction;
};
