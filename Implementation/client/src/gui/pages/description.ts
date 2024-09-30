import { globalState } from "../../data/data";
import { GameState } from "../../enums/gameState";
import { BUTTON_SIZE } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";

export class Description extends GUI {
  private backButton: Button;

  constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.statistic.back,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.back,
      GameState.MainMenu,
      () => (globalState.state = GameState.MainMenu)
    );

    this.buttons.push(this.backButton);
  }
}
