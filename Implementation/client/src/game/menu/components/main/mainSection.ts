import { Button } from "../../../../page/components/buttonComponents/button";
import { MENU_ITEM_SIZE } from "../../../../settings";
import { Point } from "../../../../utils/point";
import { gameMenuAssets } from "../../../imports/menu";
import { Section } from "../section";

export class MainSection extends Section {
  constructor(pos: Point, width: number, height: number) {
    super(pos, width, height);

    this.buttons.push(
      new Button(
        new Point(
          width / 6 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + height / 2
        ),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        gameMenuAssets.house
      ),
      new Button(
        new Point(
          width / 2 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + height / 2
        ),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        gameMenuAssets.storage
      ),
      new Button(
        new Point(
          (width * 5) / 6 - MENU_ITEM_SIZE.width / 2,
          pos.y - MENU_ITEM_SIZE.height / 2 + height / 2
        ),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        gameMenuAssets.population
      )
    );
  }
}
