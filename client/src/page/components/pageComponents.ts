import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

/**
 * Egy olyan komponens amiből származnak az oldalakat felépítő komponensek.
 * Alapvető getter-t és setter-t tartalmazz.
 */
export abstract class PageComponents {
  protected pos: Position;
  protected dim: Dimension;

  protected constructor(pos: Position, dim: Dimension) {
    this.pos = pos;
    this.dim = dim;
  }

  public draw(): void {}

  public update(dt: number, mousePos: Position, key?: string): void {}

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
}
