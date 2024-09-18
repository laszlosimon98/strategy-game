import { buttonSize, inputBackgroundColor } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { GameState } from "../../enums/gameState";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";
import { TextInput } from "../components/textComponents/textInput";
import { inputPos } from "./pos/inputPos";

export class Join extends GUI {
  private backButton: Button;
  private joinButton: Button;
  private codeInput: TextInput;

  private readonly controller: AbortController;

  constructor(title: string) {
    super(title);

    this.controller = new AbortController();

    this.backButton = new Button(
      buttonPos.default.back,
      buttonSize.width,
      buttonSize.height,
      buttonImages.back,
      GameState.NewGame
    );

    this.joinButton = new Button(
      buttonPos.default.next,
      buttonSize.width,
      buttonSize.height,
      buttonImages.join,
      GameState.Lobby
    );

    this.buttons.push(this.joinButton);
    this.buttons.push(this.backButton);

    this.codeInput = new TextInput(
      { x: inputPos.code.x, y: inputPos.code.y },
      750,
      40,
      "",
      inputBackgroundColor,
      false
    );

    document.addEventListener(
      "click",
      (e: MouseEvent) => {
        if (
          this.backButton.isClicked(e.clientX, e.clientY) ||
          this.joinButton.isClicked(e.clientX, e.clientY)
        ) {
          this.codeInput.removeEventListeners();
          this.controller.abort();
        }
      },
      { signal: this.controller.signal }
    );
  }

  draw(): void {
    super.draw();
    this.codeInput.draw();
  }
}
