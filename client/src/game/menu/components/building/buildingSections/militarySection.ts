import { LabelButton } from "@/game/menu/components/labelButton";
import { Section } from "@/game/menu/components/section";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class MilitarySection extends Section {
  private ironSmelter: LabelButton;
  private weaponSmith: LabelButton;
  private toolSmith: LabelButton;
  private barracks: LabelButton;
  private guardHouse: LabelButton;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.ironSmelter = new LabelButton(
      new Position(pos.x, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "ironsmelter"
    );

    this.weaponSmith = new LabelButton(
      new Position(pos.x + settings.size.item + settings.offset.item, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "weaponsmith"
    );

    this.toolSmith = new LabelButton(
      new Position(pos.x, pos.y + settings.size.item),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "toolsmith"
    );

    this.barracks = new LabelButton(
      new Position(
        pos.x + settings.size.item + settings.offset.item,
        pos.y + settings.size.item
      ),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "barracks"
    );

    this.guardHouse = new LabelButton(
      new Position(
        pos.x,
        pos.y + settings.size.item * 2 + settings.offset.item
      ),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "guardhouse"
    );

    this.labelbuttons.push(this.ironSmelter);
    this.labelbuttons.push(this.weaponSmith);
    this.labelbuttons.push(this.toolSmith);
    this.labelbuttons.push(this.barracks);
    this.labelbuttons.push(this.guardHouse);
  }

  draw(): void {
    super.draw();
  }
}
