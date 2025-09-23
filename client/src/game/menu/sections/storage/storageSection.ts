import { Section } from "@/game/menu/sections/section";
import { StorageItem } from "@/game/menu/sections/storage/storageItem";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import type {
  AllItemType,
  GroupType,
  StorageType,
} from "@/types/storage.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class StorageSection extends Section {
  private playerId: string;
  private storage: StorageType | null = null;
  private items: StorageItem[] = [];

  constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
    this.playerId = ServerHandler.getId();

    this.initializeStorage();
  }

  private initializeStorage(): void {
    this.items = [];
    this.storage = StateManager.getStorage(this.playerId);

    if (this.storage) {
      this.createItem(new Position(20, 200), "materials", "wood");
      this.createItem(new Position(55, 200), "materials", "boards");
      this.createItem(new Position(120, 200), "materials", "stone");

      this.createItem(new Position(10, 270), "foods", "grain");
      this.createItem(new Position(80, 270), "foods", "flour");
      this.createItem(new Position(130, 270), "foods", "bread");
      this.createItem(new Position(200, 270), "foods", "water");

      this.createItem(new Position(10, 340), "ores", "coal");
      this.createItem(new Position(60, 340), "ores", "iron_ore");

      this.createItem(new Position(10, 410), "metals", "iron");

      this.createItem(new Position(10, 490), "weapons", "sword");
      this.createItem(new Position(70, 490), "weapons", "shield");
      this.createItem(new Position(140, 490), "weapons", "bow");
    }
  }

  private createItem(pos: Position, path: GroupType, item: AllItemType): void {
    if (!this.storage) return;

    this.items.push(
      new StorageItem(pos, Dimension.zero(), path, item, this.storage)
    );
  }

  public draw(): void {
    super.draw();
    if (this.storage) {
      this.items.forEach((item) => item.draw());
    }
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);

    this.initializeStorage();
  }
}
