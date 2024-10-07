import { Button } from "../../../../page/components/buttonComponents/button";
import { MENU_ITEM_SIZE } from "../../../../settings";
import { GameSubMenuState } from "../../../../states/gameMenuState";
import { Point } from "../../../../utils/point";
import { gameMenuAssets } from "../../../imports/menu";
import { Section } from "../section";
import { FoodSection } from "./components/foodSection";
import { MilitarySection } from "./components/militarySection";
import { ResourceSection } from "./components/resourceSection";
import { StorageSection } from "./components/storageSection";

export class BuildingSection extends Section {
  private readonly margin: number = 125;

  constructor(pos: Point, width: number, height: number) {
    super(pos, width, height);

    this.subSections = {
      [GameSubMenuState.Resources]: new ResourceSection(
        new Point(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
      [GameSubMenuState.Food]: new FoodSection(
        new Point(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
      [GameSubMenuState.Military]: new MilitarySection(
        new Point(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
      [GameSubMenuState.Other]: new StorageSection(
        new Point(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
    };

    this.buttons.push(
      new Button(
        new Point(width / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        gameMenuAssets.resource
      ),
      new Button(
        new Point((width * 3) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        gameMenuAssets.food
      ),
      new Button(
        new Point((width * 5) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        gameMenuAssets.military
      ),
      new Button(
        new Point((width * 7) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        gameMenuAssets.house
      )
    );
  }
}
