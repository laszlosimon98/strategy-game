import { StateType } from "@/types/state.types";
import {
  CombinedTypes,
  StorageItemType,
  StorageType,
  StorageTypes,
} from "@/types/storage.types";
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

  private static updateStorage(
    socket: Socket,
    room: string,
    state: StateType,
    newStorageValues: StorageType
  ): void {
    state[room].players[socket.id].storage = { ...newStorageValues };
  }

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

  public static hasMaterial(
    socket: Socket,
    room: string,
    state: StateType,
    type: StorageTypes,
    name: CombinedTypes,
    amount: number
  ): boolean {
    const currentStorage: StorageType = this.getCurrentStorage(
      socket,
      room,
      state
    );

    const storageCategory = currentStorage[type];
    const item = (storageCategory as any)[name];

    if (!item) {
      return false;
    }

    return item.amount - amount >= 0;
  }

  public static updateStorageItem(
    socket: Socket,
    room: string,
    state: StateType,
    type: StorageTypes,
    name: string,
    amount: number
  ): void {
    const currentStorage: StorageType = this.getCurrentStorage(
      socket,
      room,
      state
    );

    const storageCategory = currentStorage[type];
    const currentItem = (storageCategory as any)[name];

    if (!currentItem) {
      return;
    }

    const materialAmount: number = currentItem.amount;
    const newValue: number = materialAmount - amount;

    const newStorage: StorageType = {
      ...currentStorage,
      [type]: {
        ...currentStorage[type],
        [name]: {
          ...currentItem,
          amount: newValue,
        },
      },
    } as StorageType;

    this.updateStorage(socket, room, state, newStorage);
  }
}
