import { ctx } from "../../init";
import { CAMERA_SPEED } from "../../settings";

type CameraCoordsType = {
  dx: number;
  dy: number;
};

class Camera {
  private x: number;
  private y: number;
  private w: number;
  private h: number;

  private key: string;
  private dir: CameraCoordsType;
  private offset: CameraCoordsType;
  private speed: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.key = "";
    this.speed = CAMERA_SPEED;
    this.dir = { dx: 0, dy: 0 };
    this.offset = { dx: 0, dy: 0 };

    window.addEventListener("keydown", (e) => {
      this.key = e.key;
    });

    window.addEventListener("keyup", () => {
      this.key = "";
      this.dir = { dx: 0, dy: 0 };
    });
  }

  getOffset = (): CameraCoordsType => {
    return this.offset;
  };

  getDir = (): CameraCoordsType => {
    return this.dir;
  };

  getDimension = (): { x: number; y: number; w: number; h: number } => {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  };

  draw = (): void => {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.stroke();
  };

  update = (): void => {
    if (this.key === "a") {
      this.dir = { dx: -1, dy: 1 };
    } else if (this.key === "d") {
      this.dir = { dx: 1, dy: -1 };
    } else if (this.key === "w") {
      this.dir = { dx: -1, dy: -1 };
    } else if (this.key === "s") {
      this.dir = { dx: 1, dy: 1 };
    }

    // if (this.key === "a") {
    //   this.dir.dx = -1;
    // } else if (this.key === "d") {
    //   this.dir.dx = 1;
    // } else if (this.key === "w") {
    //   this.dir.dy = -1;
    // } else if (this.key === "s") {
    //   this.dir.dy = 1;
    // }

    const { dx, dy } = this.dir;
    this.offset.dx += dx * this.speed;
    this.offset.dy += dy * this.speed;
  };
}

export default Camera;
