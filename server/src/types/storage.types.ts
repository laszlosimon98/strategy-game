type Materials = "wood" | "boards" | "stone";
type Foods = "grain" | "flour" | "bread" | "pig" | "meat" | "water";
type Ores = "coal" | "iron";
type Weapons = "sword" | "shield";
type Metals = "iron";

export type StorageType = {
  materials: { [material in Materials]: number };
  foods: { [food in Foods]: number };
  ores: { [ores in Ores]: number };
  weapons: { [weapons in Weapons]: number };
  metals: { [metal in Metals]: number };
};
