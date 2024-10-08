import { TILE_SIZE } from "../settings";
import { Position } from "./position";

export class Vector extends Position {
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

  getNormalCoords = (): Position[] => {
    return [
      new Position(this.x * TILE_SIZE, this.y * TILE_SIZE),
      new Position(this.x * TILE_SIZE + TILE_SIZE, this.y * TILE_SIZE),
      new Position(
        this.x * TILE_SIZE + TILE_SIZE,
        this.y * TILE_SIZE + TILE_SIZE
      ),
      new Position(this.x * TILE_SIZE, this.y * TILE_SIZE + TILE_SIZE),
    ];
  };

  getIsometricCoords = (): Position[] => {
    return this.getNormalCoords().map(
      (vector) => new Position(vector.x - vector.y, (vector.x + vector.y) / 2)
    );
  };
}
