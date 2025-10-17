import { LabelButton } from "@/game/menu/sections/labelButton";
import { Section } from "@/game/menu/sections/section";
import { StateManager } from "@/manager/stateManager";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class MilitarySection extends Section {
  private ironSmelter: LabelButton;
  private weaponSmith: LabelButton;
  private barracks: LabelButton;
  private guardHouse: LabelButton;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
    this.drawFrame = false;

    this.ironSmelter = new LabelButton(
      new Position(pos.x, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "ironsmelter"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.weaponSmith = new LabelButton(
      new Position(pos.x + settings.size.item + settings.offset.item, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "weaponsmith"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.barracks = new LabelButton(
      new Position(pos.x, pos.y + settings.size.item),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "barracks"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.guardHouse = new LabelButton(
      new Position(
        pos.x,
        pos.y + settings.size.item * 2 + settings.offset.item
      ),
      new Dimension(settings.size.item, settings.size.item),
      StateManager.getImages("buildings", "guardhouse"),
      "empty",
      {
        hasTooltip: true,
        hasPrice: true,
        type: "house",
      }
    );

    this.labelbuttons.push(this.ironSmelter);
    this.labelbuttons.push(this.weaponSmith);
    this.labelbuttons.push(this.barracks);
    this.labelbuttons.push(this.guardHouse);
  }

  draw(): void {
    super.draw();
  }
}
