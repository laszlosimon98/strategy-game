import { PageState } from "@/enums/pageState";
import { canvasWidth } from "@/init";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { Text } from "@/page/components/text";
import { TextInput } from "@/page/components/textInput";
import { Page } from "@/page/views/page";
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
      settings.pos.default.back,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "back",
      this.handleLeave
    );

    this.joinButton = new Button(
      settings.pos.default.next,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "join",
      this.handleJoin
    );

    this.codeText = new Text(Position.zero(), "Játék kód:", {
      color: settings.color.black,
    });

    this.codeText.setCenter({
      xFrom: 0,
      xTo: canvasWidth - 375,
      yFrom: settings.pos.code.y - 25,
      yTo: 0,
    });

    this.codeInput = new TextInput(settings.pos.code, new Dimension(500, 40));

    this.buttons.push(this.joinButton);
    this.buttons.push(this.backButton);
    this.inputs.push(this.codeInput);

    this.errorMessage = new Text(
      new Position(0, settings.pos.titlePos.y + settings.margin * 2),
      "",
      { color: settings.color.error }
    );

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
      name: StateManager.getPlayerName(),
    });
  };

  private handleLeave = () => {
    this.errorMessage.setText("");
    this.codeInput.clearText();
    StateManager.setPageState(PageState.NewGame);
  };

  private handleError = async () => {
    const error: string = await ServerHandler.receiveAsyncMessage(
      "connect:error"
    );

    if (error) {
      StateManager.setPageState(PageState.JoinGame);
      this.errorMessage.setText(error);
      this.errorMessage.setCenter({
        xFrom: 0,
        xTo: canvasWidth,
        yFrom: settings.pos.titlePos.y + settings.margin + 100,
        yTo: 0,
      });
      this.codeInput.clearText();
    } else {
      StateManager.setPageState(PageState.Lobby);
      this.errorMessage.setText("");
      this.codeInput.clearText();
    }
  };
}
