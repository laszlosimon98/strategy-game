import { language, type Buttons } from "@/languages/language";
import { ctx } from "@/init";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { Text } from "@/page/components/text";
import { settings } from "@/settings";
import { StateManager } from "@/manager/stateManager";
import { ClickablePageComponents } from "@/page/components/clickablePageComponent";

export class Plate extends ClickablePageComponents {
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
      this.image.src = StateManager.getImages("ui", `${type}plate`).url;
    }

    this.text = new Text(
      new Position(pos.x, pos.y),
      language[StateManager.getLanguage()].buttonTexts[text as Buttons],
      {
        color: settings.color.text,
      }
    );

    this.text.setCenter({
      xFrom: pos.x,
      xTo: dim.width,
      yFrom: pos.y,
      yTo: dim.height,
    });
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

  public getText(): string {
    return this.text.getText();
  }

  public setText(text: string): void {
    this.text.setText(text);
  }

  public setImage(image: string): void {
    this.image.src = image;
  }

  public setCenter(values: {
    xFrom: number;
    xTo: number;
    yFrom: number;
    yTo: number;
  }) {
    this.text.setCenter(values);
  }
}
