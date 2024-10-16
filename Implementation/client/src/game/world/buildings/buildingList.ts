import { Building } from "../building";
import { Stonecutter } from "./stonecutter";
import { Woodcutter } from "./woodcutter";

export const buildingList: Record<string, typeof Building> = {
  woodcutter: Woodcutter,
  stonecutter: Stonecutter,
};
