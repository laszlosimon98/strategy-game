import { ctx } from "../../../init";
import { Position } from "../../../utils/position";
import { Text } from "./text";

export class TextImage extends Text {
  private image: HTMLImageElement;

  constructor(
    pos: Position,
    width: number,
    height: number,
    text: string,
    imageSrc: string,
    isSecret: boolean
  ) {
    super(pos, width, height, text, isSecret);

    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw(): void {
    ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
    ctx.fillText(
      this.text,
      this.pos.x + this.width / 2 - this.metrics.width / 2,
      this.pos.y +
        this.height / 2 +
        (this.metrics.actualBoundingBoxAscent +
          this.metrics.actualBoundingBoxDescent) /
          2
    );
  }
}
