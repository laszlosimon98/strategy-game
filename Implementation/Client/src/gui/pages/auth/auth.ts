import { buttonSize } from "../../../settings";
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
      "#90460C",
      false
    );

    this.passwordInput = new TextInput(
      { x: canvasWidth / 2 - 100, y: canvasHeight / 2 + 50 },
      400,
      40,
      "",
      "#90460C",
      true
    );

    window.addEventListener(
      "click",
      (e: MouseEvent) => {
        this.handleInputSelect(e.clientX, e.clientY);
        this.handleAuthClick(e.clientX, e.clientY);
      },
      { signal: this.controller.signal }
    );

    window.addEventListener(
      "keydown",
      (e: KeyboardEvent) => this.handleKeyDown(e),
      { signal: this.controller.signal }
    );
  }

  protected getInputData(): AuthType {
    return {
      username: this.nameInput.getText(),
      password: this.passwordInput.getText(),
    };
  }

  handleInputSelect(mouseX: number, mouseY: number): void {
    this.nameInput.toggleSelected({ x: mouseX, y: mouseY });
    this.passwordInput.toggleSelected({ x: mouseX, y: mouseY });
  }

  handleAuthClick(mouseX: number, mouseY: number) {
    if (this.actionButton.isClicked(mouseX, mouseY)) {
      this.handleAuth();
      this.removeEventListeners();
    }
  }

  handleKeyDown(e: KeyboardEvent): void {
    if (this.nameInput.getSelected()) {
      this.nameInput.updateText(e.key);
    }

    if (this.passwordInput.getSelected()) {
      this.passwordInput.updateText(e.key);
    }
  }

  removeEventListeners(): void {
    this.controller.abort();
  }

  handleAuth(): void {}

  draw(): void {
    super.draw();
    this.nameInput.draw();
    this.passwordInput.draw();
  }
}
