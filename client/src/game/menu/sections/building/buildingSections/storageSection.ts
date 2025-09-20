import { LabelButton } from "@/game/menu/sections/labelButton";
import { Section } from "@/game/menu/sections/section";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class StorageSection extends Section {
  private storage: LabelButton;
  private residence: LabelButton;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.storage = new LabelButton(
      new Position(pos.x, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "storage"
    );

    this.residence = new LabelButton(
      new Position(pos.x + settings.size.item + settings.offset.item, pos.y),
      new Dimension(settings.size.item, settings.size.item),
      "buildings",
      "empty",
      "residence"
    );

    this.labelbuttons.push(this.storage);
    this.labelbuttons.push(this.residence);
  }

  draw(): void {
    super.draw();
  }
}
