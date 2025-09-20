import { Section } from "@/game/menu/sections/section";
import { ctx } from "@/init";
import { language } from "@/languages/language";
import { StateManager } from "@/manager/stateManager";
import { Text } from "@/page/components/text";
import { ServerHandler } from "@/server/serverHandler";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class StorageSection extends Section {
  private t: Text | null = null;
  private t2: Text | null = null;
  private playerId: string;

  constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
    this.playerId = ServerHandler.getId();

    this.initializeStorage();
  }

  private initializeStorage(): void {
    const storage = StateManager.getStorage(this.playerId);

    if (storage) {
      this.t = new Text(
        new Position(20, 200),
        language[StateManager.getLanguage()].storage[
          storage.materials.wood.name
        ],
        {
          fontSize: "14px",
        }
      );
      this.t2 = new Text(
        new Position(ctx.measureText(this.t.getText()).width, 225), // ez nem jó
        storage.materials.wood.amount.toString(),
        {
          fontSize: "14px",
        }
      );
    }
  }

  public draw(): void {
    super.draw();

    if (this.t && this.t2) {
      this.t.draw();
      this.t2.draw();
    }
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);

    if (!this.t || !this.t2) {
      this.initializeStorage();
    }
  }
}
