import { globalState } from "../../../../data/data";
import { images } from "../../../../data/images";
import { selectedBuilding } from "../../../../data/selectedBuilding";
import { Button } from "../../../../page/components/buttonComponents/button";
import { MENU_ITEM_SIZE } from "../../../../settings";
import { GameSubMenuState } from "../../../../states/gameMenuState";
import { Position } from "../../../../utils/position";
import { LabelButton } from "../labelButton";
import { Section } from "../section";
import { FoodSection } from "./components/foodSection";
import { MilitarySection } from "./components/militarySection";
import { ResourceSection } from "./components/resourceSection";
import { StorageSection } from "./components/storageSection";

export class BuildingSection extends Section {
  private readonly margin: number = 125;

  public constructor(pos: Position, width: number, height: number) {
    super(pos, width, height);

    this.subSections = {
      [GameSubMenuState.Resources]: new ResourceSection(
        new Position(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
      [GameSubMenuState.Food]: new FoodSection(
        new Position(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
      [GameSubMenuState.Military]: new MilitarySection(
        new Position(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
      [GameSubMenuState.Other]: new StorageSection(
        new Position(pos.x, pos.y + this.margin),
        width,
        height - this.margin
      ),
    };

    this.buttons.push(
      new Button(
        new Position(width / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        images.game.menu.resource.url
      ),
      new Button(
        new Position((width * 3) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        images.game.menu.food.url
      ),
      new Button(
        new Position((width * 5) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        images.game.menu.military.url
      ),
      new Button(
        new Position((width * 7) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE.width,
        MENU_ITEM_SIZE.height,
        images.game.menu.house.url
      )
    );
  }

  public handleClick(mousePos: Position) {
    this.selectBuilding(
      mousePos,
      this.subSections[globalState.subMenuState]?.getLabelButton()
    );
  }

  selectBuilding(mousePos: Position, buttons?: LabelButton[]) {
    if (!buttons) {
      return;
    }

    buttons.forEach((btn) => {
      if (btn.isClicked(mousePos.x, mousePos.y)) {
        btn.selectBuilding();
      }
    });
  }
}
