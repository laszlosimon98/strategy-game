import { buttonSize } from "../../settings";
import { Button } from "../components/button";
import { GameState } from "../../enums/gameState";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";

export class Registration extends GUI {
  private backButton: Button;
  private registration: Button;

  constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.default.back,
      buttonSize.width,
      buttonSize.height,
      buttonImages.back,
      GameState.MainMenu
    );

    this.registration = new Button(
      buttonPos.default.next,
      buttonSize.width,
      buttonSize.height,
      buttonImages.registration,
      GameState.MainMenu
    );

    this.buttons.push(this.backButton);
    this.buttons.push(this.registration);
  }
}
