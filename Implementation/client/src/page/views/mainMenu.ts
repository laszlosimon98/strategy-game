import { Button } from "../components/buttonComponents/button";
import { buttonPos } from "./pos/buttonPos";
import { TextImage } from "../components/textComponents/textImage";
import { PageState } from "../../states/pageState";
import { globalState } from "../../data/data";
import { BUTTON_SIZE } from "../../settings";
import { Page } from "./page";
import { images } from "../../data/images";

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
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      images.page.buttons.newGame.url,
      () => (globalState.state = PageState.NewGame)
    );

    this.description = new Button(
      buttonPos.mainMenu.description,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      images.page.buttons.description.url,
      () => (globalState.state = PageState.Description)
    );

    this.statistic = new Button(
      buttonPos.mainMenu.statistic,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      images.page.buttons.statistic.url,
      () => (globalState.state = PageState.Statistic)
    );

    this.login = new Button(
      buttonPos.mainMenu.login,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      images.page.buttons.login.url,
      () => (globalState.state = PageState.Login)
    );

    this.registration = new Button(
      buttonPos.mainMenu.registration,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      images.page.buttons.registration.url,
      () => (globalState.state = PageState.Registration)
    );

    this.namePlate = new TextImage(
      buttonPos.mainMenu.namePlate,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      globalState.playerName,
      images.page.buttons.empty.url,
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
    if (this.namePlate.getText() !== globalState.playerName) {
      this.namePlate.setText(globalState.playerName);
    }
  }
}
