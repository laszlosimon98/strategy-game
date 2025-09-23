import { StateType } from "@/types/state.types";
import { StorageType } from "@/types/storage.types";
import { Socket } from "socket.io";

export class StorageManager {
  private static initStorage: StorageType = {
    materials: {
      wood: { name: "wood", amount: Math.floor(Math.random() * 50) },
      boards: { name: "boards", amount: 12 },
      stone: { name: "stone", amount: 12 },
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
