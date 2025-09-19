type storageItems =
  | "wood"
  | "boards"
  | "stone"
  | "grain"
  | "flour"
  | "bread"
  | "pig"
  | "meat"
  | "water"
  | "coal"
  | "iron_ore"
  | "iron"
  | "sword"
  | "shield";

export type StorageType = {
  [items in storageItems]: number;
};
