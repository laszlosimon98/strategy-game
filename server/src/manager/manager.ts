export abstract class Manager {
  protected constructor() {}

  /**
   * Generátor segédmetódus
   * @param Creator tetszőleges konstruktor
   * @param args konstruktor paraméterek
   * @returns generikus objektum
   */
  protected static creator<T>(
    Creator: new (...args: any[]) => T,
    ...args: ConstructorParameters<typeof Creator>
  ): T {
    return new Creator(...args);
  }
}
