import { ctx } from "../../../init";
import { Position } from "../../../utils/position";
import { PageComponents } from "../pageComponents";

export class MenuComponent extends PageComponents {
  protected image: HTMLImageElement;

  public constructor(
    pos: Position,
    width: number,
    height: number,
    imageSrc: string
  ) {
    super(pos, width, height);

    this.image = new Image();
    this.image.src = imageSrc;
  }

  public draw(): void {
    ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
  }

  public update(mousePos: Position): void {}
}
