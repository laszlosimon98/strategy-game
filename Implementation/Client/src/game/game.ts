import { canvas, canvasHeight, canvasWidth, ctx } from "../init";
import { COLS, ROWS } from "../settings";
import Camera from "./camera/camera";
import { MouseButtons } from "./utils/mouseButtons";
import { World } from "./world/world";

class Game {
  private world: World;
  private camera: Camera;

  private mouseIsHold: boolean;

  private key: string;
  private dir: { x: number; y: number };
  private client: { x: number; y: number };

  constructor() {
    this.camera = new Camera(0, 0, canvasWidth, canvasHeight);

    this.world = new World(ROWS, COLS, this.camera);

    this.key = "";
    this.mouseIsHold = false;
    this.dir = { x: 0, y: 0 };
    this.client = { x: 0, y: 0 };

    window.addEventListener("click", (e) => {
      const [x, y] = this.world.getCoords(e);
      this.world.setTile(x, y);
    });

    window.addEventListener("mousedown", (e) => {
      if (MouseButtons.LEFT === e.button) {
        //
      } else if (MouseButtons.MIDDLE === e.button) {
        //
      } else if (MouseButtons.RIGHT === e.button) {
        this.mouseIsHold = true;
        this.client = { ...this.client, x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (this.mouseIsHold) {
        if (e.clientX > this.client.x) {
          this.dir.x = 1;
        } else if (e.clientX < this.client.x) {
          this.dir.x = -1;
        } else {
          this.dir.x = 0;
        }

        if (e.clientY > this.client.y) {
          this.dir.y = 1;
        } else if (e.clientY < this.client.y) {
          this.dir.y = -1;
        } else {
          this.dir.y = 0;
        }
      }
    });

    window.addEventListener("mouseup", (e) => {
      // console.log(e);
      this.mouseIsHold = false;
    });

    window.addEventListener("keydown", (e) => {
      this.key = e.key;
      if (this.key === "a") {
        this.dir.x = 1;
      } else if (this.key === "d") {
        this.dir.x = -1;
      } else if (this.key === "w") {
        this.dir.y = 1;
      } else if (this.key === "s") {
        this.dir.y = -1;
      }
    });

    window.addEventListener("keyup", (e) => {
      this.key = "";
      this.dir.x = 0;
      this.dir.y = 0;
    });

    window.addEventListener("resize", () => {
      this.world.resize();
    });

    window.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  draw = (): void => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.world.draw();
    // this.camera.draw();
  };

  update = (dt: number): void => {
    if (this.mouseIsHold || this.key !== "") {
      this.world.update(dt, this.dir);
    }
  };
}

export default Game;
