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

  public draw(): void {}

  public update(mousePos: Position): void {}

  public isClicked(mouseX: number, mouseY: number) {
    const x = mouseX >= this.pos.x && mouseX <= this.pos.x + this.width;
    const y = mouseY >= this.pos.y && mouseY <= this.pos.y + this.height;
    return x && y;
  }

  public getPos(): Position {
    return this.pos;
  }

  public setPos(pos: Position) {
    this.pos = pos;
  }

  public getWidth(): number {
    return this.width;
  }

  public setWidth(width: number): void {
    this.width = width;
  }

  public getHeight(): number {
    return this.height;
  }

  public setHeight(height: number): void {
    this.width = height;
  }

  // public resize(): void {
  //   this.pos.resize();
  // }
}
