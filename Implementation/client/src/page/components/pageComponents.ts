import { Vector } from "../../utils/vector";

export class PageComponents {
  protected pos: Vector;
  protected width: number;
  protected height: number;

  protected constructor(pos: Vector, width: number, height: number) {
    this.pos = pos;
    this.width = width;
    this.height = height;
  }

  draw(): void {}

  update(mousePos: any): void {}

  isClicked(mouseX: number, mouseY: number) {
    const x = mouseX >= this.pos.x && mouseX <= this.pos.x + this.width;
    const y = mouseY >= this.pos.y && mouseY <= this.pos.y + this.height;
    return x && y;
  }

  getPos(): Vector {
    return this.pos;
  }

  setPos(pos: Vector) {
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
