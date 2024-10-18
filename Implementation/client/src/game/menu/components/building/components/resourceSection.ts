import { Dimension } from "../../../../../utils/dimension";
import { Position } from "../../../../../utils/position";
import { LabelButton } from "../../labelButton";
import { Section } from "../../section";

export class ResourceSection extends Section {
  private woodCutter: LabelButton;
  private stoneCutter: LabelButton;
  private sawMill: LabelButton;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.woodCutter = new LabelButton(
      new Position(pos.x, pos.y),
      Dimension.zero(),
      "",
      "woodcutter"
    );

    this.stoneCutter = new LabelButton(
      new Position(pos.x + 96 + 19, pos.y),
      Dimension.zero(),
      "",
      "stonecutter"
    );

    this.sawMill = new LabelButton(
      new Position(pos.x, pos.y + 96),
      Dimension.zero(),
      "",
      "sawmill"
    );

    this.labelbuttons.push(this.woodCutter);
    this.labelbuttons.push(this.stoneCutter);
    this.labelbuttons.push(this.sawMill);
  }

  draw(): void {
    super.draw();
  }
}
