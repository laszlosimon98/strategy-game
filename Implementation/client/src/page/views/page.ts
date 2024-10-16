import { ctx } from "../../init";
import { TITLE_SIZE } from "../../settings";
import { Position } from "../../utils/position";
import { Button } from "../components/buttonComponents/button";
import { TextInput } from "../components/textComponents/textInput";
import { UI } from "../../interfaces/ui";
import { titlePos } from "./pos/titlePos";

export class Page implements UI {
  protected title: HTMLImageElement;
  protected buttons: Button[];
  protected inputs: TextInput[];
  private titlePos: Position;

  protected constructor(title: string) {
    this.titlePos = new Position(titlePos.x, titlePos.y);

    this.buttons = [];
    this.inputs = [];

    this.title = new Image();
    this.title.src = title;
  }

  public getButtons(): Button[] {
    return this.buttons;
  }

  public getInputs(): TextInput[] {
    return this.inputs;
  }

  public draw() {
    ctx.drawImage(
      this.title,
      this.titlePos.x,
      this.titlePos.y,
      TITLE_SIZE.width,
      TITLE_SIZE.height
    );

    this.buttons.map((button) => {
      button.draw();
    });
  }

  public update(): void {}

  public resize(): void {}
}
