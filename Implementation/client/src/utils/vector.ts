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

  public mult(num: number): Vector {
    return new Vector(this.x * num, this.y * num);
  }

  public div(num: number): Vector {
    return new Vector(this.x / num, this.y / num);
  }

  public magnitude(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  public normalize(): Vector {
    const m = this.magnitude();

    if (m > 0) {
      return this.div(m);
    }

    return Vector.zero();
  }
}
