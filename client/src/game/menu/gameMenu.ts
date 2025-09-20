import { MainMenuState } from "@/enums/gameMenuState";
import { BuildingSection } from "@/game/menu/sections/building/buildingSection";
import { InfoPanel } from "@/game/menu/sections/infoPanel";
import { MainSection } from "@/game/menu/sections/main/mainSection";
import { Section } from "@/game/menu/sections/section";
import { StorageSection } from "@/game/menu/sections/storage/storageSection";
import type { CallAble } from "@/interfaces/callAble";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { getImageNameFromUrl } from "@/utils/utils";

export class GameMenu implements CallAble {
  private mainSection: MainSection;
  private frames: Record<MainMenuState, Section>;

  private pos: Position;
  private dim: Dimension;

  public constructor(pos: Position, dim: Dimension) {
    this.pos = pos;
    this.dim = dim;

    this.mainSection = new MainSection(
      pos,
      new Dimension(dim.width, settings.offset.menuItem)
    );

    this.frames = {
      [MainMenuState.Unselected]: new Section(
        new Position(pos.x, pos.y + settings.offset.menuItem),
        new Dimension(dim.width, dim.height - settings.offset.menuItem)
      ),
      [MainMenuState.House]: new BuildingSection(
        new Position(pos.x, pos.y + settings.offset.menuItem),
        new Dimension(dim.width, dim.height - settings.offset.menuItem)
      ),
      [MainMenuState.Storage]: new StorageSection(
        new Position(pos.x, pos.y + settings.offset.menuItem),
        new Dimension(dim.width, dim.height - settings.offset.menuItem)
      ),
      [MainMenuState.Population]: new Section(
        new Position(pos.x, pos.y + settings.offset.menuItem),
        new Dimension(dim.width, dim.height - settings.offset.menuItem)
      ),
      [MainMenuState.Info]: new InfoPanel(
        new Position(pos.x, pos.y + settings.offset.menuItem),
        new Dimension(dim.width, dim.height - settings.offset.menuItem)
      ),
    };
  }

  setHover(state: boolean): void {}

  setPosition(pos: Position): void {
    this.pos = pos;
  }

  setDimension(dim: Dimension): void {
    this.dim = dim;
  }

  public getPosition(): Position {
    return this.pos;
  }

  public getDimension(): Dimension {
    return this.dim;
  }

  public updateInfoPanel(): void {
    this.frames[MainMenuState.Info].updateInfoPanel();
  }

  public draw(): void {
    this.mainSection.draw();
    this.frames[StateManager.getGameMenuState()].draw();
  }

  public drawTooltips(): void {
    this.frames[StateManager.getGameMenuState()].drawTooltips();
  }

  public update(dt: number, mousePos: Position): void {
    this.mainSection.update(dt, mousePos);
    this.frames[StateManager.getGameMenuState()].update(dt, mousePos);
  }

  public handleClick(mousePos: Position): void {
    this.updateImages("Main", mousePos, this.mainSection.getButtons());
    this.updateImages(
      "Sub",
      mousePos,
      this.frames[StateManager.getGameMenuState()].getButtons()
    );

    this.frames[StateManager.getGameMenuState()].handleClick(mousePos);
  }

  public updateImages(
    type: string,
    mousePos: Position,
    buttons?: Button[]
  ): void {
    if (!buttons) {
      return;
    }

    buttons.forEach((button, index) => {
      if (button.isClicked(mousePos.x, mousePos.y)) {
        this.resetButtonImage(buttons);
        const image: string = getImageNameFromUrl(button.getImage());
        const select = `${image}_selected`;
        button.setImage(StateManager.getImages("ui", "gamemenu", select).url);

        if (type === "Main") {
          StateManager.setGameMenuStateByIndex(index + 1);
        } else if (type === "Sub") {
          StateManager.setSubMenuStateByIndex(index + 1);
        }
      }
    });
  }

  private resetButtonImage(buttons: Button[]): void {
    buttons.forEach((button) => {
      let image: string = getImageNameFromUrl(button.getImage());

      if (image.includes("_selected")) {
        image = image.split("_")[0];
      }

      button.setImage(StateManager.getImages("ui", "gamemenu", image).url);
    });
  }
}
