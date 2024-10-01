export class Game {
  constructor() {}

  draw(): void {}
  update(dt: number) {
    console.log("updating");
    console.warn(dt);
  }
}
