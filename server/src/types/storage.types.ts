type Materials = "wood" | "boards" | "stone";
type Foods = "grain" | "flour" | "bread" | "water";
type Ores = "coal" | "iron_ore";
type Weapons = "sword" | "shield" | "bow";
type Metals = "iron";

export type CombinedType = Materials | Foods | Ores | Weapons | Metals;
export type CategoryType =
  | "materials"
  | "foods"
  | "ores"
  | "weapons"
  | "metals";

export type ProductionItem = CombinedType;

export type StorageItemType<T> = {
  name: T;
  amount: number;
};

export type StorageType = {
  materials: {
    [material in Materials]: StorageItemType<material>;
  };
  foods: {
    [food in Foods]: StorageItemType<food>;
  };
  ores: {
    [ore in Ores]: StorageItemType<ore>;
  };
  weapons: {
    [weapon in Weapons]: StorageItemType<weapon>;
  };
  metals: {
    [metal in Metals]: StorageItemType<metal>;
  };
};
