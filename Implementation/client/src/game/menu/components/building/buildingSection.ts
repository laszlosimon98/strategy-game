import { state } from "../../../../data/state";
import { SubMenuState } from "../../../../enums/gameMenuState";
import { Button } from "../../../../page/components/buttonComponents/button";
import { MENU_ITEM_SIZE } from "../../../../settings";
import { Dimension } from "../../../../utils/dimension";
import { Position } from "../../../../utils/position";
import { LabelButton } from "../labelButton";
import { Section } from "../section";
import { FoodSection } from "./components/foodSection";
import { MilitarySection } from "./components/militarySection";
import { ResourceSection } from "./components/resourceSection";
import { StorageSection } from "./components/storageSection";

export class BuildingSection extends Section {
  private readonly margin: number = 125;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.subSections = {
      [SubMenuState.Resources]: new ResourceSection(
        new Position(pos.x, pos.y + this.margin),
        new Dimension(dim.width, dim.height - this.margin)
      ),
      [SubMenuState.Food]: new FoodSection(
        new Position(pos.x, pos.y + this.margin),
        new Dimension(dim.width, dim.height - this.margin)
      ),
      [SubMenuState.Military]: new MilitarySection(
        new Position(pos.x, pos.y + this.margin),
        new Dimension(dim.width, dim.height - this.margin)
      ),
      [SubMenuState.Other]: new StorageSection(
        new Position(pos.x, pos.y + this.margin),
        new Dimension(dim.width, dim.height - this.margin)
      ),
    };

    this.buttons.push(
      new Button(
        new Position(dim.width / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE,
        state.images.game.menu.resource.url
      ),
      new Button(
        new Position((dim.width * 3) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE,
        state.images.game.menu.food.url
      ),
      new Button(
        new Position((dim.width * 5) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE,
        state.images.game.menu.military.url
      ),
      new Button(
        new Position((dim.width * 7) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE,
        state.images.game.menu.house.url
      )
    );
  }

  public handleClick(mousePos: Position) {
    this.selectBuilding(
      mousePos,
      this.subSections[state.navigation.subMenuState]?.getLabelButton()
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
