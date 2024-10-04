import { canvasWidth, ctx } from "../../../init";
import { TEXT_COLOR } from "../../../settings";
import { Point } from "../../../utils/point";
import { PageComponents } from "../pageComponents";

export class Text extends PageComponents {
  protected text: string;
  protected metrics: TextMetrics;

  private isCentered: boolean;
  protected isSecret: boolean;
  private color: string;

  constructor(
    pos: Point,
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

    this.color = color ? color : TEXT_COLOR;
  }

  setCenter(): void {
    this.isCentered = true;
  }

  setText(text: string): void {
    this.text = text;
    this.metrics = ctx.measureText(this.text);
  }

  getText(): string {
    return this.text;
  }

  setColor(color: string): void {
    this.color = color;
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
        ? this.pos.x + canvasWidth / 2 - this.metrics.width / 2
        : this.pos.x + 5,
      this.pos.y + this.height - 13
    );
    ctx.restore();
  }
}
