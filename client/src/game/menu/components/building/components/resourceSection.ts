import { LabelButton } from "@/game/menu/components/labelButton";
import { Section } from "@/game/menu/components/section";
import { ITEM_SIZE, ITEM_OFFSET } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class ResourceSection extends Section {
  private woodCutter: LabelButton;
  private stoneCutter: LabelButton;
  private sawMill: LabelButton;
  private forester: LabelButton;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.woodCutter = new LabelButton(
      new Position(pos.x, pos.y),
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

    this.forester = new LabelButton(
      new Position(pos.x + ITEM_SIZE + ITEM_OFFSET, pos.y + ITEM_SIZE),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "forester"
    );

    this.labelbuttons.push(this.woodCutter);
    this.labelbuttons.push(this.sawMill);
    this.labelbuttons.push(this.stoneCutter);
    this.labelbuttons.push(this.forester);
  }

  draw(): void {
    super.draw();
  }
}
