import { ctx } from "../../../init";
import { textColor } from "../../../settings";
import { PosType } from "../../../types/guiTypes";
import { GUIComponents } from "../guiComponents";

export class Text extends GUIComponents {
  protected text: string;
  protected metrics: TextMetrics;

  private isCentered: boolean;
  protected isSecret: boolean;
  private color: string;

  constructor(
    pos: PosType,
    width: number,
    height: number,
    text: string,
    isSecret: boolean,
    color?: string
  ) {
    super(pos, width, height);

    this.text = text;
    this.isSecret = isSecret;

    this.isCentered = false;
    this.metrics = ctx.measureText(this.text);

    this.color = color ? color : textColor;
  }

  setCenter(): void {
    this.isCentered = true;
  }

  setText(text: string): void {
    this.text = text;
  }

  getText(): string {
    return this.text;
  }

  draw(): void {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillText(
      !this.isSecret
        ? this.text
        : this.text.replace(
            /\w+/g,
            new Array(this.text.length).fill("*").join("")
          ),
      this.isCentered
        ? this.pos.x + this.width / 2 - this.metrics.width / 2
        : this.pos.x + 5,
      this.pos.y + this.height - 13
    );
    ctx.restore();
  }
}
