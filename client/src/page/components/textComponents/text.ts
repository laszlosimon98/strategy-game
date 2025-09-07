import { ctx } from "@/init";
import { PageComponents } from "@/page/components/pageComponents";
import { TEXT_COLOR } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class Text extends PageComponents {
  protected text: string;
  protected metrics: TextMetrics;

  private isCentered: boolean;
  protected isSecret: boolean;
  private color: string;

  public constructor(
    pos: Position,
    dim: Dimension,
    text: string,
    isSecret: boolean,
    color?: string
  ) {
    super(pos, dim);

    this.text = text;
    this.isSecret = isSecret;

    this.isCentered = false;
    this.metrics = ctx.measureText(this.text);

    this.color = color ? color : TEXT_COLOR;
  }

  public setCenter(): void {
    this.isCentered = true;
  }

  public setText(text: string): void {
    this.text = text;
    this.metrics = ctx.measureText(this.text);
  }

  public getText(): string {
    return this.text;
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public draw(): void {
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
        ? this.pos.x + this.dim.width / 2 - this.metrics.width / 2
        : this.pos.x + 5,

      this.pos.y +
        this.dim.height / 2 +
        (this.metrics.actualBoundingBoxAscent -
          this.metrics.actualBoundingBoxDescent) /
          2
    );
    ctx.restore();
  }
}
