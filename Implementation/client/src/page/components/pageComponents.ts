import { Point } from "../../utils/point";

export class PageComponents {
  protected pos: Point;
  protected width: number;
  protected height: number;

  protected constructor(pos: Point, width: number, height: number) {
    this.pos = pos;
    this.width = width;
    this.height = height;
  }

  draw(): void {}

  update(mousePos: Point): void {}

  isClicked(mouseX: number, mouseY: number) {
    const x = mouseX >= this.pos.x && mouseX <= this.pos.x + this.width;
    const y = mouseY >= this.pos.y && mouseY <= this.pos.y + this.height;
    return x && y;
  }

  getPos(): Point {
    return this.pos;
  }

  setPos(pos: Point) {
    this.pos = pos;
  }

  getWidth(): number {
    return this.width;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  getHeight(): number {
    return this.height;
  }

  setHeight(height: number): void {
    this.width = height;
  }

  // resize(): void {
  //   this.pos.resize();
  // }
}
