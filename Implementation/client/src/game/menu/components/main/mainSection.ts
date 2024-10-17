import { state } from "../../../../data/state";
import { Button } from "../../../../page/components/buttonComponents/button";
import { MENU_ITEM_SIZE } from "../../../../settings";
import { Dimension } from "../../../../utils/dimension";
import { Position } from "../../../../utils/position";
import { Section } from "../section";

export class MainSection extends Section {
  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.buttons.push(
      new Button(
        new Position(
          dim.width / 6 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + dim.height / 2
        ),
        MENU_ITEM_SIZE,
        state.images.game.menu.house.url
      ),
      new Button(
        new Position(
          dim.width / 2 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + dim.height / 2
        ),
        MENU_ITEM_SIZE,
        state.images.game.menu.storage.url
      ),
      new Button(
        new Position(
          (dim.width * 5) / 6 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + dim.height / 2
        ),
        MENU_ITEM_SIZE,
        state.images.game.menu.population.url
      )
    );
  }
}
