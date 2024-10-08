import { ctx } from "../../../init";
import { Position } from "../../../utils/position";
import { MenuComponent } from "./menuComponent";

export class Button extends MenuComponent {
  private func: Function[];

  private isHovered: boolean;

  constructor(
    pos: Position,
    width: number,
    height: number,
    imageSrc: string,
    ...fn: Function[]
  ) {
    super(pos, width, height, imageSrc);
    this.func = fn;

    this.isHovered = false;
  }

  draw(): void {
    ctx.save();
    if (this.isHovered) {
      ctx.globalAlpha = 0.8;
    }
    super.draw();
    ctx.restore();
  }

  update(mousePos: Position) {
    this.isHovered = this.isClicked(mousePos.x, mousePos.y);
  }

  click(): void {
    this.func.forEach((fn) => fn());
  }

  setImage(imageSrc: string) {
    this.image.src = imageSrc;
  }

  getImage(): string {
    return this.image.src;
  }

  async handleError(): Promise<any> {}
}
