import { ctx } from "../../../init";
import { BACKGROUND_COLOR, TEXT_COLOR } from "../../../settings";
import { Position } from "../../../utils/position";
import { Text } from "./text";

export class TextInput extends Text {
  private backgroundColor: string;
  private isSelected: boolean;

  constructor(
    pos: Position,
    width: number,
    height: number,
    text: string,
    backgroundColor: string,
    isSecret: boolean
  ) {
    super(pos, width, height, text, isSecret);

    this.backgroundColor = backgroundColor;
    this.isSelected = false;
  }

  draw(): void {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    ctx.fillStyle = TEXT_COLOR;
    if (this.isSelected) {
      ctx.fillText(
        "|",
        this.pos.x + this.metrics.width + 5,
        this.pos.y + this.height - 13
      );
    }

    ctx.fillStyle = BACKGROUND_COLOR;
    super.draw();
  }

  updateText(key: string): void {
    if (key === "Backspace") {
      this.text = this.text.slice(0, this.text.length - 1);
    } else if (key.match(/^[a-zA-Z0-9]+$/) && key.length === 1) {
      this.text += key;
    }
    this.metrics = ctx.measureText(
      !this.isSecret
        ? this.text
        : new Array(this.text.length).fill("*").join("")
    );
  }

  getText(): string {
    return this.text;
  }

  clearText(): void {
    this.text = "";
    this.metrics = ctx.measureText("");
  }

  setIsSelected(isSelected: boolean): void {
    this.isSelected = isSelected;
  }

  getIsSelected(): boolean {
    return this.isSelected;
  }
}
