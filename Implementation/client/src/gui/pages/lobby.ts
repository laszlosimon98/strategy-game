import { globalState } from "../../data/data";
import { GameState } from "../../enums/gameState";
import { ServerHandler } from "../../server/serverHandler";
import {
  blackColor,
  buttonSize,
  errorColor,
  infoColor,
  margin,
} from "../../settings";
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
  private info: Text;

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

    this.info = new Text({ x: 0, y: titlePos.y + margin * 3 }, 0, 0, "", false);

    this.info.setCenter();

    ServerHandler.receiveMessage(
      "connect:code",
      ({ code }: { code: string }) => {
        globalState.code = code;
        this.gameCode.setText(`Játék Kód: ${globalState.code}`);
      }
    );

    ServerHandler.receiveMessage("connect:newPlayer", (message: string) => {
      this.info.setText(message);
      this.info.setColor(infoColor);
    });

    ServerHandler.receiveMessage("connect:playerLeft", (message: string) => {
      this.info.setText(message);
      this.info.setColor(errorColor);
    });
  }

  draw(): void {
    super.draw();
    this.gameCode.draw();
    this.info.draw();
  }

  handleLeaveRoom(): void {
    ServerHandler.sendMessage("connect:disconnect", globalState.code);
  }
}
