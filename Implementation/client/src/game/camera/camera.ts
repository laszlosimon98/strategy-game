import { canvasHeight, canvasWidth, ctx } from "../../init";
import { Position } from "../../utils/position";
import { Vector } from "../../utils/vector";

export class Camera {
  private dir: Vector;
  private scroll: Position;
  private speed: number;

  public constructor() {
    this.dir = Vector.zero();
    this.scroll = Position.zero();
    // this.scroll = scrollPosition;
    this.speed = 500;
  }

  public getScroll(): Position {
    return this.scroll;
  }

  public setScroll(scroll: Position): void {
    this.scroll = scroll;
  }

  public update(dt: number, mousePos: Position, key: string): void {
    // if (mousePos.x > 0 && mousePos.x < canvasWidth * 0.03) {
    //   this.dir.x = -1;
    // } else if (
    //   mousePos.x > canvasWidth * 0.97 &&
    //   mousePos.x < canvasWidth - 1
    // ) {
    //   this.dir.x = 1;
    // } else {
    //   this.dir.x = 0;
    // }

    // if (mousePos.y > 0 && mousePos.y < canvasHeight * 0.03) {
    //   this.dir.y = -1;
    // } else if (
    //   mousePos.y > canvasHeight * 0.97 &&
    //   mousePos.y < canvasHeight - 1
    // ) {
    //   this.dir.y = 1;
    // } else {
    //   this.dir.y = 0;
    // }

    switch (key) {
      // case "ArrowLeft": {
      //   this.dir = new Vector(1, 0);
      //   break;
      // }
      // case "ArrowRight": {
      //   this.dir = new Vector(-1, 0);
      //   break;
      // }
      // case "ArrowUp": {
      //   this.dir = new Vector(0, 1);
      //   break;
      // }
      // case "ArrowDown": {
      //   this.dir = new Vector(0, -1);
      //   break;
      // }
      case "a": {
        this.dir = new Vector(1, 0);
        break;
      }
      case "d": {
        this.dir = new Vector(-1, 0);
        break;
      }
      case "w": {
        this.dir = new Vector(0, 1);
        break;
      }
      case "s": {
        this.dir = new Vector(0, -1);
        break;
      }
      default: {
        this.dir = new Vector(0, 0);
      }
    }

    this.scroll.x += this.speed * dt * this.dir.x;
    this.scroll.y += this.speed * dt * this.dir.y;
  }
}
