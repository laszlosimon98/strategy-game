import { data } from "../../../data/data";
import { state } from "../../../data/state";
import { ctx } from "../../../init";
import { TEXT_COLOR } from "../../../settings";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { PageComponents } from "../pageComponents";
import { Text } from "../textComponents/text";

export class Plate extends PageComponents {
  protected image: HTMLImageElement;
  private text: Text;

  public constructor(
    pos: Position,
    dim: Dimension,
    type: "name" | "title" | "buildings" | "menu",
    text: string
  ) {
    super(pos, dim);

    this.image = new Image();

    if (type !== "buildings" && type !== "menu") {
      this.image.src = state.images.ui[type + "plate"].url;
    }

    this.text = new Text(
      pos,
      dim,
      data[state.language][text],
      false,
      TEXT_COLOR
    );

    this.text.setCenter();
  }

  public draw(): void {
    ctx.drawImage(
      this.image,
      this.pos.x,
      this.pos.y,
      this.dim.width,
      this.dim.height
    );

    this.text.draw();
  }

  public update(dt: number, mousePos: Position): void {}

  getText(): string {
    return this.text.getText();
  }

  setText(text: string): void {
    this.text.setText(text);
  }

  setImage(image: string): void {
    this.image.src = image;
  }
}
