import { ctx } from "../../init";
import { PosType } from "../../types/guiTypes";
import { GUIComponents } from "./guiComponents";

export class MenuComponent extends GUIComponents {
  protected image: HTMLImageElement;

  constructor(pos: PosType, width: number, height: number, imageSrc: string) {
    super(pos, width, height);

    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {
    ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
  }
}
