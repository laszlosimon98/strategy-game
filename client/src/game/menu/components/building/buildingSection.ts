import { SubMenuState } from "@/enums/gameMenuState";
import { FoodSection } from "@/game/menu/components/building/buildingSections/foodSection";
import { MilitarySection } from "@/game/menu/components/building/buildingSections/militarySection";
import { ResourceSection } from "@/game/menu/components/building/buildingSections/resourceSection";
import { StorageSection } from "@/game/menu/components/building/buildingSections/storageSection";
import { LabelButton } from "@/game/menu/components/labelButton";
import { Section } from "@/game/menu/components/section";
import { GameStateManager } from "@/gameStateManager/gameStateManager";
import { settings } from "@/settings";
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
        new Position(
          dim.width / 8 - settings.size.menuItem.width / 2,
          pos.y + 5
        ),
        settings.size.menuItem,
        "menu",
        "empty",
        "resource"
      ),
      new LabelButton(
        new Position(
          (dim.width * 3) / 8 - settings.size.menuItem.width / 2,
          pos.y + 5
        ),
        settings.size.menuItem,
        "menu",
        "empty",
        "food"
      ),
      new LabelButton(
        new Position(
          (dim.width * 5) / 8 - settings.size.menuItem.width / 2,
          pos.y + 5
        ),
        settings.size.menuItem,
        "menu",
        "empty",
        "military"
      ),
      new LabelButton(
        new Position(
          (dim.width * 7) / 8 - settings.size.menuItem.width / 2,
          pos.y + 5
        ),
        settings.size.menuItem,
        "menu",
        "empty",
        "house"
      )
    );
  }

  public handleClick(mousePos: Position) {
    this.selectBuilding(
      mousePos,
      this.subSections[GameStateManager.getSubMenuState()]?.getLabelButton()
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
