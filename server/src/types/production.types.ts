import { Buildings } from "@/types/building.types";
import { CombinedType, CategoryType } from "@/types/storage.types";

export type ProductionAction = {
  cooldown: number;
  production: number;
};

export type ProductionTimes = {
  [building in Buildings]: ProductionAction;
};

export type Requirement = null | {
  primary: {
    type: CategoryType;
    name: CombinedType;
  };
  secondary?: {
    type: CategoryType;
    name: CombinedType;
  };
};

export type Requirements = {
  [building in Buildings]: Requirement;
};
