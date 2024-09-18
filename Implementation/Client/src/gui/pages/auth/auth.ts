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

  constructor(
    title: string,
    actionButtonImage: string,
    private readonly controller: AbortController
  ) {
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
      GameState.MainMenu
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

    document.addEventListener(
      "click",
      (e: MouseEvent) => {
        this.handleAuthClick(e.clientX, e.clientY);
        this.handleLeave(e.clientX, e.clientY);
      },
      { signal: this.controller.signal }
    );
  }

  protected getInputData(): AuthType {
    return {
      username: this.nameInput.getText(),
      password: this.passwordInput.getText(),
    };
  }

  handleAuthClick(mouseX: number, mouseY: number) {
    if (this.actionButton.isClicked(mouseX, mouseY)) {
      this.handleAuth();
      this.removeEventListeners();
      this.removeInputEventListerners();
    }
  }

  handleLeave(mouseX: number, mouseY: number) {
    if (this.backButton.isClicked(mouseX, mouseY)) {
      this.removeEventListeners();
      this.removeInputEventListerners();
    }
  }

  removeEventListeners(): void {
    this.controller.abort();
  }

  removeInputEventListerners(): void {
    this.nameInput.removeEventListeners();
    this.passwordInput.removeEventListeners();
  }

  handleAuth(): void {}

  draw(): void {
    super.draw();
    this.nameInput.draw();
    this.passwordInput.draw();
  }
}
