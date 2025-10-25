import { StateManager } from "@/manager/stateManager";
import { TextInput } from "@/page/components/textInput";
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
      if (super.getText().length < settings.chatTextLength) {
        super.updateText(key);
      }
    }
  }

  public toggleVisibility(key: string): void {
    switch (key) {
      case "Enter": {
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
}
