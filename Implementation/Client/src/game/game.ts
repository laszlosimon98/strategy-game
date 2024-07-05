import { ctx } from "../init";
import { COLS, ROWS } from "../settings";
import { World } from "./world/world";

class Game {
  private world: World;

  constructor() {
    this.world = new World(ROWS, COLS);
  }

  draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.world.draw();
  };

  update = (dt: number) => {};
}

export default Game;
