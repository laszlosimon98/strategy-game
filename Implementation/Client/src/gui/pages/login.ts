import { bcgColor, buttonSize } from "../../settings";
import { Button } from "../components/button";
import { GameState } from "../../enums/gameState";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";
import { TextInput } from "../components/textInput";
import { canvasHeight, canvasWidth } from "../../init";

export class Login extends GUI {
  private backButton: Button;
  private login: Button;
  private nameInput: TextInput;
  private passwordInput: TextInput;

  constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.default.back,
      buttonSize.width,
      buttonSize.height,
      buttonImages.back,
      GameState.MainMenu
    );

    this.login = new Button(
      buttonPos.default.next,
      buttonSize.width,
      buttonSize.height,
      buttonImages.login,
      GameState.MainMenu
    );

    this.buttons.push(this.backButton);
    this.buttons.push(this.login);

    this.nameInput = new TextInput(
      { x: canvasWidth / 2 - 100, y: canvasHeight / 2 - 50 },
      400,
      40,
      "",
      "#90460C"
    );

    this.passwordInput = new TextInput(
      { x: canvasWidth / 2 - 100, y: canvasHeight / 2 + 50 },
      400,
      40,
      "",
      "#90460C"
    );

    window.addEventListener("click", (e: MouseEvent) => {
      const [mouseX, mouseY] = [e.clientX, e.clientY];
      this.nameInput.toggleSelected({ x: mouseX, y: mouseY });
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (this.nameInput.getSelected()) {
        this.nameInput.updateText(e.key);
      }
    });
  }

  draw(): void {
    super.draw();
    this.nameInput.draw();
    this.passwordInput.draw();
  }
}
