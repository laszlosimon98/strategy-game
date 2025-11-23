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

  private handleCameraMovementWithKeyboard(key: string): void {
    const lowerKey: string = key.toLocaleLowerCase();

    const directions: Record<string, Vector> = {
      arrowleft: new Vector(1, 0),
      arrowright: new Vector(-1, 0),
      arrowup: new Vector(0, 1),
      arrowdown: new Vector(0, -1),
      a: new Vector(1, 0),
      d: new Vector(-1, 0),
      w: new Vector(0, 1),
      s: new Vector(0, -1),
    };

    if (lowerKey in directions) {
      this.keyboardDir = directions[lowerKey];
    } else {
      this.keyboardDir = Vector.zero();
    }
  }

  private handleCameraMovementWithMouse(mousePos: Position): void {
    if (mousePos.x > 0 && mousePos.x < canvasWidth * 0.05) {
      this.mouseDir.x = 1;
    } else if (
      mousePos.x > canvasWidth * 0.95 &&
      mousePos.x < canvasWidth - 1
    ) {
      this.mouseDir.x = -1;
    } else {
      this.mouseDir.x = 0;
    }

    if (mousePos.y > 0 && mousePos.y < canvasHeight * 0.05) {
      this.mouseDir.y = 1;
    } else if (
      mousePos.y > canvasHeight * 0.95 &&
      mousePos.y < canvasHeight - 1
    ) {
      this.mouseDir.y = -1;
    } else {
      this.mouseDir.y = 0;
    }
  }
}
