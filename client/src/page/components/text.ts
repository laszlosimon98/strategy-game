import { ctx } from "@/init";
import { settings } from "@/settings";
import type { Options } from "@/types/text.types";
import { Position } from "@/utils/position";

export class Text {
  protected pos: Position;
  protected text: string;
  protected metrics: TextMetrics;

  protected isSecret: boolean;
  private color: string;
  private fontSize?: string;

  public constructor(pos: Position, text: string, options?: Options) {
    this.pos = pos;
    this.text = text;
    this.isSecret = (options && options.isSecret) || false;

    this.color = options && options.color ? options.color : settings.color.text;
    this.fontSize = options?.fontSize;

    if (this.fontSize) {
      ctx.font = `${this.fontSize} sans-serif`;
    }
    this.metrics = ctx.measureText(this.text);
  }

  public setCenter(values: {
    xFrom: number;
    xTo: number;
    yFrom: number;
    yTo: number;
  }): void {
    const { xFrom, xTo, yFrom, yTo } = values;

    this.pos.x = (xTo + xFrom) / 2 + xFrom / 2 - this.metrics.width / 2;
    this.pos.y =
      (yTo + yFrom) / 2 +
      yFrom / 2 +
      (this.metrics.actualBoundingBoxAscent -
        this.metrics.actualBoundingBoxDescent) /
        2;
  }

  public getPos(): Position {
    return this.pos;
  }

  public setPos(pos: Position): void {
    this.pos = pos;
  }

  public setText(text: string): void {
    this.text = text;

    if (this.fontSize) {
      ctx.font = `${this.fontSize} sans-serif`;
    }

    this.metrics = ctx.measureText(text);
  }

  public getText(): string {
    return this.text;
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public draw(): void {
    ctx.save();

    if (this.fontSize) {
      ctx.font = `${this.fontSize} sans-serif`;
    }

    ctx.fillStyle = this.color;
    ctx.fillText(
      !this.isSecret
        ? this.text
        : this.text.replace(
            /\w+/g,
            new Array(this.text.length).fill("*").join("")
          ),
      this.pos.x,
      this.pos.y
    );
    ctx.restore();
  }
}
