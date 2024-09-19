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

  constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.default.back,
      buttonSize.width,
      buttonSize.height,
      buttonImages.back,
      () => this.setState(GameState.NewGame)
    );

    this.joinButton = new Button(
      buttonPos.default.next,
      buttonSize.width,
      buttonSize.height,
      buttonImages.join,
      () => this.setState(GameState.Lobby)
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
  }

  draw(): void {
    super.draw();
    this.codeInput.draw();
  }
}
