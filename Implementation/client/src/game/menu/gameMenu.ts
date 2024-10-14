import { globalState } from "../../data/data";
import { images } from "../../data/images";
import { Button } from "../../page/components/buttonComponents/button";
import { GameMainMenuState } from "../../states/gameMenuState";
import { Dimension } from "../../utils/dimension";
import { Position } from "../../utils/position";
import { getImageNameFromUrl } from "../../utils/utils";
import { BuildingSection } from "./components/building/buildingSection";
import { MainSection } from "./components/main/mainSection";
import { Section } from "./components/section";

export class GameMenu {
  private mainSection: MainSection;
  private frames: Record<GameMainMenuState, Section>;

  private pos: Position;
  private dim: Dimension;

  public constructor(pos: Position, dim: Dimension) {
    this.pos = pos;
    this.dim = dim;

    this.mainSection = new MainSection(pos, dim.width, 75);

    this.frames = {
      [GameMainMenuState.Unselected]: new Section(
        new Position(pos.x, pos.y + 74),
        dim.width,
        dim.height - 75
      ),
      [GameMainMenuState.House]: new BuildingSection(
        new Position(pos.x, pos.y + 74),
        dim.width,
        dim.height - 75
      ),
      [GameMainMenuState.Storage]: new Section(
        new Position(pos.x, pos.y + 74),
        dim.width,
        dim.height - 75
      ),
      [GameMainMenuState.Population]: new Section(
        new Position(pos.x, pos.y + 74),
        dim.width,
        dim.height - 75
      ),
      [GameMainMenuState.Info]: new Section(
        new Position(pos.x, pos.y + 74),
        dim.width,
        dim.height - 75
      ),
    };
  }

  public draw(): void {
    this.mainSection.draw();
    this.frames[globalState.gameMenuState].draw();
  }

  public update(mousePos: Position): void {
    this.mainSection.update(mousePos);
    this.frames[globalState.gameMenuState].update(mousePos);
  }

  public handleClick(mousePos: Position): void {
    this.updateImages("Main", mousePos, this.mainSection.getButtons());
    this.updateImages(
      "Sub",
      mousePos,
      this.frames[globalState.gameMenuState].getButtons()
    );
  }

  public isMouseIntersect(mousePos: Position): boolean {
    const horizontal =
      mousePos.x >= this.pos.x && mousePos.x <= this.pos.x + this.dim.width;
    const vertical =
      mousePos.y >= this.pos.y && mousePos.y <= this.pos.y + this.dim.height;
    return horizontal && vertical;
  }

  public updateImages(
    state: string,
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
        button.setImage(images.game.menu[select].url);

        if (state === "Main") {
          globalState.gameMenuState = index + 1;
        } else if (state === "Sub") {
          globalState.subMenuState = index + 1;
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

      button.setImage(images.game.menu[image].url);
    });
  }
}
