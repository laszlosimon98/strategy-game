import { ctx } from "../../../init";
import { PosType } from "../../../types/guiTypes";
import { MenuComponent } from "./menuComponent";

export class Button extends MenuComponent {
  private func: Function[];

  private isHovered: boolean;

  constructor(
    pos: PosType,
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

  update(mousePos: any) {
    const { x, y } = mousePos;
    this.isHovered = this.isClicked(x, y);
  }

  click(): void {
    this.func.forEach((fn) => fn());
  }

  setImage(imageSrc: string) {
    this.image.src = imageSrc;
  }

  async handleError(): Promise<any> {}
}
