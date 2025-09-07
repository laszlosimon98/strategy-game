import { state } from "@/data/state";
import { PageState } from "@/enums/pageState";
import { Button } from "@/page/components/buttonComponents/button";
import { Plate } from "@/page/components/buttonComponents/plate";
import { Page } from "@/page/views/page";
import { buttonPos } from "@/page/views/pos/buttonPos";
import { BUTTON_SIZE } from "@/settings";

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
      buttonPos.mainMenu.newGame,
      BUTTON_SIZE,
      "name",
      "newGame",
      () => (state.navigation.pageState = PageState.NewGame)
    );

    this.description = new Button(
      buttonPos.mainMenu.description,
      BUTTON_SIZE,
      "name",
      "description",
      () => (state.navigation.pageState = PageState.Description)
    );

    this.statistic = new Button(
      buttonPos.mainMenu.statistic,
      BUTTON_SIZE,
      "name",
      "statistic",
      () => (state.navigation.pageState = PageState.Statistic)
    );

    this.login = new Button(
      buttonPos.mainMenu.login,
      BUTTON_SIZE,
      "name",
      "login",
      () => (state.navigation.pageState = PageState.Login)
    );

    this.registration = new Button(
      buttonPos.mainMenu.registration,
      BUTTON_SIZE,
      "name",
      "registration",
      () => (state.navigation.pageState = PageState.Registration)
    );

    this.namePlate = new Plate(
      buttonPos.mainMenu.namePlate,
      BUTTON_SIZE,
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
    if (this.namePlate.getText() !== state.player.name) {
      this.namePlate.setText(state.player.name);
    }
  }
}
