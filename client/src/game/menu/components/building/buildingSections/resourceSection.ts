import { LabelButton } from "@/game/menu/components/labelButton";
import { Section } from "@/game/menu/components/section";
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

    this.woodCutter = new LabelButton(
      new Position(pos.x, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "woodcutter"
    );

    this.sawMill = new LabelButton(
      new Position(pos.x + settings.size.item + settings.offset.item, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "sawmill"
    );

    this.stoneCutter = new LabelButton(
      new Position(pos.x, pos.y + settings.size.item),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "stonecutter"
    );

    this.forester = new LabelButton(
      new Position(
        pos.x + settings.size.item + settings.offset.item,
        pos.y + settings.size.item
      ),
      new Dimension(settings.size.item, settings.size.item),
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
