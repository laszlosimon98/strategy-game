import { ctx } from "../../../init";
import { Vector } from "../../../utils/vector";
import { PageComponents } from "../pageComponents";

export class MenuComponent extends PageComponents {
  protected image: HTMLImageElement;

  constructor(pos: Vector, width: number, height: number, imageSrc: string) {
    super(pos, width, height);

    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw(): void {
    ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
  }
}
