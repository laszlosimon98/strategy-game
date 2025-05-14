export class Position {
  public x: number;
  public y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static zero(): Position {
    return new Position(0, 0);
  }

  public setPosition(other: Position): void {
    this.x = other.x;
    this.y = other.y;
  }

  public add(other: Position): Position {
    return new Position(this.x + other.x, this.y + other.y);
  }

  public sub(other: Position): Position {
    return new Position(this.x - other.x, this.y - other.y);
  }
}
