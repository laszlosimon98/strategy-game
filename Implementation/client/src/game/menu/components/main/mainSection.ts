import { images } from "../../../../data/images";
import { Button } from "../../../../page/components/buttonComponents/button";
import { MENU_ITEM_SIZE } from "../../../../settings";
import { Position } from "../../../../utils/position";
import { Section } from "../section";

export class MainSection extends Section {
  public constructor(pos: Position, width: number, height: number) {
    super(pos, width, height);

    this.buttons.push(
      new Button(
        new Position(
          width / 6 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + height / 2
        ),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        images.game.menu.house.url
      ),
      new Button(
        new Position(
          width / 2 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + height / 2
        ),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        images.game.menu.storage.url
      ),
      new Button(
        new Position(
          (width * 5) / 6 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + height / 2
        ),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        images.game.menu.population.url
      )
    );
  }
}
