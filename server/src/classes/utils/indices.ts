export class Indices {
  i: number;
  j: number;

  constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
  }

  static zero(): Indices {
    return new Indices(0, 0);
  }

  setIndices(other: Indices): void {
    this.i = other.i;
    this.j = other.j;
  }
}
