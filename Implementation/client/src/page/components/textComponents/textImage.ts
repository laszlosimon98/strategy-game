import { ctx } from "../../../init";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { Text } from "./text";

export class TextImage extends Text {
  private image: HTMLImageElement;

  public constructor(
    pos: Position,
    dim: Dimension,
    text: string,
    imageSrc: string,
    isSecret: boolean
  ) {
    super(pos, dim, text, isSecret);

    this.image = new Image();
    this.image.src = imageSrc;
  }

  public draw(): void {
    ctx.drawImage(
      this.image,
      this.pos.x,
      this.pos.y,
      this.dim.width,
      this.dim.height
    );
    ctx.fillText(
      this.text,
      this.pos.x + this.dim.width / 2 - this.metrics.width / 2,
      this.pos.y +
        this.dim.height / 2 +
        (this.metrics.actualBoundingBoxAscent +
          this.metrics.actualBoundingBoxDescent) /
          2
    );
  }
}
