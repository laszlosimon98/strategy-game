import { Position } from "../../utils/position";

export class PageComponents {
  protected pos: Position;
  protected width: number;
  protected height: number;

  protected constructor(pos: Position, width: number, height: number) {
    this.pos = pos;
    this.width = width;
    this.height = height;
  }

  draw(): void {}

  update(mousePos: Position): void {}

  isClicked(mouseX: number, mouseY: number) {
    const x = mouseX >= this.pos.x && mouseX <= this.pos.x + this.width;
    const y = mouseY >= this.pos.y && mouseY <= this.pos.y + this.height;
    return x && y;
  }

  getPos(): Position {
    return this.pos;
  }

  setPos(pos: Position) {
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
