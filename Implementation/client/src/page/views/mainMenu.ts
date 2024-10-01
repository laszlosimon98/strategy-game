import { Button } from "../components/buttonComponents/button";
import { buttonImages } from "../imports/buttons";
import { buttonPos } from "./pos/buttonPos";
import { TextImage } from "../components/textComponents/textImage";
import { PageState } from "../../states/pageState";
import { globalState } from "../../data/data";
import { BUTTON_SIZE } from "../../settings";
import { Page } from "./page";

export class MainMenu extends Page {
  private newGame: Button;
  private description: Button;
  private statistic: Button;
  private login: Button;
  private registration: Button;
  private namePlate: TextImage;

  constructor(title: string) {
    super(title);

    this.newGame = new Button(
      buttonPos.mainMenu.newGame,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.newGame,
      () => (globalState.state = PageState.NewGame)
    );

    this.description = new Button(
      buttonPos.mainMenu.description,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.description,
      () => (globalState.state = PageState.Description)
    );

    this.statistic = new Button(
      buttonPos.mainMenu.statistic,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.statistic,
      () => (globalState.state = PageState.Statistic)
    );

    this.login = new Button(
      buttonPos.mainMenu.login,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.login,
      () => (globalState.state = PageState.Login)
    );

    this.registration = new Button(
      buttonPos.mainMenu.registration,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.registration,
      () => (globalState.state = PageState.Registration)
    );

    this.namePlate = new TextImage(
      buttonPos.mainMenu.namePlate,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      globalState.playerName,
      buttonImages.empty,
      false
    );
    this.namePlate.setCenter();

    this.buttons.push(this.newGame);
    this.buttons.push(this.description);
    this.buttons.push(this.statistic);
    this.buttons.push(this.login);
    this.buttons.push(this.registration);
  }

  draw(): void {
    super.draw();
    this.namePlate.draw();
  }

  update(): void {
    if (this.namePlate.getText() !== globalState.playerName) {
      this.namePlate.setText(globalState.playerName);
    }
  }
}
