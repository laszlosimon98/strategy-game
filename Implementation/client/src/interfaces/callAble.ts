import { Dimension } from "../utils/dimension";
import { Position } from "../utils/position";

export interface CallAble {
  getPosition(): Position;
  getDimension(): Dimension;
  setPosition(pos: Position): void;
  setDimension(dim: Dimension): void;
  setHover(state: boolean): void;
  draw(): void;
  update(dt: number, ...args: any[]): void;
}
