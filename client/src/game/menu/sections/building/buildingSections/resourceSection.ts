import { LabelButton } from "@/game/menu/sections/labelButton";
import { Section } from "@/game/menu/sections/section";
import { StateManager } from "@/manager/stateManager";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class ResourceSection extends Section {
  private woodCutter: LabelButton;
  private stoneCutter: LabelButton;
  private sawMill: LabelButton;
  private forester: LabelButton;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
    this.drawFrame = false;

    this.woodCutter = new LabelButton(
      new Position(pos.x, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "woodcutter"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.sawMill = new LabelButton(
      new Position(pos.x + settings.size.item + settings.offset.item, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "sawmill"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.stoneCutter = new LabelButton(
      new Position(pos.x, pos.y + settings.size.item),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "stonecutter"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.forester = new LabelButton(
      new Position(
        pos.x + settings.size.item + settings.offset.item,
        pos.y + settings.size.item
      ),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "forester"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
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
