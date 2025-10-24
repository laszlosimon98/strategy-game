import { Section } from "@/game/menu/sections/section";
import { StorageItem } from "@/game/menu/sections/storage/storageItem";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import type { StorageResponse } from "@/types/game.types";
import type {
  CombinedType,
  CategoryType,
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
    this.handleCommunication();
  }

  public draw(): void {
    super.draw();
    if (this.storage) {
      this.items.forEach((item) => item.draw());
    }
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);

    if (!this.storage) {
      this.initializeStorage();
    }
  }

  private initializeStorage(): void {
    this.storage = StateManager.getStorage(this.playerId);

    if (this.storage) {
      this.createItem(
        new Position(this.pos.x + 20, this.pos.y + 25),
        "materials",
        "wood"
      );
      this.createItem(
        new Position(this.pos.x + 55, this.pos.y + 25),
        "materials",
        "boards"
      );
      this.createItem(
        new Position(this.pos.x + 120, this.pos.y + 25),
        "materials",
        "stone"
      );

      this.createItem(
        new Position(this.pos.x + 10, this.pos.y + 100),
        "foods",
        "grain"
      );
      this.createItem(
        new Position(this.pos.x + 80, this.pos.y + 100),
        "foods",
        "flour"
      );
      this.createItem(
        new Position(this.pos.x + 130, this.pos.y + 100),
        "foods",
        "bread"
      );
      this.createItem(
        new Position(this.pos.x + 200, this.pos.y + 100),
        "foods",
        "water"
      );

      this.createItem(
        new Position(this.pos.x + 10, this.pos.y + 175),
        "ores",
        "coal"
      );
      this.createItem(
        new Position(this.pos.x + 60, this.pos.y + 175),
        "ores",
        "iron_ore"
      );

      this.createItem(
        new Position(this.pos.x + 10, this.pos.y + 250),
        "metals",
        "iron"
      );

      this.createItem(
        new Position(this.pos.x + 10, this.pos.y + 325),
        "weapons",
        "sword"
      );
      this.createItem(
        new Position(this.pos.x + 70, this.pos.y + 325),
        "weapons",
        "shield"
      );
      this.createItem(
        new Position(this.pos.x + 140, this.pos.y + 325),
        "weapons",
        "bow"
      );
    }
  }

  private createItem(
    pos: Position,
    path: CategoryType,
    item: CombinedType
  ): void {
    if (!this.storage) return;

    this.items.push(
      new StorageItem(pos, Dimension.zero(), path, item, this.storage)
    );
  }

  private updateStorageUI() {
    this.items = [];
    this.initializeStorage();
  }

  private handleCommunication() {
    ServerHandler.receiveMessage(
      "game:storageUpdate",
      ({ storage }: StorageResponse) => {
        StateManager.updateStorage(this.playerId, storage);
        this.updateStorageUI();
      }
    );
  }
}
