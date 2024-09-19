import { buttonSize } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { GameState } from "../../enums/gameState";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";

export class Description extends GUI {
  private backButton: Button;

  constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.statistic.back,
      buttonSize.width,
      buttonSize.height,
      buttonImages.back,
      () => this.setState(GameState.MainMenu)
    );

    this.buttons.push(this.backButton);
  }
}
