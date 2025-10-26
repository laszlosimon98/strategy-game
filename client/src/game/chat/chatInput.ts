import { StateManager } from "@/manager/stateManager";
import { TextInput } from "@/page/components/textInput";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";
import type { Dimension } from "@/utils/dimension";
import type { Position } from "@/utils/position";

export class ChatInput extends TextInput {
  private isPanelVisible: boolean;

  constructor(pos: Position, dim: Dimension) {
    super(pos, dim, 0.75, { fontSize: "32px" });
    this.isPanelVisible = false;
  }

  public draw(): void {
    if (this.isPanelVisible) {
      super.draw();
    }
  }

  public update(dt: number, mousePos: Position, key: string): void {
    if (this.isPanelVisible) {
      super.update(dt, mousePos);
      if (
        key &&
        (super.getText().length < settings.chatTextLength ||
          key === "Backspace")
      ) {
        console.log(key);
        super.updateText(key);
      }
    }
  }

  public toggleVisibility(key: string): void {
    switch (key) {
      case "Enter": {
        if (super.getText().trim().length > 0) {
          this.sendMessage();
        }

        this.isPanelVisible = !this.isPanelVisible;
        super.clearText();
        break;
      }

      case "Escape": {
        this.isPanelVisible = false;
        break;
      }
    }
    StateManager.setChatState(this.isPanelVisible);
  }

  private sendMessage(): void {
    ServerHandler.sendMessage("chat:message", {
      message: super.getText(),
      name: StateManager.getPlayerName(),
      color: StateManager.getPlayerColor(ServerHandler.getId()),
    });
  }
}
