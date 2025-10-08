import { Tooltip } from "@/game/menu/tooltip";
import { language, type UI, type Units } from "@/languages/language";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { settings } from "@/settings";
import type { ImageItemType, LabelButtonOptions } from "@/types/game.types";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { getImageNameFromUrl } from "@/utils/utils";

export class LabelButton extends Button {
  private name: string;
  private tooltip?: Tooltip;
  private options: LabelButtonOptions;

  constructor(
    pos: Position,
    dim: Dimension,
    imageProps: ImageItemType,
    text: string,
    options: LabelButtonOptions
  ) {
    super(pos, dim, imageProps, text);
    this.options = options;
    this.name = getImageNameFromUrl(imageProps.url);
    this.setImage(imageProps.url);

    this.pos = new Position(pos.x + this.dim.width / 8 - 8, pos.y);

    if (options?.hasTooltip) {
      this.tooltip = new Tooltip(
        new Position(
          this.pos.x + this.dim.width / 2 - settings.size.tooltip.width / 2,
          this.pos.y - this.dim.height / 2 - settings.size.tooltip.height / 2
        ),
        new Dimension(settings.size.tooltip.width, settings.size.tooltip.height)
      );
    }
  }

  public draw(): void {
    super.draw();

    if (this.tooltip && this.isHovered) {
      this.tooltip.draw();
    }
  }

  public drawTooltip(): void {
    if (this.tooltip && this.isHovered) {
      this.tooltip.draw();
    }
  }

  public getName(): string {
    return this.name;
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);
    if (this.tooltip && this.isHovered) {
      this.tooltip.update(dt, mousePos);

      if (this.options.type === "house") {
        this.tooltip.setName(
          language[StateManager.getLanguage()].ui[this.name as UI]
        );
        if (this.options.hasPrice) {
          this.tooltip.setHousePrices(this.name);
        }
      } else if (this.options.type === "unit") {
        this.tooltip.setName(
          language[StateManager.getLanguage()].units[this.name as Units]
        );
        if (this.options.hasPrice) {
          this.tooltip.setUnitPrices(this.name);
        }
      }
    }
  }
}
