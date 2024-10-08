export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static zero(): Position {
    return new Position(0, 0);
  }

  setPosition(other: Position): void {
    this.x = other.x;
    this.y = other.y;
  }
}
