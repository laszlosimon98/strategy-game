import { StateManager } from "@/manager/stateManager";
import { TextInput } from "@/page/components/textInput";
import { settings } from "@/settings";
import type { Dimension } from "@/utils/dimension";
import type { Position } from "@/utils/position";

export class ChatInput {
  private input: TextInput;
  private isPanelVisible: boolean;

  constructor(pos: Position, dim: Dimension) {
    this.input = new TextInput(pos, dim, 0.75, { fontSize: "32px" });
    this.isPanelVisible = false;
  }

  public draw(): void {
    if (this.isPanelVisible) {
      this.input.draw();
    }
  }

  public update(dt: number, mousePos: Position, key: string): void {
    if (this.isPanelVisible) {
      this.input.update(dt, mousePos);
      if (key && this.input.getText().length < settings.chatTextLength) {
        this.input.updateText(key);
      }
    }
  }

  public toggleVisibility(key: string): void {
    switch (key) {
      case "Enter": {
        this.isPanelVisible = !this.isPanelVisible;
        this.input.clearText();
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
