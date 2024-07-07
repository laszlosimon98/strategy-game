import { canvas, canvasHeight, canvasWidth, ctx } from "../init";
import { COLS, ROWS, TILESIZE } from "../settings";
import Camera from "./camera/camera";
import { World } from "./world/world";

class Game {
  private world: World;
  private camera: Camera;

  constructor() {
    this.camera = new Camera(0, 0, canvasWidth, canvasHeight);

    this.world = new World(ROWS, COLS, this.camera);

    canvas.addEventListener("click", (e) => {
      const [x, y] = this.world.getCoords(e);
      this.world.setTile(x, y);
    });

    window.addEventListener("keydown", (e) => {
      const key = e.key;

      if (key === "a") {
        this.camera.update(-50);
        this.world.getBoard();
      } else if (key === "d") {
        this.world.getBoard();
        this.camera.update(50);
      }
    });

    window.addEventListener("resize", () => {
      this.world.resize();
    });

    window.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  draw = (): void => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.world.draw();
    this.camera.draw();
  };

  update = (dt: number): void => {};
}

export default Game;
