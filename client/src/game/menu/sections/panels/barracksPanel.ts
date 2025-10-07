import { LabelButton } from "@/game/menu/sections/labelButton";
import { StateManager } from "@/manager/stateManager";
import { ServerHandler } from "@/server/serverHandler";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class BarracksPanel {
  private barracksButtons: LabelButton[] = [];
  private isPlayerInitialized: boolean = false;

  constructor() {
    this.initButtons();
  }

  private initButtons(): void {
    const playerId = ServerHandler.getId();
    const players = StateManager.getPlayers();

    if (playerId in players) {
      this.isPlayerInitialized = true;

      this.barracksButtons.push(
        new LabelButton(
          new Position(25, 475),
          new Dimension(96, 96),
          StateManager.getStaticImage(playerId, "knight"),
          "empty",
          {
            hasTooltip: false,
            hasPrice: true,
            type: "unit",
          }
        )
      );

      this.barracksButtons.push(
        new LabelButton(
          new Position(125, 475),
          new Dimension(96, 96),
          StateManager.getStaticImage(playerId, "archer"),
          "empty",
          {
            hasTooltip: false,
            hasPrice: true,
            type: "unit",
          }
        )
      );
    }
  }

  public draw(): void {
    if (this.isPlayerInitialized) {
      this.barracksButtons.forEach((btn) => btn.draw());
    }
  }

  public update(dt: number, mousePos: Position): void {
    if (!this.isPlayerInitialized) {
      this.initButtons();
    } else {
      this.barracksButtons.forEach((btn) => btn.update(dt, mousePos));
    }
  }
}
