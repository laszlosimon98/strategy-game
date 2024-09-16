import { buttonSize } from "../../settings";
import { Button } from "../components/button";
import { GameState } from "../../enums/gameState";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";

export class Join extends GUI {
  private backButton: Button;
  private join: Button;

  constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.default.back,
      buttonSize.width,
      buttonSize.height,
      buttonImages.back,
      GameState.NewGame
    );

    this.join = new Button(
      buttonPos.default.next,
      buttonSize.width,
      buttonSize.height,
      buttonImages.join,
      GameState.Lobby
    );

    this.buttons.push(this.join);
    this.buttons.push(this.backButton);
  }
}
