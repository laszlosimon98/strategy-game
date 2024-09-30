import { Button } from "../components/buttonComponents/button";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";
import { TextImage } from "../components/textComponents/textImage";
import { GameState } from "../../enums/gameState";
import { globalState } from "../../data/data";
import { BUTTON_SIZE } from "../../settings";

export class MainMenu extends GUI {
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
      GameState.NewGame,
      () => (globalState.state = GameState.NewGame)
    );

    this.description = new Button(
      buttonPos.mainMenu.description,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.description,
      GameState.Description,
      () => (globalState.state = GameState.Description)
    );

    this.statistic = new Button(
      buttonPos.mainMenu.statistic,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.statistic,
      GameState.Statistic,
      () => (globalState.state = GameState.Statistic)
    );

    this.login = new Button(
      buttonPos.mainMenu.login,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.login,
      GameState.Login,
      () => (globalState.state = GameState.Login)
    );

    this.registration = new Button(
      buttonPos.mainMenu.registration,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.registration,
      GameState.Registration,
      () => (globalState.state = GameState.Registration)
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
