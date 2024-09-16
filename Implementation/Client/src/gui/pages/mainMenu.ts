import { buttonSize } from "../../settings";
import { Button } from "../components/button";
import { GameState } from "../../enums/gameState";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";
import { TextFieldWithImage } from "../components/textFieldWithImage";

export class MainMenu extends GUI {
  private newGame: Button;
  private description: Button;
  private statistic: Button;
  private login: Button;
  private registration: Button;
  private namePlate: TextFieldWithImage;

  constructor(title: string) {
    super(title);

    this.newGame = new Button(
      buttonPos.mainMenu.newGame,
      buttonSize.width,
      buttonSize.height,
      buttonImages.newGame,
      GameState.NewGame
    );

    this.description = new Button(
      buttonPos.mainMenu.description,
      buttonSize.width,
      buttonSize.height,
      buttonImages.description,
      GameState.Description
    );

    this.statistic = new Button(
      buttonPos.mainMenu.statistic,
      buttonSize.width,
      buttonSize.height,
      buttonImages.statistic,
      GameState.Statistic
    );

    this.login = new Button(
      buttonPos.mainMenu.login,
      buttonSize.width,
      buttonSize.height,
      buttonImages.login,
      GameState.Login
    );

    this.registration = new Button(
      buttonPos.mainMenu.registration,
      buttonSize.width,
      buttonSize.height,
      buttonImages.registration,
      GameState.Registration
    );

    this.namePlate = new TextFieldWithImage(
      buttonPos.mainMenu.namePlate,
      buttonSize.width,
      buttonSize.height,
      buttonImages.empty,
      "Játékos"
    );

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
}
