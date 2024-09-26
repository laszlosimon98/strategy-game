import { GameState } from "../../enums/gameState";
import { ServerHandler } from "../../server/serverHandler";
import { blackColor, buttonSize, margin } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { Text } from "../components/textComponents/text";
import { buttonImages } from "../imports/buttons";
import { GUI } from "./gui";
import { buttonPos } from "./pos/buttonPos";
import { titlePos } from "./pos/titlePos";

export class Lobby extends GUI {
  private backButton: Button;
  private start: Button;
  private gameCode: Text;

  constructor(title: string) {
    super(title);

    this.start = new Button(
      buttonPos.default.next,
      buttonSize.width,
      buttonSize.height,
      buttonImages.start,
      GameState.Game
    );

    this.backButton = new Button(
      buttonPos.default.back,
      buttonSize.width,
      buttonSize.height,
      buttonImages.back,
      GameState.NewGame,
      () => this.handleLeaveRoom()
    );

    this.buttons.push(this.start);
    this.buttons.push(this.backButton);

    this.gameCode = new Text(
      { x: titlePos.x - margin * 2, y: titlePos.y + margin * 2.5 },
      0,
      0,
      "Játék Kód:",
      false,
      blackColor
    );

    ServerHandler.receiveMessage(
      "connect:created",
      ({ code }: { code: string }) => {
        this.gameCode.setText(this.gameCode.getText() + " " + code);
      }
    );

    ServerHandler.receiveMessage(
      "connect:newPlayer",
      ({ id, message }: { id: string; message: string }) => {
        console.warn(id, message);
      }
    );

    ServerHandler.receiveMessage(
      "connect:code",
      ({ code }: { code: string }) => {
        this.gameCode.setText(this.gameCode.getText() + " " + code);
      }
    );

    ServerHandler.receiveMessage("connect:playerLeft", (message: string) => {
      console.error(message);
    });
  }

  draw(): void {
    super.draw();
    this.gameCode.draw();
  }

  handleLeaveRoom(): void {
    ServerHandler.sendMessage(
      "connect:disconnect",
      this.gameCode.getText().split(" ")[2]
    );
  }
}
