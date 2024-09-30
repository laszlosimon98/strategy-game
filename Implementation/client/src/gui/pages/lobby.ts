import { globalState } from "../../data/data";
import { PageState } from "../../enums/pageState";
import { canvasHeight } from "../../init";
import { ServerHandler } from "../../server/serverHandler";
import {
  BLACK_COLOR,
  BUTTON_SIZE,
  ERROR_COLOR,
  INFO_COLOR,
  MARGIN,
  TEXT_COLOR,
} from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { Frame } from "../components/frameComponets/frame";
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
  private playersContainer: Frame;
  private players: Record<string, Text>[] = [];
  private playerLabel: Text;

  constructor(title: string) {
    super(title);

    this.start = new Button(
      buttonPos.default.next,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.start,
      () => (globalState.state = PageState.Game)
    );

    this.backButton = new Button(
      buttonPos.default.back,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.back,
      () => this.handleLeaveRoom()
    );

    this.buttons.push(this.start);
    this.buttons.push(this.backButton);

    this.gameCode = new Text(
      { x: titlePos.x - MARGIN * 2, y: titlePos.y + MARGIN * 2.5 },
      0,
      0,
      "Játék Kód:",
      false,
      BLACK_COLOR
    );

    this.playerLabel = new Text(
      { x: 0, y: titlePos.y + MARGIN * 2 },
      0,
      0,
      globalState.playerName,
      false,
      BLACK_COLOR
    );
    this.playerLabel.setCenter();

    this.info = new Text({ x: 0, y: titlePos.y + MARGIN * 3 }, 0, 0, "", false);
    this.info.setCenter();

    this.playersContainer = new Frame(
      { x: titlePos.x - MARGIN * 2, y: titlePos.y + MARGIN * 3 },
      580,
      canvasHeight / 3
    );

    this.handleCommunication();
  }

  draw(): void {
    super.draw();
    this.gameCode.draw();
    this.info.draw();
    this.playersContainer.draw();
    this.playerLabel.draw();

    this.players.forEach((player) => {
      Object.values(player)[0].draw();
    });
  }

  update(): void {
    super.update();
    if (this.playerLabel.getText() !== globalState.playerName) {
      this.playerLabel.setText(globalState.playerName);
    }
  }

  private handleLeaveRoom(): void {
    ServerHandler.sendMessage("connect:disconnect", globalState.code);
    this.clearPage();
    globalState.state = PageState.NewGame;
  }

  private clearPage(): void {
    globalState.code = "";
    this.gameCode.setText("Játék Kód:");
    this.info.setText("");
    this.players = [];
  }

  private addNewPlayer(players: { playerId: string; name: string }[]): void {
    const newPlayers = players.map((player, index) => {
      const text = new Text(
        {
          x: this.playersContainer.getPos().x + MARGIN / 2,
          y:
            this.playersContainer.getPos().y +
            MARGIN / 1.5 +
            (MARGIN / 1.5) * index,
        },
        0,
        0,
        player.name,
        false,
        TEXT_COLOR
      );

      return { [player.playerId]: text };
    });

    this.players = newPlayers;
  }

  private removePlayer(id: string): void {
    this.players = this.players.filter(
      (player) => Object.keys(player)[0] !== id
    );
    this.updatePlayersPos();
  }

  private updatePlayersPos(): void {
    this.players.forEach((player, index) => {
      const { x, y } = Object.values(player)[0].getPos();
      const newY =
        this.playersContainer.getPos().y +
        MARGIN / 1.5 +
        (MARGIN / 1.5) * index;
      Object.values(player)[0].setPos({ x, y: newY });
    });
  }

  private handleCommunication(): void {
    ServerHandler.receiveMessage(
      "connect:code",
      ({ code }: { code: string }) => {
        globalState.code = code;
        this.gameCode.setText(`Játék Kód: ${globalState.code}`);
      }
    );

    ServerHandler.receiveMessage(
      "connect:newPlayer",
      ({
        players,
        message,
      }: {
        players: { playerId: string; name: string }[];
        message: string;
      }) => {
        this.info.setText(message);
        this.info.setColor(INFO_COLOR);

        this.addNewPlayer(players);
      }
    );

    ServerHandler.receiveMessage(
      "connect:playerLeft",
      ({ id, message }: { id: string; message: string }) => {
        this.info.setText(message);
        this.info.setColor(ERROR_COLOR);

        this.removePlayer(id);
      }
    );
  }
}
