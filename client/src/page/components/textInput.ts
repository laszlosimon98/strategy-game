import { ctx } from "@/init";
import { Text } from "@/page/components/text";
import { settings } from "@/settings";
import type { Options } from "@/types/text.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class TextInput {
  private pos: Position;
  private text: Text;
  private dim: Dimension;
  private isSelected: boolean;
  private isSecret: boolean;

  public constructor(pos: Position, dim: Dimension, options?: Options) {
    this.pos = pos;
    this.text = new Text(pos, "");
    this.dim = dim;
    this.isSelected = false;
    this.isSecret = (options && options.isSecret) || false;
  }

  public draw(): void {
    ctx.save();
    ctx.fillStyle = settings.color.brown;
    ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);

    ctx.fillStyle = settings.color.text;

    ctx.fillText(
      !this.isSecret
        ? this.text.getText()
        : new Array(this.text.getText().length).fill("*").join(""),
      this.text.getPos().x + 8,
      this.text.getPos().y + this.dim.height - 13
    );

    if (this.isSelected) {
      ctx.fillText(
        "|",
        this.pos.x +
          (!this.isSecret
            ? ctx.measureText(this.text.getText()).width + 2
            : ctx.measureText(
                new Array(this.text.getText().length).fill("*").join("")
              ).width) +
          10,
        this.pos.y + this.dim.height - 13
      );
    }

    ctx.restore();
  }

  public isClicked(mouseX: number, mouseY: number) {
    const x = mouseX >= this.pos.x && mouseX <= this.pos.x + this.dim.width;
    const y = mouseY >= this.pos.y && mouseY <= this.pos.y + this.dim.height;
    return x && y;
  }

  public updateText(key: string): void {
    const text = this.text.getText();

    if (key === "Backspace") {
      this.text.setText(text.slice(0, text.length - 1));
    } else if (key.match(/^[a-zA-Z0-9]+$/) && key.length === 1) {
      this.text.setText(text.concat(key));
    }
    // this.metrics = ctx.measureText(
    //   !this.isSecret
    //     ? this.texts
    //     : new Array(this.text.length).fill("*").join("")
    // );
  }

  public getText(): string {
    return this.text.getText();
  }

  public clearText(): void {
    this.text.setText("");
    // this.metrics = ctx.measureText("");
  }

  public setIsSelected(isSelected: boolean): void {
    this.isSelected = isSelected;
  }

  public getIsSelected(): boolean {
    return this.isSelected;
  }
}
