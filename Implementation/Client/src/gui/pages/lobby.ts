import { buttonSize } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { GameState } from "../../enums/gameState";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";

export class Lobby extends GUI {
  private backButton: Button;
  private start: Button;

  constructor(title: string) {
    super(title);

    this.start = new Button(
      buttonPos.default.next,
      buttonSize.width,
      buttonSize.height,
      buttonImages.start,
      () => this.setState(GameState.Game)
    );

    this.backButton = new Button(
      buttonPos.default.back,
      buttonSize.width,
      buttonSize.height,
      buttonImages.back,
      () => this.setState(GameState.NewGame)
    );

    this.buttons.push(this.start);
    this.buttons.push(this.backButton);
  }
}
