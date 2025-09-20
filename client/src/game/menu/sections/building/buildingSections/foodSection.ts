import { LabelButton } from "@/game/menu/sections/labelButton";
import { Section } from "@/game/menu/sections/section";
import { settings } from "@/settings";
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
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "farm"
    );

    this.mill = new LabelButton(
      new Position(pos.x + settings.size.item + settings.offset.item, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "mill"
    );

    this.bakery = new LabelButton(
      new Position(pos.x, pos.y + settings.size.item),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "bakery"
    );

    this.well = new LabelButton(
      new Position(
        pos.x + settings.size.item + settings.offset.item,
        pos.y + settings.size.item
      ),
      new Dimension(settings.size.item, settings.size.item),
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
