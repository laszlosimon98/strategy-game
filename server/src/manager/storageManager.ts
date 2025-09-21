import { StorageType } from "@/types/storage.types";

export class StorageManager {
  private static initStorage: StorageType = {
    materials: {
      wood: { name: "wood", amount: Math.floor(Math.random() * 50) },
      boards: { name: "boards", amount: Math.floor(Math.random() * 50) },
      stone: { name: "stone", amount: Math.floor(Math.random() * 50) },
    },
    foods: {
      grain: { name: "grain", amount: Math.floor(Math.random() * 50) },
      flour: { name: "flour", amount: Math.floor(Math.random() * 50) },
      bread: { name: "bread", amount: Math.floor(Math.random() * 50) },
      water: { name: "water", amount: Math.floor(Math.random() * 50) },
    },
    ores: {
      coal: { name: "coal", amount: Math.floor(Math.random() * 50) },
      iron_ore: { name: "iron_ore", amount: Math.floor(Math.random() * 50) },
    },
    weapons: {
      sword: { name: "sword", amount: Math.floor(Math.random() * 50) },
      shield: { name: "shield", amount: Math.floor(Math.random() * 50) },
      bow: { name: "bow", amount: Math.floor(Math.random() * 50) },
    },
    metals: {
      iron: { name: "iron", amount: Math.floor(Math.random() * 50) },
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
