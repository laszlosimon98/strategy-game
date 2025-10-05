import { SubMenuState } from "@/enums/gameMenuState";
import { FoodSection } from "@/game/menu/sections/building/buildingSections/foodSection";
import { MilitarySection } from "@/game/menu/sections/building/buildingSections/militarySection";
import { ResourceSection } from "@/game/menu/sections/building/buildingSections/resourceSection";
import { StorageSection } from "@/game/menu/sections/building/buildingSections/storageSection";
import { LabelButton } from "@/game/menu/sections/labelButton";
import { Section } from "@/game/menu/sections/section";
import { StateManager } from "@/manager/stateManager";
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
        StateManager.getImages("ui", "gamemenu", "resource"),
        "empty"
      ),
      new LabelButton(
        new Position(
          (dim.width * 3) / 8 - settings.size.menuItem.width / 2,
          pos.y + 5
        ),
        settings.size.menuItem,
        StateManager.getImages("ui", "gamemenu", "food"),
        "empty"
      ),
      new LabelButton(
        new Position(
          (dim.width * 5) / 8 - settings.size.menuItem.width / 2,
          pos.y + 5
        ),
        settings.size.menuItem,
        StateManager.getImages("ui", "gamemenu", "military"),
        "empty"
      ),
      new LabelButton(
        new Position(
          (dim.width * 7) / 8 - settings.size.menuItem.width / 2,
          pos.y + 5
        ),
        settings.size.menuItem,
        StateManager.getImages("ui", "gamemenu", "house"),
        "empty"
      )
    );
  }

  public handleClick(mousePos: Position) {
    this.selectBuilding(
      mousePos,
      this.subSections[StateManager.getSubMenuState()]?.getLabelButton()
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
