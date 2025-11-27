/**
 * Indexeket meghatározó osztály
 */
export class Indices {
  i: number;
  j: number;

  public constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
  }

  public static zero(): Indices {
    return new Indices(0, 0);
  }

  public setIndices(other: Indices): void {
    this.i = other.i;
    this.j = other.j;
  }

  public equal(other: Indices): boolean {
    return this.i === other.i && this.j === other.j;
  }
}
