import { canvas, canvasHeight, canvasWidth } from "../../init";
import { Point } from "../../utils/point";

export class Camera {
  private dir: Point;
  private scroll: Point;
  private speed: number;

  constructor() {
    this.dir = Point.zero();
    this.scroll = Point.zero();
    this.speed = 25;
  }

  update(mousePos: Point): void {
    if (mousePos.x > 0 && mousePos.x < canvasWidth * 0.03) {
      this.dir.x = -1;
    } else if (
      mousePos.x > canvasWidth * 0.97 &&
      mousePos.x < canvasWidth - 1
    ) {
      this.dir.x = 1;
    } else {
      this.dir.x = 0;
    }

    if (mousePos.y > 0 && mousePos.y < canvasHeight * 0.03) {
      this.dir.y = -1;
    } else if (
      mousePos.y > canvasHeight * 0.97 &&
      mousePos.y < canvasHeight - 1
    ) {
      this.dir.y = 1;
    } else {
      this.dir.y = 0;
    }

    this.scroll.x += this.speed * this.dir.x;
    this.scroll.y += (this.speed / 2) * this.dir.y;
  }

  getCameraScroll(): Point {
    return this.scroll;
  }
}
