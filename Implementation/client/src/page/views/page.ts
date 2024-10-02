import { canvasHeight, canvasWidth, ctx } from "../../init";
import { TITLE_SIZE } from "../../settings";
import { Vector } from "../../utils/vector";
import { Button } from "../components/buttonComponents/button";
import { TextInput } from "../components/textComponents/textInput";
import { titlePos } from "./pos/titlePos";

export class Page {
  protected title: HTMLImageElement;
  protected buttons: Button[];
  protected inputs: TextInput[];
  private titlePos: Vector;

  protected constructor(title: string) {
    this.titlePos = new Vector(titlePos.x, titlePos.y);

    this.buttons = new Array<Button>();
    this.inputs = new Array<TextInput>();

    this.title = new Image();
    this.title.src = title;
  }

  getButtons(): Button[] {
    return this.buttons;
  }

  getInputs(): TextInput[] {
    return this.inputs;
  }

  draw() {
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

  update(): void {}

  resize(): void {
    this.titlePos.resize(
      new Vector(canvasWidth / 2 - TITLE_SIZE.width / 2, canvasHeight / 15)
    );
    // this.buttons.forEach((button) => button.resize());
    // this.inputs.forEach((input) => input.resize());
  }
}
