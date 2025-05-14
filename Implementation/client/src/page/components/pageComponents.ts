import { Dimension } from "../../utils/dimension";
import { Position } from "../../utils/position";

export abstract class PageComponents {
  protected pos: Position;
  protected dim: Dimension;

  protected constructor(pos: Position, dim: Dimension) {
    this.pos = pos;
    this.dim = dim;
  }

  public draw(): void {}

  public update(dt: number, mousePos: Position): void {}

  public isClicked(mouseX: number, mouseY: number) {
    const x = mouseX >= this.pos.x && mouseX <= this.pos.x + this.dim.width;
    const y = mouseY >= this.pos.y && mouseY <= this.pos.y + this.dim.height;
    return x && y;
  }

  public getPos(): Position {
    return this.pos;
  }

  public setPos(pos: Position): void {
    this.pos = pos;
  }

  public getDimension(): Dimension {
    return this.dim;
  }

  public setDimension(dim: Dimension): void {
    this.dim = dim;
  }

  // public resize(): void {
  //   this.pos.resize();
  // }
}
