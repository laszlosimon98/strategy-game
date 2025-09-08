import { Button } from "@/page/components/button";
import { Plate } from "@/page/components/plate";
import { TextInput } from "@/page/components/textInput";
import { titlePos } from "@/page/views/pos/titlePos";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export abstract class Page {
  protected buttons: Button[];
  protected inputs: TextInput[];
  private titlePos: Position;

  private plate: Plate;

  protected constructor(title: string) {
    this.titlePos = new Position(titlePos.x, titlePos.y);

    this.plate = new Plate(
      this.titlePos,
      new Dimension(288, 90),
      "title",
      title
    );

    this.buttons = [];
    this.inputs = [];
  }

  public getButtons(): Button[] {
    return this.buttons;
  }

  public getInputs(): TextInput[] {
    return this.inputs;
  }

  public draw() {
    this.plate.draw();

    this.buttons.map((button) => {
      button.draw();
    });
  }

  public update(): void {}

  public resize(): void {}
}
