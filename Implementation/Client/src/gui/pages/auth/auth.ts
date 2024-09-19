import { buttonSize, inputBackgroundColor } from "../../../settings";
import { Button } from "../../components/buttonComponents/button";
import { GameState } from "../../../enums/gameState";
import { buttonImages } from "../../imports/buttons";
import { GUI } from "../gui";
import { buttonPos } from "../pos/buttonPos";
import { canvasHeight, canvasWidth } from "../../../init";
import { TextInput } from "../../components/textComponents/textInput";
import { AuthType } from "../../../types/authType";

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
      () => this.handleLeave()
    );

    this.actionButton = new Button(
      buttonPos.default.next,
      buttonSize.width,
      buttonSize.height,
      actionButtonImage,
      () => this.handleNext()
    );

    this.buttons.push(this.backButton);
    this.buttons.push(this.actionButton);

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
  }

  protected getInputData(): AuthType {
    return {
      username: this.nameInput.getText(),
      password: this.passwordInput.getText(),
    };
  }

  handleLeave(): void {
    this.removeInputEventListerners();
    this.setState(GameState.MainMenu);
  }

  handleNext(): void {
    try {
      this.handleAuth();
      this.handleLeave();
    } catch (error: any) {
      console.log(error.message);
    }

    // if (isError) {
    //   // alert(error);
    //   console.error(error);
    //   return;
    // } else {
    //   console.log("asdf");
    //   this.handleLeave();
    // }
  }

  removeInputEventListerners(): void {
    this.nameInput.removeEventListeners();
    this.passwordInput.removeEventListeners();
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
