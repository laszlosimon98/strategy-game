export class Dimension {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  static zero(): Dimension {
    return new Dimension(0, 0);
  }
}
