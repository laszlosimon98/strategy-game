import { ctx } from "../../init";
import { titleSize } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { TextInput } from "../components/textComponents/textInput";
import { titlePos } from "./pos/titlePos";

export class GUI {
  protected title: HTMLImageElement;
  protected buttons: Button[];
  protected inputs: TextInput[];

  protected constructor(title: string) {
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
      titlePos.x,
      titlePos.y,
      titleSize.width,
      titleSize.height
    );

    this.buttons.map((button) => {
      button.draw();
    });
  }
}
