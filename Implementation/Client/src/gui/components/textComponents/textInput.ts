import { ctx } from "../../../init";
import { textColor, bcgColor } from "../../../settings";
import { PosType } from "../../../types/guiTypes";
import { MousePos } from "../../../types/mouseTypes";
import { Text } from "./text";

export class TextInput extends Text {
  private backgroundColor: string;
  private isSelected: boolean;

  constructor(
    pos: PosType,
    width: number,
    height: number,
    text: string,
    backgroundColor: string
  ) {
    super(pos, width, height, text);

    this.backgroundColor = backgroundColor;
    this.isSelected = false;
  }

  draw(): void {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    ctx.fillStyle = textColor;
    if (this.isSelected) {
      ctx.fillText(
        "|",
        this.pos.x + this.metrics.width + 5,
        this.pos.y + this.height - 13
      );
    }

    ctx.fillStyle = bcgColor;
    super.draw();
  }

  updateText(key: string): void {
    if (key === "Backspace") {
      this.text = this.text.slice(0, this.text.length - 1);
    } else if (key.match(/^[a-zA-Z0-9]+$/) && key.length === 1) {
      this.text += key;
    }
    this.metrics = ctx.measureText(this.text);
  }

  toggleSelected(mousePos: MousePos): void {
    const x = mousePos.x > this.pos.x && mousePos.x < this.pos.x + this.width;
    const y = mousePos.y > this.pos.y && mousePos.y < this.pos.y + this.height;
    this.isSelected = x && y;
  }

  getSelected(): boolean {
    return this.isSelected;
  }

  getText(): string {
    return this.text;
  }
}
