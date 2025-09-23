import { StateType } from "@/types/state.types";
import { StorageType } from "@/types/storage.types";
import { Socket } from "socket.io";

export class StorageManager {
  private static initStorage: StorageType = {
    materials: {
      wood: { name: "wood", amount: 8 },
      boards: { name: "boards", amount: 12 },
      stone: { name: "stone", amount: 12 },
    },
    foods: {
      grain: { name: "grain", amount: 8 },
      flour: { name: "flour", amount: 4 },
      bread: { name: "bread", amount: 4 },
      water: { name: "water", amount: 6 },
    },
    ores: {
      coal: { name: "coal", amount: 10 },
      iron_ore: { name: "iron_ore", amount: 5 },
    },
    weapons: {
      sword: { name: "sword", amount: 2 },
      shield: { name: "shield", amount: 2 },
      bow: { name: "bow", amount: 3 },
    },
    metals: {
      iron: { name: "iron", amount: 5 },
    },
  };

  private constructor() {}

  public static getInitStorage(): StorageType {
    return this.initStorage;
  }

  public static getCurrentStorage(
    socket: Socket,
    room: string,
    state: StateType
  ): StorageType {
    return state[room].players[socket.id].storage;
  }

  public static updateStorage(
    socket: Socket,
    room: string,
    state: StateType,
    newStorageValues: StorageType
  ): void {
    state[room].players[socket.id].storage = { ...newStorageValues };
  }
}
