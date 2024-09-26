import {
  blackColor,
  buttonSize,
  inputBackgroundColor,
} from "../../../settings";
import { Button } from "../../components/buttonComponents/button";
import { buttonImages } from "../../imports/buttons";
import { GUI } from "../gui";
import { buttonPos } from "../pos/buttonPos";
import { TextInput } from "../../components/textComponents/textInput";
import { AuthType } from "../../../types/authType";
import { GameState } from "../../../enums/gameState";
import { Text } from "../../components/textComponents/text";
import { inputPos } from "../pos/inputPos";

export class Auth extends GUI {
  protected backButton: Button;
  protected actionButton: Button;

  private nameInput: TextInput;
  private passwordInput: TextInput;

  private nameText: Text;
  private passwordText: Text;

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
      { ...inputPos.auth.name },
      600,
      40,
      "",
      inputBackgroundColor,
      false
    );

    this.passwordInput = new TextInput(
      { ...inputPos.auth.password },
      600,
      40,
      "",
      inputBackgroundColor,
      true
    );

    this.buttons.push(this.backButton);
    this.buttons.push(this.actionButton);
    this.inputs.push(this.nameInput);
    this.inputs.push(this.passwordInput);

    this.nameText = new Text(
      { ...inputPos.auth.name },
      0,
      0,
      "Felhasználó név: ",
      false,
      blackColor
    );

    this.passwordText = new Text(
      { ...inputPos.auth.password },
      0,
      0,
      "Jelszó: ",
      false,
      blackColor
    );
  }

  draw(): void {
    super.draw();
    this.nameInput.draw();
    this.passwordInput.draw();
    this.nameText.draw();
    this.passwordText.draw();
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
      this.actionButton.setNextState(GameState.Registration);
      console.error(error);
    } else {
      this.actionButton.setNextState(GameState.MainMenu);
    }
  }

  handleAuth(): [boolean, string] {
    return [false, ""];
  }
}
