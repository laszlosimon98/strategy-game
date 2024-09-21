import { blackColor, buttonSize, inputBackgroundColor } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";
import { TextInput } from "../components/textComponents/textInput";
import { inputPos } from "./pos/inputPos";
import { GameState } from "../../enums/gameState";
import { Text } from "../components/textComponents/text";
import { ServerHandler } from "../../server/serverHandler";

export class Join extends GUI {
  private backButton: Button;
  private joinButton: Button;
  private codeInput: TextInput;
  private codeText: Text;

  constructor(title: string) {
    super(title);

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
      GameState.Lobby,
      () => this.handleJoin()
    );

    this.codeInput = new TextInput(
      { x: inputPos.code.x, y: inputPos.code.y },
      750,
      40,
      "",
      inputBackgroundColor,
      false
    );

    this.codeText = new Text(
      {
        x: inputPos.code.x,
        y: inputPos.code.y,
      },
      0,
      0,
      "Játék kód:",
      false,
      blackColor
    );

    this.buttons.push(this.joinButton);
    this.buttons.push(this.backButton);
    this.inputs.push(this.codeInput);

    ServerHandler.receiveMessage(
      "game:joined",
      ({ status }: { status: string }) => {
        if (status === "failed") {
          console.log("failed");
          this.joinButton.setNextState(GameState.JoinGame);
          console.log(this.joinButton);
        } else {
          this.joinButton.setNextState(GameState.Lobby);
        }
      }
    );
  }

  draw(): void {
    super.draw();
    this.codeInput.draw();
    this.codeText.draw();
  }

  private handleJoin(): void {
    ServerHandler.sendMessage("game:join", { code: this.codeInput.getText() });
  }
}
