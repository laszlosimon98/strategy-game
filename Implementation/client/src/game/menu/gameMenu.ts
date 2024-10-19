import { state } from "../../data/state";
import { MainMenuState } from "../../enums/gameMenuState";
import { ctx } from "../../init";
import { MouseIntersect } from "../../interfaces/mouseIntersect";
import { RenderInterface } from "../../interfaces/render";
import { Button } from "../../page/components/buttonComponents/button";
import { Dimension } from "../../utils/dimension";
import { Position } from "../../utils/position";
import { getImageNameFromUrl } from "../../utils/utils";
import { BuildingSection } from "./components/building/buildingSection";
import { InfoPanel } from "./components/infoPanel";
import { MainSection } from "./components/main/mainSection";
import { Section } from "./components/section";

export class GameMenu implements RenderInterface, MouseIntersect {
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
  public getPosition(): Position {
    return this.pos;
  }

  public getDimension(): Dimension {
    return this.dim;
  }

  public draw(): void {
    this.mainSection.draw();
    this.frames[state.navigation.gameMenuState].draw();
  }

  public update(dt: number, mousePos: Position): void {
    this.mainSection.update(dt, mousePos);
    this.frames[state.navigation.gameMenuState].update(dt, mousePos);
  }

  public handleClick(mousePos: Position): void {
    this.updateImages("Main", mousePos, this.mainSection.getButtons());
    this.updateImages(
      "Sub",
      mousePos,
      this.frames[state.navigation.gameMenuState].getButtons()
    );

    this.frames[state.navigation.gameMenuState].handleClick(mousePos);
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
        button.setImage(state.images.game.menu[select].url);

        if (type === "Main") {
          state.navigation.gameMenuState = index + 1;
        } else if (type === "Sub") {
          state.navigation.subMenuState = index + 1;
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

      button.setImage(state.images.game.menu[image].url);
    });
  }
}
