import { TILE_SIZE } from "../settings";
import { Position } from "./position";

export class Vector extends Position {
  public constructor(x: number, y: number) {
    super(x, y);
  }

  public static zero(): Vector {
    return new Vector(0, 0);
  }

  public setVector(other: Vector): void {
    this.x = other.x;
    this.y = other.y;
  }

  public getNormalPos(): Position[] {
    return [
      new Position(this.x * TILE_SIZE, this.y * TILE_SIZE),
      new Position(this.x * TILE_SIZE + TILE_SIZE, this.y * TILE_SIZE),
      new Position(
        this.x * TILE_SIZE + TILE_SIZE,
        this.y * TILE_SIZE + TILE_SIZE
      ),
      new Position(this.x * TILE_SIZE, this.y * TILE_SIZE + TILE_SIZE),
    ];
  }

  public getIsometricPos(): Position[] {
    return this.getNormalPos().map(
      (vector) => new Position(vector.x - vector.y, (vector.x + vector.y) / 2)
    );
  }
}
