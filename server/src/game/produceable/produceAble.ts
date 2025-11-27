/**
 * Ősosztálya a pályán található kitermelhető nyersanyagoknak.
 * A kitermelhető mennyiéget lehet megadni.
 */
export abstract class ProduceAble {
  protected amount: number;

  protected constructor() {
    this.amount = 0;
  }

  public getAmount(): number {
    return this.amount;
  }

  /**
   * Csökkenti a mennyiséget.
   * @param by a csökkentés mennyisége
   */
  public decrease(by: number = 1): void {
    this.amount -= by;
  }
}
