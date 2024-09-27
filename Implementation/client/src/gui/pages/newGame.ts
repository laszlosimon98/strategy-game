import { globalState } from "../../data/data";
import { GameState } from "../../enums/gameState";
import { ServerHandler } from "../../server/serverHandler";
import { BUTTON_SIZE } from "../../settings";
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
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.create,
      GameState.Lobby,
      () => this.handleCreate()
    );

    this.join = new Button(
      buttonPos.newGame.join,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.join,
      GameState.JoinGame
    );

    this.backButton = new Button(
      buttonPos.newGame.back,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
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
