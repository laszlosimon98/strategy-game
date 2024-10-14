import { Position } from "../../../../../utils/position";
import { LabelButton } from "../../labelButton";
import { Section } from "../../section";

export class ResourceSection extends Section {
  private woodCutter: LabelButton;
  private stoneCutter: LabelButton;

  public constructor(pos: Position, width: number, height: number) {
    super(pos, width, height);

    this.woodCutter = new LabelButton(
      new Position(pos.x, pos.y),
      0,
      0,
      "",
      "woodcutter"
    );
    this.stoneCutter = new LabelButton(
      new Position(pos.x + 96 + 19, pos.y),
      0,
      0,
      "",
      "stonecutter"
    );

    this.labelbuttons.push(this.woodCutter);
    this.labelbuttons.push(this.stoneCutter);
  }

  draw(): void {
    super.draw();
  }
}
