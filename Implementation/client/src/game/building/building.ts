import { ctx } from "../../init";
import { Dimension } from "../../utils/dimension";
import { Point } from "../../utils/point";

export class Building {
  private pos: Point;
  private image: HTMLImageElement;
  private boundary: Dimension;

  constructor(src: string, width: number, height: number) {
    this.pos = Point.zero();

    this.image = new Image();
    this.image.src = src;

    this.boundary = new Dimension(width, height);

    console.log(this.boundary);
  }

  draw(): void {
    ctx.drawImage(this.image, this.pos.x, this.pos.y);
    ctx.save();
    ctx.strokeStyle = "#f00";
    ctx.strokeRect(
      this.pos.x,
      this.pos.y,
      this.boundary.width,
      this.boundary.height
    );
    ctx.restore();
  }

  update(cameraScroll: Point): void {
    // if (this.boundary.width === 0 && this.boundary.height === 0) {
    //   this.boundary = new Dimension(this.image.width, this.image.height);
    // }
    // this.pos = new Point(
    //   this.pos.x + cameraScroll.x,
    //   this.pos.y + cameraScroll.y
    // );
  }

  getBoundary(): Dimension {
    return this.boundary;
  }

  setPos(pos: Point): void {
    this.pos = pos;
  }
}
