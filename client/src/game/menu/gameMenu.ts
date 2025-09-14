import { MainMenuState } from "@/enums/gameMenuState";
import { BuildingSection } from "@/game/menu/components/building/buildingSection";
import { InfoPanel } from "@/game/menu/components/infoPanel";
import { MainSection } from "@/game/menu/components/main/mainSection";
import { Section } from "@/game/menu/components/section";
import type { CallAble } from "@/interfaces/callAble";
import { GameStateManager } from "@/gameStateManager/gameStateManager";
import { Button } from "@/page/components/button";
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

    this.mainSection = new MainSection(pos, new Dimension(dim.width, 75));

    this.frames = {
      [MainMenuState.Unselected]: new Section(
        new Position(pos.x, pos.y + 74),
        new Dimension(dim.width, dim.height - 75)
      ),
      [MainMenuState.House]: new BuildingSection(
        new Position(pos.x, pos.y + 74),
        new Dimension(dim.width, dim.height - 75)
      ),
      [MainMenuState.Storage]: new Section(
        new Position(pos.x, pos.y + 74),
        new Dimension(dim.width, dim.height - 75)
      ),
      [MainMenuState.Population]: new Section(
        new Position(pos.x, pos.y + 74),
        new Dimension(dim.width, dim.height - 75)
      ),
      [MainMenuState.Info]: new InfoPanel(
        new Position(pos.x, pos.y + 74),
        new Dimension(dim.width, dim.height - 75)
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

  public draw(): void {
    this.mainSection.draw();
    this.frames[GameStateManager.getGameMenuState()].draw();
  }

  public update(dt: number, mousePos: Position): void {
    this.mainSection.update(dt, mousePos);
    this.frames[GameStateManager.getGameMenuState()].update(dt, mousePos);
  }

  public handleClick(mousePos: Position): void {
    this.updateImages("Main", mousePos, this.mainSection.getButtons());
    this.updateImages(
      "Sub",
      mousePos,
      this.frames[GameStateManager.getGameMenuState()].getButtons()
    );

    this.frames[GameStateManager.getGameMenuState()].handleClick(mousePos);
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
        button.setImage(
          GameStateManager.getImages("ui", "gamemenu", select).url
        );

        if (type === "Main") {
          GameStateManager.setGameMenuStateByIndex(index + 1);
        } else if (type === "Sub") {
          GameStateManager.setSubMenuStateByIndex(index + 1);
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

      button.setImage(GameStateManager.getImages("ui", "gamemenu", image).url);
    });
  }
}
