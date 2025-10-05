import { GameState } from "@/enums/gameState";
import { Tooltip } from "@/game/menu/tooltip";
import { language, type UI } from "@/languages/language";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { settings } from "@/settings";
import type { ImageItemType } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { getImageNameFromUrl } from "@/utils/utils";

export class LabelButton extends Button {
  private name: string;
  private tooltip: Tooltip;

  constructor(
    pos: Position,
    dim: Dimension,
    imageProps: ImageItemType,
    text: string
  ) {
    super(pos, dim, imageProps, text);
    this.name = getImageNameFromUrl(imageProps.url);
    this.setImage(imageProps.url);

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
      this.tooltip.setHousePrices(this.getImage());
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
