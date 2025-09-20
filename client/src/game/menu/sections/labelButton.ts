import { GameState } from "@/enums/gameState";
import { Tooltip } from "@/game/menu/tooltip";
import { language, type UI } from "@/languages/language";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { settings } from "@/settings";
import type { ImageItemType } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class LabelButton extends Button {
  private name: string;
  private tooltip: Tooltip;

  constructor(
    pos: Position,
    dim: Dimension,
    type: "name" | "title" | "buildings" | "menu",
    text: string,
    name: string
  ) {
    super(pos, dim, type, text);
    this.name = name;

    const imageFrom: "buildings" | "gamemenu" =
      type === "buildings" ? "buildings" : "gamemenu";

    if (imageFrom === "buildings") {
      this.setImage(StateManager.getImages(imageFrom, name).url);
    } else {
      const dimensions: Dimension = StateManager.getImages(
        "ui",
        imageFrom,
        name
      ).dimensions;

      this.dim.width = dimensions.width;
      this.dim.height = dimensions.height;

      this.setImage(StateManager.getImages("ui", imageFrom, name).url);
    }

    this.pos = new Position(pos.x + this.dim.width / 8 - 8, pos.y);

    this.tooltip = new Tooltip(
      new Position(
        this.pos.x + this.dim.width / 2 - settings.size.tooltip.width / 2,
        this.pos.y - this.dim.height / 2 - settings.size.tooltip.height / 2
      ),
      new Dimension(settings.size.tooltip.width, settings.size.tooltip.height)
    );
  }

  draw(): void {
    super.draw();
  }

  public drawTooltip(): void {
    if (this.isHovered) {
      this.tooltip.draw();
    }
  }

  update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);
    if (this.isHovered) {
      this.tooltip.update(dt, mousePos);
      this.tooltip.setHouseName(
        language[StateManager.getLanguage()].ui[this.name as UI]
      );
    }
  }

  selectBuilding(): void {
    const selectedHouse: ImageItemType = StateManager.getImages(
      "buildings",
      this.name
    );
    StateManager.setBuilder(selectedHouse);
    StateManager.setState(GameState.Build);
  }
}
