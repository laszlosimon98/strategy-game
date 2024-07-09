import { canvas, canvasHeight, canvasWidth, ctx } from "../init";
import { CAMERA_SPEED, COLS, ROWS } from "../settings";
import Camera from "./camera/camera";
import { MouseButtons } from "./utils/mouseButtons";
import { World } from "./world/world";
import tower from "../assets/tower.png";
import sawmill from "../assets/sawmill.png";
import stonecutter from "../assets/stonecutter.png";
import woodcutter from "../assets/woodcutter.png";
import { CoordsType } from "../types/coordsType";

type CameraCoordsType = {
  x: number;
  y: number;
};

const CameraCoordsInit = {
  x: 0,
  y: 0,
};

export const offset = { ...CameraCoordsInit };

class Game {
  private world: World;
  private camera: Camera;

  private mouseIsHold: boolean;

  private key: string;
  private dir: CameraCoordsType;
  private client: CameraCoordsType;

  private tile: string;
  private board;

  private buildings: {
    pos: CoordsType;
    image: HTMLImageElement;
  }[];

  constructor() {
    this.camera = new Camera(0, 0, canvasWidth, canvasHeight);
    this.world = new World(ROWS, COLS, this.camera);

    this.key = "";
    this.mouseIsHold = false;
    this.dir = { ...CameraCoordsInit };
    this.client = { ...CameraCoordsInit };

    this.board = this.world.getBoard();
    this.buildings = [];
    this.tile = "";

    window.addEventListener("click", (e) => {
      const [x, y] = this.world.getCoords(e);
      this.world.setTile(x, y);

      const building = {
        pos: this.board[x][y].getBuildingPos(),
        image: new Image(),
      };

      building.image.src = this.tile;
      this.buildings.push(building);
    });

    window.addEventListener("keypress", (e) => {
      switch (e.key) {
        case "1":
          this.tile = tower;
          break;
        case "2":
          this.tile = sawmill;
          break;
        case "3":
          this.tile = stonecutter;
          break;
        case "4":
          this.tile = woodcutter;
          break;
        default:
          this.tile = tower;
          break;
      }
    });

    // window.addEventListener("mousedown", (e) => {
    //   if (MouseButtons.LEFT === e.button) {
    //     //
    //   } else if (MouseButtons.MIDDLE === e.button) {
    //     //
    //   } else if (MouseButtons.RIGHT === e.button) {
    //     this.mouseIsHold = true;
    //     this.client = { ...this.client, x: e.clientX, y: e.clientY };
    //   }
    // });

    // window.addEventListener("mousemove", (e) => {
    //   if (this.mouseIsHold) {
    //     if (e.clientX > this.client.x) {
    //       this.dir.x = 1;
    //     } else if (e.clientX < this.client.x) {
    //       this.dir.x = -1;
    //     } else {
    //       this.dir.x = 0;
    //     }

    //     if (e.clientY > this.client.y) {
    //       this.dir.y = 1;
    //     } else if (e.clientY < this.client.y) {
    //       this.dir.y = -1;
    //     } else {
    //       this.dir.y = 0;
    //     }
    //   }
    // });

    // window.addEventListener("mouseup", (e) => {
    //   // console.log(e);
    //   this.mouseIsHold = false;
    // });

    // window.addEventListener("keydown", (e) => {
    //   this.key = e.key;

    //   if (this.key === "a") {
    //     this.dir = { x: -1, y: 1 };
    //     offset.x -= CAMERA_SPEED;
    //   } else if (this.key === "d") {
    //     this.dir = { x: 1, y: -1 };
    //     offset.x += CAMERA_SPEED;
    //   } else if (this.key === "w") {
    //     this.dir = { x: -1, y: -1 };
    //     offset.y += CAMERA_SPEED;
    //   } else if (this.key === "s") {
    //     this.dir = { x: 1, y: 1 };
    //     offset.y -= CAMERA_SPEED;
    //   }
    // });

    // window.addEventListener("keyup", (e) => {
    //   this.key = "";
    //   this.dir = { x: 0, y: 0 };
    // });

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

  update = (dt: number): void => {
    // if (this.mouseIsHold || this.key !== "") {
    //   this.world.update(dt, this.dir);
    // }

    this.camera.update();
    this.world.update(dt);

    this.buildings.map((building) => {
      ctx.drawImage(building.image, ...building.pos);
    });
  };
}

export default Game;
