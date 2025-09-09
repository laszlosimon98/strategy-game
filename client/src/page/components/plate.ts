import { data } from "@/languages/language";
import { ctx } from "@/init";
import { PageComponents } from "@/page/components/pageComponents";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { Text } from "@/page/components/text";
import { settings } from "@/settings";
import { GameStateManager } from "@/manager/gameStateManager";

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

    this.image = new Image(dim.width, dim.height);

    if (type !== "buildings" && type !== "menu") {
      this.image.src = GameStateManager.getUIUrl(type + "plate");
    }

    this.text = new Text(
      pos,
      dim,
      data[GameStateManager.getLanguage()][text],
      false,
      settings.color.text
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
