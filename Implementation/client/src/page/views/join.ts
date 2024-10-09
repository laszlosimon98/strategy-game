import { Button } from "../components/buttonComponents/button";
import { buttonImages } from "../imports/buttons";
import { buttonPos } from "./pos/buttonPos";
import { TextInput } from "../components/textComponents/textInput";
import { inputPos } from "./pos/inputPos";
import { PageState } from "../../states/pageState";
import { Text } from "../components/textComponents/text";
import { ServerHandler } from "../../server/serverHandler";
import { globalState } from "../../data/data";
import {
  BLACK_COLOR,
  BUTTON_SIZE,
  ERROR_COLOR,
  INPUT_BACKGROUND_COLOR,
  MARGIN,
} from "../../settings";
import { titlePos } from "./pos/titlePos";
import { Page } from "./page";
import { Position } from "../../utils/position";

export class Join extends Page {
  private backButton: Button;
  private joinButton: Button;
  private codeInput: TextInput;
  private codeText: Text;
  private errorMessage: Text;

  public constructor(title: string) {
    super(title);

    this.backButton = new Button(
      buttonPos.default.back,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.back,
      this.handleLeave
    );

    this.joinButton = new Button(
      buttonPos.default.next,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.join,
      this.handleJoin
    );

    this.codeInput = new TextInput(
      inputPos.code,
      500,
      40,
      "",
      INPUT_BACKGROUND_COLOR,
      false
    );

    this.codeText = new Text(
      inputPos.code,
      0,
      0,
      "Játék kód:",
      false,
      BLACK_COLOR
    );

    this.buttons.push(this.joinButton);
    this.buttons.push(this.backButton);
    this.inputs.push(this.codeInput);

    this.errorMessage = new Text(
      new Position(0, titlePos.y + MARGIN * 2),
      0,
      0,
      "",
      false,
      ERROR_COLOR
    );
    this.errorMessage.setCenter();

    this.joinButton.handleError = this.handleError;
  }

  public draw(): void {
    super.draw();
    this.codeInput.draw();
    this.codeText.draw();
    this.errorMessage.draw();
  }

  private handleJoin = () => {
    ServerHandler.sendMessage("connect:join", {
      code: this.codeInput.getText(),
      name: globalState.playerName,
    });
  };

  private handleLeave = () => {
    this.errorMessage.setText("");
    this.codeInput.setText("");
    globalState.state = PageState.NewGame;
  };

  private handleError = async () => {
    const error: string = await ServerHandler.receiveAsyncMessage(
      "connect:error"
    );

    if (error) {
      globalState.state = PageState.JoinGame;
      this.errorMessage.setText(error);
      this.codeInput.setText("");
    } else {
      globalState.state = PageState.Lobby;
      this.errorMessage.setText("");
      this.codeInput.setText("");
    }
  };
}
