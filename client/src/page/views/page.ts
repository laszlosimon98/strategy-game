import { RenderInterface } from "../../interfaces/render";
import { Dimension } from "../../utils/dimension";
import { Position } from "../../utils/position";
import { Button } from "../components/buttonComponents/button";
import { Plate } from "../components/buttonComponents/plate";
import { TextInput } from "../components/textComponents/textInput";
import { titlePos } from "./pos/titlePos";

export abstract class Page implements RenderInterface {
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
