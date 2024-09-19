import { buttonSize } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { GameState } from "../../enums/gameState";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";

export class NewGame extends GUI {
  private backButton: Button;
  private create: Button;
  private join: Button;

  constructor(title: string) {
    super(title);

    this.create = new Button(
      buttonPos.newGame.create,
      buttonSize.width,
      buttonSize.height,
      buttonImages.create,
      () => this.setState(GameState.Lobby)
    );

    this.join = new Button(
      buttonPos.newGame.join,
      buttonSize.width,
      buttonSize.height,
      buttonImages.join,
      () => this.setState(GameState.JoinGame)
    );

    this.backButton = new Button(
      buttonPos.newGame.back,
      buttonSize.width,
      buttonSize.height,
      buttonImages.back,
      () => this.setState(GameState.MainMenu)
    );

    this.buttons.push(this.create);
    this.buttons.push(this.join);
    this.buttons.push(this.backButton);
  }
}
