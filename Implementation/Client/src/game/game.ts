import { canvas, ctx } from "../init";
import { COLS, ROWS } from "../settings";
import { World } from "./world/world";

class Game {
  private world: World;

  constructor() {
    this.world = new World(ROWS, COLS);

    canvas.addEventListener("click", (e) => {
      const [x, y] = this.world.getCoords(e);
      this.world.setTile(x, y);
    });

    window.addEventListener("resize", () => {
      this.world.resize();
    });
  }

  draw = (): void => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.world.draw();
  };

  update = (dt: number): void => {};
}

export default Game;
