import { globalState } from "../../../data/data";
import { Button } from "../../../page/components/buttonComponents/button";
import { GameMainMenuState } from "../../../states/gameMenuState";
import { getImageNameFromUrl } from "../../../utils/utils";
import { Vector } from "../../../utils/vector";
import { gameMenuAssets } from "../../imports/gameMenuAssets";
import { BuildingSection } from "./components/building/buildingSection";
import { MainSection } from "./components/main/mainSection";
import { Section } from "./components/section";

export class GameMenu {
  private mainSection: MainSection;
  private frames: Record<GameMainMenuState, Section>;

  constructor(pos: Vector, width: number, height: number) {
    this.mainSection = new MainSection(pos, width, 75);

    this.frames = {
      [GameMainMenuState.Unselected]: new Section(
        new Vector(pos.x, pos.y + 74),
        width,
        height - 75
      ),
      [GameMainMenuState.House]: new BuildingSection(
        new Vector(pos.x, pos.y + 74),
        width,
        height - 75
      ),
      [GameMainMenuState.Storage]: new Section(
        new Vector(pos.x, pos.y + 74),
        width,
        height - 75
      ),
      [GameMainMenuState.Population]: new Section(
        new Vector(pos.x, pos.y + 74),
        width,
        height - 75
      ),
      [GameMainMenuState.Info]: new Section(
        new Vector(pos.x, pos.y + 74),
        width,
        height - 75
      ),
    };
  }

  draw(): void {
    this.mainSection.draw();
    this.frames[globalState.gameMenuState].draw();
  }

  update(): void {
    this.mainSection.update();
    this.frames[globalState.gameMenuState].update();
  }

  resize(): void {}

  handleClick(): void {
    this.updateImages("Main", this.mainSection.getButtons());
    this.updateImages(
      "Sub",
      this.frames[globalState.gameMenuState].getButtons()
    );
  }

  updateImages(state: string, buttons?: Button[]): void {
    const { x, y } = globalState.mousePos;

    if (!buttons) {
      return;
    }

    buttons.forEach((button, index) => {
      if (button.isClicked(x, y)) {
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
