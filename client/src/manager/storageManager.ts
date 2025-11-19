import type { PlayerGameType } from "@/types/game.types";
import type { StorageType, CategoryType } from "@/types/storage.types";

export class StorageManager {
  private constructor() {}

  public static getStorage(player: PlayerGameType[""]): StorageType | null {
    if (!player) {
      return null;
    }
    return player.storage;
  }

  public static updateStorage(
    player: PlayerGameType[""],
    newStorageValues: StorageType
  ): void {
    player.storage = { ...newStorageValues };
  }

  public static updateStorageItem(
    player: PlayerGameType[""],
    type: CategoryType,
    name: string,
    amount: number
  ): void {
    const currentStorage: StorageType | null = this.getStorage(player);

    if (!currentStorage) {
      return;
    }

    const storageCategory = currentStorage[type];
    const currentItem = (storageCategory as any)[name];

    if (!currentItem) {
      return;
    }

    const materialAmount: number = currentItem.amount;
    const newValue: number = materialAmount + amount;

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

    this.updateStorage(player, newStorage);
  }
}
