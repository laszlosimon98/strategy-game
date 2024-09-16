import { ctx } from "../../init";
import { PosType } from "../../types/guiTypes";
import { TextField } from "./textField";

export class TextFieldWithImage extends TextField {
  private text: string;
  private image: HTMLImageElement;

  constructor(
    pos: PosType,
    width: number,
    height: number,
    imageSrc: string,
    text: string
  ) {
    super(pos, width, height);

    this.text = text;
    this.image = new Image();
    this.image.src = imageSrc;

    ctx.font = "28px Arial";
  }

  draw(): void {
    ctx.beginPath();

    ctx.drawImage(this.image, this.pos.x, this.pos.y, this.width, this.height);
    ctx.fillStyle = "#DEBB59";
    ctx.fillText(
      this.text,
      this.pos.x + this.width / 2 - ctx.measureText(this.text).width / 2,
      this.pos.y + this.height / 2 + 10
    );

    ctx.closePath();
  }
}
