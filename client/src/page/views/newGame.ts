import { PageState } from "@/enums/pageState";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { Page } from "@/page/views/page";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";

export class NewGame extends Page {
  private backButton: Button;
  private create: Button;
  private join: Button;

  public constructor(title: string) {
    super(title);

    this.create = new Button(
      settings.pos.newGame.create,
      settings.size.button,
      "name",
      "create",
      this.handleCreate
    );

    this.join = new Button(
      settings.pos.newGame.join,
      settings.size.button,
      "name",
      "join",
      this.handleJoin
    );

    this.backButton = new Button(
      settings.pos.newGame.back,
      settings.size.button,
      "name",
      "back",
      () => StateManager.setPageState(PageState.MainMenu)
    );

    this.buttons.push(this.create);
    this.buttons.push(this.join);
    this.buttons.push(this.backButton);
  }

  private handleCreate = () => {
    ServerHandler.sendMessage("connect:create", {
      name: StateManager.getPlayerName(),
    });
    StateManager.setPageState(PageState.Lobby);
    StateManager.setHost(true);
  };

  private handleJoin = () => {
    StateManager.setPageState(PageState.JoinGame);
    StateManager.setHost(false);
  };
}
