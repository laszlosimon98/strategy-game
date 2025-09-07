import { LabelButton } from "@/game/menu/components/labelButton";
import { Section } from "@/game/menu/components/section";
import { ITEM_SIZE, ITEM_OFFSET } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class FoodSection extends Section {
  private farm: LabelButton;
  private mill: LabelButton;
  private bakery: LabelButton;
  private well: LabelButton;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.farm = new LabelButton(
      new Position(pos.x, pos.y),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "farm"
    );

    this.mill = new LabelButton(
      new Position(pos.x + ITEM_SIZE + ITEM_OFFSET, pos.y),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "mill"
    );

    this.bakery = new LabelButton(
      new Position(pos.x, pos.y + ITEM_SIZE),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "bakery"
    );

    this.well = new LabelButton(
      new Position(pos.x + ITEM_SIZE + ITEM_OFFSET, pos.y + ITEM_SIZE),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "well"
    );

    this.labelbuttons.push(this.farm);
    this.labelbuttons.push(this.mill);
    this.labelbuttons.push(this.bakery);
    this.labelbuttons.push(this.well);
  }

  draw(): void {
    super.draw();
  }
}
