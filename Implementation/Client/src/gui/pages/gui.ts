import { ctx } from "../../init";
import { titleSize } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { titlePos } from "./pos/titlePos";

export class GUI {
  protected title: HTMLImageElement;
  protected buttons: Button[];

  protected constructor(title: string) {
    this.buttons = new Array<Button>();

    this.title = new Image();
    this.title.src = title;
  }

  getButtons(): Button[] {
    return this.buttons;
  }

  clearbuttons(): void {
    this.buttons = [];
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
