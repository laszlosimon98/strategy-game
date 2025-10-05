import { canvasHeight, canvasWidth } from "@/init";
import { settings } from "@/settings";
import { Position } from "@/utils/position";
import { Vector } from "@/utils/vector";

export class Camera {
  private mouseDir: Vector;
  private keyboardDir: Vector;
  private scroll: Position;
  private speed: number;

  public constructor() {
    this.mouseDir = Vector.zero();
    this.keyboardDir = Vector.zero();
    this.scroll = Position.zero();
    this.speed = settings.speed.camera;
  }

  private handleCameraMovementWithKeyboard(key: string): void {
    switch (key) {
      case "ArrowLeft": {
        this.keyboardDir = new Vector(1, 0);
        break;
      }
      case "ArrowRight": {
        this.keyboardDir = new Vector(-1, 0);
        break;
      }
      case "ArrowUp": {
        this.keyboardDir = new Vector(0, 1);
        break;
      }
      case "ArrowDown": {
        this.keyboardDir = new Vector(0, -1);
        break;
      }
      case "a": {
        this.keyboardDir = new Vector(1, 0);
        break;
      }
      case "d": {
        this.keyboardDir = new Vector(-1, 0);
        break;
      }
      case "w": {
        this.keyboardDir = new Vector(0, 1);
        break;
      }
      case "s": {
        this.keyboardDir = new Vector(0, -1);
        break;
      }
      default: {
        this.keyboardDir = new Vector(0, 0);
      }
    }
  }

  private handleCameraMovementWithMouse(mousePos: Position): void {
    if (mousePos.x > 0 && mousePos.x < canvasWidth * 0.03) {
      this.mouseDir.x = 1;
    } else if (
      mousePos.x > canvasWidth * 0.97 &&
      mousePos.x < canvasWidth - 1
    ) {
      this.mouseDir.x = -1;
    } else {
      this.mouseDir.x = 0;
    }

    if (mousePos.y > 0 && mousePos.y < canvasHeight * 0.03) {
      this.mouseDir.y = 1;
    } else if (
      mousePos.y > canvasHeight * 0.97 &&
      mousePos.y < canvasHeight - 1
    ) {
      this.mouseDir.y = -1;
    } else {
      this.mouseDir.y = 0;
    }
  }

  public getScroll(): Position {
    return this.scroll;
  }

  public setScroll(scroll: Position): void {
    this.scroll = scroll;
  }

  public update(dt: number, mousePos: Position, key: string): void {
    this.handleCameraMovementWithKeyboard(key);
    // this.handleCameraMovementWithMouse(mousePos);

    const movementDir: Vector = new Vector(
      this.keyboardDir.x || this.mouseDir.x,
      this.keyboardDir.y || this.mouseDir.y
    );

    this.scroll.x += this.speed * dt * movementDir.x;
    this.scroll.y += this.speed * dt * movementDir.y;
  }
}
