import { state } from "@/data/state";
import { PageState } from "@/enums/pageState";
import { canvasWidth } from "@/init";
import { Button } from "@/page/components/buttonComponents/button";
import { Text } from "@/page/components/textComponents/text";
import { TextInput } from "@/page/components/textComponents/textInput";
import { Page } from "@/page/views/page";
import { buttonPos } from "@/page/views/pos/buttonPos";
import { inputPos } from "@/page/views/pos/inputPos";
import { titlePos } from "@/page/views/pos/titlePos";
import { ServerHandler } from "@/server/serverHandler";
import {
  BUTTON_SIZE,
  INPUT_BACKGROUND_COLOR,
  BLACK_COLOR,
  MARGIN,
  ERROR_COLOR,
} from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

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
      BUTTON_SIZE,
      "name",
      "back",
      this.handleLeave
    );

    this.joinButton = new Button(
      buttonPos.default.next,
      BUTTON_SIZE,
      "name",
      "join",
      this.handleJoin
    );

    this.codeInput = new TextInput(
      inputPos.code,
      new Dimension(500, 40),
      "",
      INPUT_BACKGROUND_COLOR,
      false
    );

    this.codeText = new Text(
      inputPos.code,
      new Dimension(0, -40),
      "Játék kód:",
      false,
      BLACK_COLOR
    );

    this.buttons.push(this.joinButton);
    this.buttons.push(this.backButton);
    this.inputs.push(this.codeInput);

    this.errorMessage = new Text(
      new Position(canvasWidth / 2, titlePos.y + MARGIN * 2),
      Dimension.zero(),
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
      name: state.player.name,
    });
  };

  private handleLeave = () => {
    this.errorMessage.setText("");
    this.codeInput.setText("");
    state.navigation.pageState = PageState.NewGame;
  };

  private handleError = async () => {
    const error: string = await ServerHandler.receiveAsyncMessage(
      "connect:error"
    );

    if (error) {
      state.navigation.pageState = PageState.JoinGame;
      this.errorMessage.setText(error);
      this.codeInput.setText("");
    } else {
      state.navigation.pageState = PageState.Lobby;
      this.errorMessage.setText("");
      this.codeInput.setText("");
    }
  };
}
