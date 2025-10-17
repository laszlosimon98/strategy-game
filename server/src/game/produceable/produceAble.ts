export abstract class ProduceAble {
  protected amount: number;

  protected constructor() {
    this.amount = 0;
  }

  public getAmount(): number {
    return this.amount;
  }

  public decrease(by: number = 1): void {
    this.amount -= by;
  }
}
