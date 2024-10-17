import { ctx } from "../../../init";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { PageComponents } from "../pageComponents";

export class MenuComponent extends PageComponents {
  protected image: HTMLImageElement;

  public constructor(pos: Position, dim: Dimension, imageSrc: string) {
    super(pos, dim);

    this.image = new Image();
    this.image.src = imageSrc;
  }

  public draw(): void {
    ctx.drawImage(
      this.image,
      this.pos.x,
      this.pos.y,
      this.dim.width,
      this.dim.height
    );
  }

  public update(dt: number, mousePos: Position): void {}
}
