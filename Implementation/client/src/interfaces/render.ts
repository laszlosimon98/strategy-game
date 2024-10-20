export interface RenderInterface {
  draw(): void;
  update(dt: number, ...args: any[]): void;
}
