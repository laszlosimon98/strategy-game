import { PosType } from "../../types/guiTypes";

export class GUIComponents {
  protected pos: PosType;
  protected width: number;
  protected height: number;

  protected constructor(pos: PosType, width: number, height: number) {
    this.pos = pos;
    this.width = width;
    this.height = height;
  }

  draw(): void {}

  update(): void {}

  isMouseHover(mouseX: number, mouseY: number) {
    const x = mouseX >= this.pos.x && mouseX <= this.pos.x + this.width;
    const y = mouseY >= this.pos.y && mouseY <= this.pos.y + this.height;
    return x && y;
  }
}
