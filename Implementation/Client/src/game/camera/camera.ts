import { ctx } from "../../init";

class Camera {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw = (): void => {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.stroke();
  };

  update = (dt: number): void => {
    this.x += dt;
  };
}

export default Camera;
