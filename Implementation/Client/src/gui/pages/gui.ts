import { Button } from "../components/button";

export class GUI {
  // EZ NEM string LESZ HANEM Image
  protected title: string;
  protected buttons: Button[];

  protected constructor(title: string) {
    this.title = title;
    this.buttons = new Array<Button>();
  }

  getButtons(): Button[] {
    return this.buttons;
  }

  clearbuttons(): void {
    this.buttons = [];
  }

  draw() {
    this.buttons.map((button) => {
      button.draw();
    });
  }
}
