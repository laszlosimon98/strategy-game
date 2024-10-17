import { Button } from "../components/buttonComponents/button";
import { buttonPos } from "./pos/buttonPos";
import { TextImage } from "../components/textComponents/textImage";
import { PageState } from "../../enums/pageState";
import { BUTTON_SIZE } from "../../settings";
import { Page } from "./page";
import { state } from "../../data/state";

export class MainMenu extends Page {
  private newGame: Button;
  private description: Button;
  private statistic: Button;
  private login: Button;
  private registration: Button;
  private namePlate: TextImage;

  public constructor(title: string) {
    super(title);

    this.newGame = new Button(
      buttonPos.mainMenu.newGame,
      BUTTON_SIZE,
      state.images.page.buttons.newGame.url,
      () => (state.navigation.pageState = PageState.NewGame)
    );

    this.description = new Button(
      buttonPos.mainMenu.description,
      BUTTON_SIZE,
      state.images.page.buttons.description.url,
      () => (state.navigation.pageState = PageState.Description)
    );

    this.statistic = new Button(
      buttonPos.mainMenu.statistic,
      BUTTON_SIZE,
      state.images.page.buttons.statistic.url,
      () => (state.navigation.pageState = PageState.Statistic)
    );

    this.login = new Button(
      buttonPos.mainMenu.login,
      BUTTON_SIZE,
      state.images.page.buttons.login.url,
      () => (state.navigation.pageState = PageState.Login)
    );

    this.registration = new Button(
      buttonPos.mainMenu.registration,
      BUTTON_SIZE,
      state.images.page.buttons.registration.url,
      () => (state.navigation.pageState = PageState.Registration)
    );

    this.namePlate = new TextImage(
      buttonPos.mainMenu.namePlate,
      BUTTON_SIZE,
      state.player.name,
      state.images.page.buttons.empty.url,
      false
    );
    this.namePlate.setCenter();

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
