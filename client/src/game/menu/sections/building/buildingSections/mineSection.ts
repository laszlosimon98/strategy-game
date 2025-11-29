import { LabelButton } from "@/game/menu/sections/labelButton";
import { Section } from "@/game/menu/sections/section";
import { StateManager } from "@/manager/stateManager";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

/**
 * Bányákhoz kapcsolódó épületek listáját tartalmazó menüszekció.
 */
export class MineSection extends Section {
  private coalMine: LabelButton;
  private ironMine: LabelButton;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
    this.drawFrame = false;

    this.coalMine = new LabelButton(
      new Position(pos.x, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "coalmine"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.ironMine = new LabelButton(
      new Position(pos.x + settings.size.item + settings.offset.item, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "ironmine"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.labelbuttons.push(this.coalMine);
    this.labelbuttons.push(this.ironMine);
  }

  draw(): void {
    super.draw();
  }
}
