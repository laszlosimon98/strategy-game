import { globalState } from "../../data/data";
import { PageState } from "../../states/pageState";
import { ServerHandler } from "../../server/serverHandler";
import { BUTTON_SIZE } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { Page } from "./page";
import { buttonPos } from "./pos/buttonPos";
import { images } from "../../data/images";

export class NewGame extends Page {
  private backButton: Button;
  private create: Button;
  private join: Button;

  public constructor(title: string) {
    super(title);

    this.create = new Button(
      buttonPos.newGame.create,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      images.page.buttons.create.url,
      this.handleCreate
    );

    this.join = new Button(
      buttonPos.newGame.join,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      images.page.buttons.join.url,
      this.handleJoin
    );

    this.backButton = new Button(
      buttonPos.newGame.back,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      images.page.buttons.back.url,
      () => (globalState.state = PageState.MainMenu)
    );

    this.buttons.push(this.create);
    this.buttons.push(this.join);
    this.buttons.push(this.backButton);
  }

  private handleCreate = () => {
    ServerHandler.sendMessage("connect:create", {
      name: globalState.playerName,
    });
    globalState.state = PageState.Lobby;
    globalState.host = true;
  };

  private handleJoin = () => {
    globalState.state = PageState.JoinGame;
    globalState.host = false;
  };
}
