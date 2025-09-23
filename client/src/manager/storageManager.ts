import type { PlayerGameType } from "@/types/game.types";
import type { StorageType } from "@/types/storage.types";

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
}
