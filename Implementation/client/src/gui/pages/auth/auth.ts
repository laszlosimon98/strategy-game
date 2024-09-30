import {
  BLACK_COLOR,
  BUTTON_SIZE,
  INPUT_BACKGROUND_COLOR,
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
import { globalState } from "../../../data/data";

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
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.back,
      () => (globalState.state = GameState.MainMenu)
    );

    this.actionButton = new Button(
      buttonPos.default.next,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      actionButtonImage,
      () => this.handleNext()
    );

    this.nameInput = new TextInput(
      { ...inputPos.auth.name },
      600,
      40,
      "",
      INPUT_BACKGROUND_COLOR,
      false
    );

    this.passwordInput = new TextInput(
      { ...inputPos.auth.password },
      600,
      40,
      "",
      INPUT_BACKGROUND_COLOR,
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
      BLACK_COLOR
    );

    this.passwordText = new Text(
      { ...inputPos.auth.password },
      0,
      0,
      "Jelszó: ",
      false,
      BLACK_COLOR
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
      // this.actionButton.setNextState(GameState.Registration);
      globalState.state = GameState.Registration;
      console.error(error);
    } else {
      globalState.state = GameState.MainMenu;
      // this.actionButton.setNextState(GameState.MainMenu);
    }
  }

  handleAuth(): [boolean, string] {
    return [false, ""];
  }
}
