import { Building } from "../building";
import { Sawmill } from "../buildings/sawmill";
import { Stonecutter } from "../buildings/stonecutter";
import { Woodcutter } from "../buildings/woodcutter";

export const buildingRegister: Record<string, typeof Building> = {
  woodcutter: Woodcutter,
  stonecutter: Stonecutter,
  sawmill: Sawmill,
};
