import { ctx } from "../../../init";
import { Position } from "../../../utils/position";
import { MenuComponent } from "./menuComponent";

export class Button extends MenuComponent {
  private func: Function[];
  protected isHovered: boolean;

  public constructor(
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

  public draw(): void {
    ctx.save();
    if (this.isHovered) {
      ctx.globalAlpha = 0.8;
    }
    super.draw();
    ctx.restore();
  }

  public update(mousePos: Position) {
    this.isHovered = this.isClicked(mousePos.x, mousePos.y);
  }

  public click(): void {
    this.func.forEach((fn) => fn());
  }

  public setImage(imageSrc: string) {
    this.image.src = imageSrc;
  }

  public getImage(): string {
    return this.image.src;
  }

  public async handleError(): Promise<any> {}
}
