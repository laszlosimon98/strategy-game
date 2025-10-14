import { CombinedType, CategoryType } from "@/types/storage.types";

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
