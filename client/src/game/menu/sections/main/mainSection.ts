import { LabelButton } from "@/game/menu/sections/labelButton";
import { Section } from "@/game/menu/sections/section";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class MainSection extends Section {
  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.buttons.push(
      new LabelButton(
        new Position(
          dim.width / 6 - settings.size.menuItem.width / 2,
          pos.y - settings.size.menuItem.height / 2 + dim.height / 2
        ),
        settings.size.menuItem,
        "menu",
        "empty",
        "house"
      ),
      new LabelButton(
        new Position(
          dim.width / 2 - settings.size.menuItem.width / 2,
          pos.y - settings.size.menuItem.height / 2 + dim.height / 2
        ),
        settings.size.menuItem,
        "menu",
        "empty",
        "storage"
      ),
      new LabelButton(
        new Position(
          (dim.width * 5) / 6 - settings.size.menuItem.width / 2,
          pos.y - settings.size.menuItem.height / 2 + dim.height / 2
        ),
        settings.size.menuItem,
        "menu",
        "empty",
        "population"
      )
    );
  }
}
