import { PageState } from "@/enums/pageState";
import { GameStateManager } from "@/manager/gameStateManager";
import { Button } from "@/page/components/button";
import { Page } from "@/page/views/page";
import { buttonPos } from "@/page/views/pos/buttonPos";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";

export class NewGame extends Page {
  private backButton: Button;
  private create: Button;
  private join: Button;

  public constructor(title: string) {
    super(title);

    this.create = new Button(
      buttonPos.newGame.create,
      settings.size.button,
      "name",
      "create",
      this.handleCreate
    );

    this.join = new Button(
      buttonPos.newGame.join,
      settings.size.button,
      "name",
      "join",
      this.handleJoin
    );

    this.backButton = new Button(
      buttonPos.newGame.back,
      settings.size.button,
      "name",
      "back",
      () => GameStateManager.setPageState(PageState.MainMenu)
    );

    this.buttons.push(this.create);
    this.buttons.push(this.join);
    this.buttons.push(this.backButton);
  }

  private handleCreate = () => {
    ServerHandler.sendMessage("connect:create", {
      name: GameStateManager.getPlayerName(),
    });
    GameStateManager.setPageState(PageState.Lobby);
    GameStateManager.setHost(true);
  };

  private handleJoin = () => {
    GameStateManager.setPageState(PageState.JoinGame);
    GameStateManager.setHost(false);
  };
}
