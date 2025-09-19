type Materials = "wood" | "boards" | "stone";
type Foods = "grain" | "flour" | "bread" | "pig" | "meat" | "water";
type Ores = "coal" | "iron";
type Weapons = "sword" | "shield";
type Metals = "iron";

export type StorageType = {
  materials: {
    [material in Materials]: {
      name: material;
      amount: number;
    };
  };
  foods: {
    [food in Foods]: {
      name: food;
      amount: number;
    };
  };
  ores: {
    [ore in Ores]: {
      name: ore;
      amount: number;
    };
  };
  weapons: {
    [weapon in Weapons]: {
      name: weapon;
      amount: number;
    };
  };
  metals: {
    [metal in Metals]: {
      name: metal;
      amount: number;
    };
  };
};
