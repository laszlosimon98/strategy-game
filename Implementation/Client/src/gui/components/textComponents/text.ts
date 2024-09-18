import { ctx } from "../../../init";
import { textColor } from "../../../settings";
import { PosType } from "../../../types/guiTypes";
import { GUIComponents } from "../guiComponents";

export class Text extends GUIComponents {
  protected text: string;
  protected metrics: TextMetrics;

  private isCentered: boolean;
  protected isSecret: boolean;

  constructor(
    pos: PosType,
    width: number,
    height: number,
    text: string,
    isSecret: boolean
  ) {
    super(pos, width, height);

    this.text = text;
    this.isSecret = isSecret;

    this.isCentered = false;
    this.metrics = ctx.measureText(this.text);
  }

  setCenter(): void {
    this.isCentered = true;
  }

  draw(): void {
    ctx.fillStyle = textColor;
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
  }
}
