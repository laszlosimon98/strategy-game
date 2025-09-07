import { ctx } from "../../../init";
import { BACKGROUND_COLOR, TEXT_COLOR } from "../../../settings";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { Text } from "./text";

export class TextInput extends Text {
  private backgroundColor: string;
  private isSelected: boolean;

  public constructor(
    pos: Position,
    dim: Dimension,
    text: string,
    backgroundColor: string,
    isSecret: boolean
  ) {
    super(pos, dim, text, isSecret);

    this.backgroundColor = backgroundColor;
    this.isSelected = false;
  }

  public draw(): void {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);

    ctx.fillStyle = TEXT_COLOR;
    if (this.isSelected) {
      ctx.fillText(
        "|",
        this.pos.x + this.metrics.width + 5,
        this.pos.y + this.dim.height - 13
      );
    }

    ctx.fillStyle = BACKGROUND_COLOR;
    super.draw();
  }

  public updateText(key: string): void {
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

  public getText(): string {
    return this.text;
  }

  public clearText(): void {
    this.text = "";
    this.metrics = ctx.measureText("");
  }

  public setIsSelected(isSelected: boolean): void {
    this.isSelected = isSelected;
  }

  public getIsSelected(): boolean {
    return this.isSelected;
  }
}
