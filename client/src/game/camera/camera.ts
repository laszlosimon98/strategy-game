import { CAMERA_SPEED } from "@/game/settings";
import { Position } from "@/game/utils/position";
import { Vector } from "@/game/utils/vector";

export class Camera {
  private dir: Vector;
  private scroll: Position;
  private speed: number;

  public constructor() {
    this.dir = Vector.zero();
    this.scroll = Position.zero();
    this.speed = CAMERA_SPEED;
  }

  public getScroll(): Position {
    return this.scroll;
  }

  public setScroll(scroll: Position): void {
    this.scroll = scroll;
  }

  public update(dt: number, mousePos: Position, key: string): void {
    switch (key) {
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
