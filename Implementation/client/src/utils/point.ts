export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static zero(): Point {
    return new Point(0, 0);
  }

  setPoint(other: Point): void {
    this.x = other.x;
    this.y = other.y;
  }
}
