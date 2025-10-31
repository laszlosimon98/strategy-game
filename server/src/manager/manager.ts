export class Manager {
  protected constructor() {}

  protected static creator<T>(
    Creator: new (...args: any[]) => T,
    ...args: ConstructorParameters<typeof Creator>
  ): T {
    return new Creator(...args);
  }
}
