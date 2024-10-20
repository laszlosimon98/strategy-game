import { ITEM_OFFSET, ITEM_SIZE } from "../../../../../settings";
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
      // Dimension.zero(),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "woodcutter"
    );

    this.sawMill = new LabelButton(
      new Position(pos.x + ITEM_SIZE + ITEM_OFFSET, pos.y),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "sawmill"
    );

    this.stoneCutter = new LabelButton(
      new Position(pos.x, pos.y + ITEM_SIZE),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "stonecutter"
    );

    this.labelbuttons.push(this.woodCutter);
    this.labelbuttons.push(this.sawMill);
    this.labelbuttons.push(this.stoneCutter);
  }

  draw(): void {
    super.draw();
  }
}
