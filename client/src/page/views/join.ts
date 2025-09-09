import { PageState } from "@/enums/pageState";
import { canvasWidth } from "@/init";
import { GameStateManager } from "@/manager/gameStateManager";
import { Button } from "@/page/components/button";
import { Text } from "@/page/components/text";
import { TextInput } from "@/page/components/textInput";
import { Page } from "@/page/views/page";
import { buttonPos } from "@/page/views/pos/buttonPos";
import { inputPos } from "@/page/views/pos/inputPos";
import { titlePos } from "@/page/views/pos/titlePos";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";
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
      settings.size.button,
      "name",
      "back",
      this.handleLeave
    );

    this.joinButton = new Button(
      buttonPos.default.next,
      settings.size.button,
      "name",
      "join",
      this.handleJoin
    );

    this.codeInput = new TextInput(
      inputPos.code,
      new Dimension(500, 40),
      "",
      settings.color.inputBackground,
      false
    );

    this.codeText = new Text(
      inputPos.code,
      new Dimension(0, -40),
      "Játék kód:",
      false,
      settings.color.black
    );

    this.buttons.push(this.joinButton);
    this.buttons.push(this.backButton);
    this.inputs.push(this.codeInput);

    this.errorMessage = new Text(
      new Position(canvasWidth / 2, titlePos.y + settings.margin * 2),
      Dimension.zero(),
      "",
      false,
      settings.color.error
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
      name: GameStateManager.getPlayerName(),
    });
  };

  private handleLeave = () => {
    this.errorMessage.setText("");
    this.codeInput.setText("");
    GameStateManager.setPageState(PageState.NewGame);
  };

  private handleError = async () => {
    const error: string = await ServerHandler.receiveAsyncMessage(
      "connect:error"
    );

    if (error) {
      GameStateManager.setPageState(PageState.JoinGame);
      this.errorMessage.setText(error);
      this.codeInput.setText("");
    } else {
      GameStateManager.setPageState(PageState.Lobby);
      this.errorMessage.setText("");
      this.codeInput.setText("");
    }
  };
}
