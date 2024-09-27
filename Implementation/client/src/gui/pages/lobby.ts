import { globalState } from "../../data/data";
import { GameState } from "../../enums/gameState";
import { ServerHandler } from "../../server/serverHandler";
import {
  BLACK_COLOR,
  BUTTON_SIZE,
  ERROR_COLOR,
  INFO_COLOR,
  MARGIN,
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
  private players: Record<string, Text>[] = [];

  constructor(title: string) {
    super(title);

    this.start = new Button(
      buttonPos.default.next,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.start,
      GameState.Game
    );

    this.backButton = new Button(
      buttonPos.default.back,
      BUTTON_SIZE.width,
      BUTTON_SIZE.height,
      buttonImages.back,
      GameState.NewGame,
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

    this.info = new Text({ x: 0, y: titlePos.y + MARGIN * 3 }, 0, 0, "", false);
    this.info.setCenter();

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

  draw(): void {
    super.draw();
    this.gameCode.draw();
    this.info.draw();

    this.players.forEach((player) => {
      Object.values(player)[0].draw();
    });
  }

  private handleLeaveRoom(): void {
    ServerHandler.sendMessage("connect:disconnect", globalState.code);
  }

  private addNewPlayer(players: { playerId: string; name: string }[]): void {
    const newPlayers = players.map((player, index) => {
      const text = new Text(
        {
          x: titlePos.x - MARGIN,
          y: titlePos.y + MARGIN * (4 + 0.5 * index),
        },
        0,
        0,
        player.name,
        false,
        BLACK_COLOR
      );

      return { [player.playerId]: text };
    });

    this.players = newPlayers;
  }

  private removePlayer(id: string): void {
    this.players = this.players.filter(
      (player) => Object.keys(player)[0] !== id
    );
  }
}
