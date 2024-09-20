import { buttonSize, inputBackgroundColor } from "../../../settings";
import { Button } from "../../components/buttonComponents/button";
import { buttonImages } from "../../imports/buttons";
import { GUI } from "../gui";
import { buttonPos } from "../pos/buttonPos";
import { canvasHeight, canvasWidth } from "../../../init";
import { TextInput } from "../../components/textComponents/textInput";
import { AuthType } from "../../../types/authType";
import { GameState } from "../../../enums/gameState";

export class Auth extends GUI {
  protected backButton: Button;
  protected actionButton: Button;

  private nameInput: TextInput;
  private passwordInput: TextInput;

  constructor(title: string, actionButtonImage: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.default.back,
      buttonSize.width,
      buttonSize.height,
      buttonImages.back,
      GameState.MainMenu
    );

    this.actionButton = new Button(
      buttonPos.default.next,
      buttonSize.width,
      buttonSize.height,
      actionButtonImage,
      GameState.MainMenu,
      () => this.handleNext()
    );

    this.nameInput = new TextInput(
      { x: canvasWidth / 2 - 100, y: canvasHeight / 2 - 50 },
      400,
      40,
      "",
      inputBackgroundColor,
      false
    );

    this.passwordInput = new TextInput(
      { x: canvasWidth / 2 - 100, y: canvasHeight / 2 + 50 },
      400,
      40,
      "",
      inputBackgroundColor,
      true
    );

    this.buttons.push(this.backButton);
    this.buttons.push(this.actionButton);
    this.inputs.push(this.nameInput);
    this.inputs.push(this.passwordInput);
  }

  protected getInputData(): AuthType {
    return {
      username: this.nameInput.getText(),
      password: this.passwordInput.getText(),
    };
  }

  handleNext(): void {
    const [isError, error] = this.handleAuth();

    if (isError) {
      this.actionButton.setState(GameState.Registration);
      console.error(error);
    } else {
      this.actionButton.setState(GameState.MainMenu);
    }
  }

  handleAuth(): [boolean, string] {
    return [false, ""];
  }

  draw(): void {
    super.draw();
    this.nameInput.draw();
    this.passwordInput.draw();
  }
}
