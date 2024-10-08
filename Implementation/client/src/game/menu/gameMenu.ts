import { globalState } from "../../data/data";
import { Button } from "../../page/components/buttonComponents/button";
import { GameMainMenuState } from "../../states/gameMenuState";
import { Position } from "../../utils/position";
import { getImageNameFromUrl } from "../../utils/utils";
import { gameMenuAssets } from "../imports/menu";
import { BuildingSection } from "./components/building/buildingSection";
import { MainSection } from "./components/main/mainSection";
import { Section } from "./components/section";

export class GameMenu {
  private mainSection: MainSection;
  private frames: Record<GameMainMenuState, Section>;

  constructor(pos: Position, width: number, height: number) {
    this.mainSection = new MainSection(pos, width, 75);

    this.frames = {
      [GameMainMenuState.Unselected]: new Section(
        new Position(pos.x, pos.y + 74),
        width,
        height - 75
      ),
      [GameMainMenuState.House]: new BuildingSection(
        new Position(pos.x, pos.y + 74),
        width,
        height - 75
      ),
      [GameMainMenuState.Storage]: new Section(
        new Position(pos.x, pos.y + 74),
        width,
        height - 75
      ),
      [GameMainMenuState.Population]: new Section(
        new Position(pos.x, pos.y + 74),
        width,
        height - 75
      ),
      [GameMainMenuState.Info]: new Section(
        new Position(pos.x, pos.y + 74),
        width,
        height - 75
      ),
    };
  }

  draw(): void {
    this.mainSection.draw();
    this.frames[globalState.gameMenuState].draw();
  }

  update(mousePos: Position): void {
    this.mainSection.update(mousePos);
    this.frames[globalState.gameMenuState].update(mousePos);
  }

  handleClick(mousePos: Position): void {
    this.updateImages("Main", mousePos, this.mainSection.getButtons());
    this.updateImages(
      "Sub",
      mousePos,
      this.frames[globalState.gameMenuState].getButtons()
    );
  }

  updateImages(state: string, mousePos: Position, buttons?: Button[]): void {
    if (!buttons) {
      return;
    }

    buttons.forEach((button, index) => {
      if (button.isClicked(mousePos.x, mousePos.y)) {
        this.resetButtonImage(buttons);
        const image: string = getImageNameFromUrl(button.getImage());
        const select = `${image}_selected`;
        button.setImage(gameMenuAssets[select]);

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

      button.setImage(gameMenuAssets[image]);
    });
  }
}
