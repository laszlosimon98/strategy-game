export type Buildings =
  | "bakery"
  | "barracks"
  | "farm"
  | "forester"
  | "guardhouse"
  | "ironsmelter"
  | "mill"
  | "residence"
  | "sawmill"
  | "stonecutter"
  | "storage"
  | "toolsmith"
  | "weaponsmith"
  | "well"
  | "woodcutter"
  | "ironmine"
  | "coalmine";

type Price = {
  boards: number;
  stone: number;
};

export type BuildingPrices = {
  [building in Buildings]: Price;
};
