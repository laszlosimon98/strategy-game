import {
  BLACK_COLOR,
  BUTTON_SIZE,
  INPUT_BACKGROUND_COLOR,
} from "../../../settings";
import { Button } from "../../components/buttonComponents/button";
import { buttonPos } from "../pos/buttonPos";
import { TextInput } from "../../components/textComponents/textInput";
import { AuthType } from "../../../types/authType";
import { PageState } from "../../../enums/pageState";
import { Text } from "../../components/textComponents/text";
import { inputPos } from "../pos/inputPos";
import { Page } from "../page";
import { state } from "../../../data/state";
import { Dimension } from "../../../utils/dimension";

export class Auth extends Page {
  protected backButton: Button;
  protected actionButton: Button;

  private nameInput: TextInput;
  private passwordInput: TextInput;

  private nameText: Text;
  private passwordText: Text;

  public constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.default.back,
      BUTTON_SIZE,
      "name",
      "back",
      () => (state.navigation.pageState = PageState.MainMenu)
    );

    this.actionButton = new Button(
      buttonPos.default.next,
      BUTTON_SIZE,
      "name",
      title,
      this.handleNext
    );

    this.nameInput = new TextInput(
      inputPos.auth.name,
      new Dimension(500, 40),
      "",
      INPUT_BACKGROUND_COLOR,
      false
    );

    this.passwordInput = new TextInput(
      inputPos.auth.password,
      new Dimension(500, 40),
      "",
      INPUT_BACKGROUND_COLOR,
      true
    );

    this.buttons.push(this.backButton);
    this.buttons.push(this.actionButton);
    this.inputs.push(this.nameInput);
    this.inputs.push(this.passwordInput);

    this.nameText = new Text(
      inputPos.auth.name,
      new Dimension(0, -40),
      "Felhasználó név: ",
      false,
      BLACK_COLOR
    );

    this.passwordText = new Text(
      inputPos.auth.password,
      new Dimension(0, -40),
      "Jelszó: ",
      false,
      BLACK_COLOR
    );
  }

  public draw(): void {
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

  public handleNext = (): void => {
    const [isError, error] = this.handleAuth();

    if (isError) {
      state.navigation.pageState = PageState.Registration;
      console.error(error);
    } else {
      state.navigation.pageState = PageState.MainMenu;
    }
  };

  public handleAuth(): [boolean, string] {
    return [false, ""];
  }
}
