import { Dimension } from "../utils/dimension";
import { Position } from "../utils/position";

export interface ChangeAble {
  getPosition(): Position;
  getDimension(): Dimension;
  setPosition(pos: Position): void;
  setDimension(dim: Dimension): void;
}
