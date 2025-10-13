import { Buildings } from "@/types/building.types";
import { CombinedTypes, StorageTypes } from "@/types/storage.types";

export type ProductionAction = {
  cooldown: number;
  production: number;
};

export type ProductionTimes = {
  [building in Buildings]: ProductionAction;
};

export type Requirement = null | {
  primary: {
    type: StorageTypes;
    name: CombinedTypes;
  };
  secondary?: {
    type: StorageTypes;
    name: CombinedTypes;
  };
};

export type Requirements = {
  [building in Buildings]: Requirement;
};
