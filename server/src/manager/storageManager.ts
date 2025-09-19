import { StorageType } from "@/types/storage.types";

export class StorageManager {
  private static initStorage: StorageType = {
    materials: {
      wood: {
        name: "wood",
        amount: 0,
      },
      boards: {
        name: "boards",
        amount: 0,
      },
      stone: {
        name: "stone",
        amount: 0,
      },
    },
    foods: {
      grain: {
        name: "grain",
        amount: 0,
      },
      flour: {
        name: "flour",
        amount: 0,
      },
      bread: {
        name: "bread",
        amount: 0,
      },
      pig: {
        name: "pig",
        amount: 0,
      },
      meat: {
        name: "meat",
        amount: 0,
      },
      water: {
        name: "water",
        amount: 0,
      },
    },
    ores: {
      coal: {
        name: "coal",
        amount: 0,
      },
      iron_ore: {
        name: "iron_ore",
        amount: 0,
      },
    },
    weapons: {
      sword: {
        name: "sword",
        amount: 0,
      },
      shield: {
        name: "shield",
        amount: 0,
      },
      bow: {
        name: "bow",
        amount: 0,
      },
    },
    metals: {
      iron: {
        name: "iron",
        amount: 0,
      },
    },
  };

  private static storage: StorageType = this.initStorage;
  private constructor() {}

  public static getInitStorage(): StorageType {
    return this.initStorage;
  }

  public static getCurrentStorage(): StorageType {
    return this.storage;
  }
}
