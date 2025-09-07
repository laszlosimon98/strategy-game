import { LabelButton } from "@/game/menu/components/labelButton";
import { Section } from "@/game/menu/components/section";
import { MENU_ITEM_SIZE } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class MainSection extends Section {
  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.buttons.push(
      new LabelButton(
        new Position(
          dim.width / 6 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + dim.height / 2
        ),
        MENU_ITEM_SIZE,
        "menu",
        "empty",
        "house"
      ),
      new LabelButton(
        new Position(
          dim.width / 2 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + dim.height / 2
        ),
        MENU_ITEM_SIZE,
        "menu",
        "empty",
        "storage"
      ),
      new LabelButton(
        new Position(
          (dim.width * 5) / 6 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + dim.height / 2
        ),
        MENU_ITEM_SIZE,
        "menu",
        "empty",
        "population"
      )
    );
  }
}
