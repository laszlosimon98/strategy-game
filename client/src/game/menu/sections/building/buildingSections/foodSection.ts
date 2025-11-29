import { LabelButton } from "@/game/menu/sections/labelButton";
import { Section } from "@/game/menu/sections/section";
import { StateManager } from "@/manager/stateManager";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

/**
 * Élelmiszerhez kapcsolódó épületek listáját tartalmazó menüszekció.
 */
export class FoodSection extends Section {
  private farm: LabelButton;
  private mill: LabelButton;
  private bakery: LabelButton;
  private well: LabelButton;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
    this.drawFrame = false;

    this.farm = new LabelButton(
      new Position(pos.x, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "farm"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.mill = new LabelButton(
      new Position(pos.x + settings.size.item + settings.offset.item, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "mill"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.bakery = new LabelButton(
      new Position(pos.x, pos.y + settings.size.item),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "bakery"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.well = new LabelButton(
      new Position(
        pos.x + settings.size.item + settings.offset.item,
        pos.y + settings.size.item
      ),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "well"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
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
