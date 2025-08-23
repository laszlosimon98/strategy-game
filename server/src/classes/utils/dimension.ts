export class Dimension {
  public width: number;
  public height: number;

  public constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public static zero(): Dimension {
    return new Dimension(0, 0);
  }
}
