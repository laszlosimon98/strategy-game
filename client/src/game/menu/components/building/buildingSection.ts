import { state } from "@/data/state";
import { SubMenuState } from "@/enums/gameMenuState";
import { FoodSection } from "@/game/menu/components/building/components/foodSection";
import { MilitarySection } from "@/game/menu/components/building/components/militarySection";
import { ResourceSection } from "@/game/menu/components/building/components/resourceSection";
import { StorageSection } from "@/game/menu/components/building/components/storageSection";
import { LabelButton } from "@/game/menu/components/labelButton";
import { Section } from "@/game/menu/components/section";
import { MENU_ITEM_SIZE } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class BuildingSection extends Section {
  private readonly margin: number = 125;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.subSections = {
      [SubMenuState.Resources]: new ResourceSection(
        new Position(pos.x + 10, pos.y + this.margin / 2 + 15),
        new Dimension(dim.width - 10, dim.height - this.margin)
      ),
      [SubMenuState.Food]: new FoodSection(
        new Position(pos.x + 10, pos.y + this.margin / 2 + 15),
        new Dimension(dim.width - 10, dim.height - this.margin)
      ),
      [SubMenuState.Military]: new MilitarySection(
        new Position(pos.x + 10, pos.y + this.margin / 2 + 15),
        new Dimension(dim.width - 10, dim.height - this.margin)
      ),
      [SubMenuState.Other]: new StorageSection(
        new Position(pos.x + 10, pos.y + this.margin / 2 + 15),
        new Dimension(dim.width - 10, dim.height - this.margin)
      ),
    };

    this.buttons.push(
      new LabelButton(
        new Position(dim.width / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE,
        "menu",
        "empty",
        "resource"
      ),
      new LabelButton(
        new Position((dim.width * 3) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE,
        "menu",
        "empty",
        "food"
      ),
      new LabelButton(
        new Position((dim.width * 5) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE,
        "menu",
        "empty",
        "military"
      ),
      new LabelButton(
        new Position((dim.width * 7) / 8 - MENU_ITEM_SIZE.width / 2, pos.y + 5),
        MENU_ITEM_SIZE,
        "menu",
        "empty",
        "house"
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
