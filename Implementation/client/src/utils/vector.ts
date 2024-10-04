import { TILE_SIZE } from "../settings";
import { Point } from "./point";

export class Vector extends Point {
  constructor(x: number, y: number) {
    super(x, y);
  }

  static zero(): Vector {
    return new Vector(0, 0);
  }

  setVector(other: Vector): void {
    this.x = other.x;
    this.y = other.y;
  }

  getNormalCoords = (): Point[] => {
    return [
      new Point(this.x * TILE_SIZE, this.y * TILE_SIZE),
      new Point(this.x * TILE_SIZE + TILE_SIZE, this.y * TILE_SIZE),
      new Point(this.x * TILE_SIZE + TILE_SIZE, this.y * TILE_SIZE + TILE_SIZE),
      new Point(this.x * TILE_SIZE, this.y * TILE_SIZE + TILE_SIZE),
    ];
  };

  getIsometricCoords = (): Point[] => {
    return this.getNormalCoords().map(
      (vector) => new Point(vector.x - vector.y, (vector.x + vector.y) / 2)
    );
  };
}
