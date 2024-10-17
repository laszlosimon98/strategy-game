import { Dimension } from "../utils/dimension";
import { Position } from "../utils/position";

export interface MouseIntersect {
  getPosition(): Position;
  getDimension(): Dimension;
}
