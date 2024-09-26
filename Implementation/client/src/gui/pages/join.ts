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
import { globalState } from "../../data/data";

export class Join extends GUI {
  private backButton: Button;
  private joinButton: Button;
  private codeInput: TextInput;
  private codeText: Text;
  private isCodeValid: boolean;

  constructor(title: string) {
    super(title);

    this.isCodeValid = true;

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
      { ...inputPos.code },
      750,
      40,
      "",
      inputBackgroundColor,
      false
    );

    this.codeText = new Text(
      { ...inputPos.code },
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
      "connect:joined",
      ({ status }: { status: string }) => {
        this.isCodeValid = status === "success";
        console.log("server");
      }
    );
  }

  draw(): void {
    super.draw();
    this.codeInput.draw();
    this.codeText.draw();
  }

  private handleJoin(): void {
    ServerHandler.sendMessage("connect:join", {
      code: this.codeInput.getText(),
      name: globalState.playerName,
    });

    if (!this.isCodeValid) {
      this.joinButton.setNextState(GameState.JoinGame);
    } else {
      this.joinButton.setNextState(GameState.Lobby);
    }
    console.log(this.joinButton.getNextState());
  }
}
