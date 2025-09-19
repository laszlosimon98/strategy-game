import { StorageType } from "@/types/storage.types";

export class StorageManager {
  private static initStorage: StorageType = {
    materials: {
      wood: 0,
      boards: 0,
      stone: 0,
    },
    foods: {
      grain: 0,
      flour: 0,
      bread: 0,
      pig: 0,
      meat: 0,
      water: 0,
    },
    ores: {
      coal: 0,
      iron: 0,
    },
    weapons: {
      sword: 0,
      shield: 0,
    },
    metals: {
      iron: 0,
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
