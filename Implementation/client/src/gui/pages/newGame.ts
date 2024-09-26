import { globalState } from "../../data/data";
import { GameState } from "../../enums/gameState";
import { ServerHandler } from "../../server/serverHandler";
import { buttonSize } from "../../settings";
import { Button } from "../components/buttonComponents/button";
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
      GameState.Lobby,
      () => this.handleCreate()
    );

    this.join = new Button(
      buttonPos.newGame.join,
      buttonSize.width,
      buttonSize.height,
      buttonImages.join,
      GameState.JoinGame
    );

    this.backButton = new Button(
      buttonPos.newGame.back,
      buttonSize.width,
      buttonSize.height,
      buttonImages.back,
      GameState.MainMenu
    );

    this.buttons.push(this.create);
    this.buttons.push(this.join);
    this.buttons.push(this.backButton);
  }

  private handleCreate() {
    ServerHandler.sendMessage("connect:create", {
      name: globalState.playerName,
    });
  }
}
