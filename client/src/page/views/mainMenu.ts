import { PageState } from "@/enums/pageState";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { Plate } from "@/page/components/plate";
import { Page } from "@/page/views/page";
import { settings } from "@/settings";

export class MainMenu extends Page {
  private newGame: Button;
  private description: Button;
  private statistic: Button;
  private login: Button;
  private registration: Button;
  private namePlate: Plate;

  public constructor(title: string) {
    super(title);

    this.newGame = new Button(
      settings.pos.mainMenu.newGame,
      settings.size.button,
      "name",
      "newGame",
      () => StateManager.setPageState(PageState.NewGame)
    );

    this.description = new Button(
      settings.pos.mainMenu.description,
      settings.size.button,
      "name",
      "description",
      () => StateManager.setPageState(PageState.Description)
    );

    this.statistic = new Button(
      settings.pos.mainMenu.statistic,
      settings.size.button,
      "name",
      "statistic",
      () => StateManager.setPageState(PageState.Statistic)
    );

    this.login = new Button(
      settings.pos.mainMenu.login,
      settings.size.button,
      "name",
      "login",
      () => StateManager.setPageState(PageState.Login)
    );

    this.registration = new Button(
      settings.pos.mainMenu.registration,
      settings.size.button,
      "name",
      "registration",
      () => StateManager.setPageState(PageState.Registration)
    );

    this.namePlate = new Plate(
      settings.pos.mainMenu.namePlate,
      settings.size.button,
      "name",
      "name"
    );

    this.buttons.push(this.newGame);
    this.buttons.push(this.description);
    this.buttons.push(this.statistic);
    this.buttons.push(this.login);
    this.buttons.push(this.registration);
  }

  public draw(): void {
    super.draw();
    this.namePlate.draw();
  }

  public update(): void {
    if (this.namePlate.getText() !== StateManager.getPlayerName()) {
      this.namePlate.setText(StateManager.getPlayerName());
    }
  }
}
