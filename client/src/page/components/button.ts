import { ctx } from "@/init";
import { Plate } from "@/page/components/plate";
import type { ImageItemType } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class Button extends Plate {
  private func: Function[];
  protected isHovered: boolean;

  public constructor(
    pos: Position,
    dim: Dimension,
    imageProps: ImageItemType,
    text: string,
    ...fn: Function[]
  ) {
    super(pos, dim, imageProps, text);
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

  public update(dt: number, mousePos: Position) {
    this.isHovered = this.isClicked(mousePos.x, mousePos.y);
  }

  public click(): void {
    this.func.forEach((fn) => fn());
  }

  public setImage(imageSrc: string) {
    super.setImage(imageSrc);
  }

  public getImage(): string {
    return this.image.src;
  }

  public async handleAsyncFunction(): Promise<any> {}
}
