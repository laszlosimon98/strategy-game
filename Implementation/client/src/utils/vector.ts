import { canvasWidth } from "../init";

export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static zero(): Vector {
    return new Vector(0, 0);
  }

  setVector(other: Vector): void {
    this.x = other.x;
    this.y = other.y;
  }

  updatePos(): void {
    console.log(canvasWidth);
  }

  resize(other: Vector): void {
    this.setVector(other);
  }
}
