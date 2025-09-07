import { state } from "@/data/state";
import { PageState } from "@/enums/pageState";
import { canvasWidth, canvasHeight } from "@/init";
import { Button } from "@/page/components/buttonComponents/button";
import { Frame } from "@/page/components/frameComponets/frame";
import { Text } from "@/page/components/textComponents/text";
import { Page } from "@/page/views/page";
import { buttonPos } from "@/page/views/pos/buttonPos";
import { titlePos } from "@/page/views/pos/titlePos";
import { ServerHandler } from "@/server/serverHandler";
import {
  BUTTON_SIZE,
  MARGIN,
  BLACK_COLOR,
  TEXT_COLOR,
  INFO_COLOR,
  ERROR_COLOR,
} from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class Lobby extends Page {
  private backButton: Button;
  private start: Button;
  private gameCode: Text;
  private info: Text;
  private playersContainer: Frame;
  private players: Record<string, Text>[] = [];
  private playerLabel: Text;

  public constructor(title: string) {
    super(title);

    this.start = new Button(
      buttonPos.default.next,
      BUTTON_SIZE,
      "name",
      "start",
      this.handleStart
    );

    this.backButton = new Button(
      buttonPos.default.back,
      BUTTON_SIZE,
      "name",
      "back",
      this.handleLeaveRoom
    );

    this.buttons.push(this.backButton);

    this.playerLabel = new Text(
      new Position(canvasWidth / 2, titlePos.y + MARGIN + 55),
      new Dimension(0, -20),
      state.player.name,
      false,
      BLACK_COLOR
    );
    this.playerLabel.setCenter();

    this.gameCode = new Text(
      new Position(titlePos.x - MARGIN * 2, titlePos.y + MARGIN + 80),
      new Dimension(0, -20),
      "Játék Kód:",
      false,
      BLACK_COLOR
    );

    this.info = new Text(
      new Position(canvasWidth / 2, titlePos.y + MARGIN + 115),
      new Dimension(0, -20),
      "",
      false
    );
    this.info.setCenter();

    this.playersContainer = new Frame(
      new Position(titlePos.x - MARGIN * 2, titlePos.y + MARGIN + 125),
      new Dimension(580, Math.max(canvasHeight / 3, 200))
    );

    this.handleCommunication();
  }

  public draw(): void {
    super.draw();
    this.gameCode.draw();
    this.info.draw();
    this.playersContainer.draw();
    this.playerLabel.draw();

    this.players.forEach((player) => {
      Object.values(player)[0].draw();
    });
  }

  public update(): void {
    super.update();
    if (this.playerLabel.getText() !== state.player.name) {
      this.playerLabel.setText(state.player.name);
    }

    if (state.player.host && this.buttons.length === 1) {
      this.buttons.push(this.start);
    }

    if (!state.player.host) {
      this.buttons.splice(1, 1);
    }
  }

  private handleStart = () => {
    ServerHandler.sendMessage("game:starts", {});
  };

  private handleLeaveRoom = (): void => {
    ServerHandler.sendMessage("connect:disconnect", {});
    this.clearPage();
    state.navigation.pageState = PageState.NewGame;
  };

  private clearPage(): void {
    this.gameCode.setText("Játék Kód:");
    this.info.setText("");
    this.players = [];
  }

  private addNewPlayer(players: string[]): void {
    const newPlayers = players.map((player, index) => {
      const text = new Text(
        new Position(
          this.playersContainer.getPos().x + MARGIN / 2,
          this.playersContainer.getPos().y +
            MARGIN / 1.5 +
            (MARGIN / 1.5) * index
        ),
        new Dimension(0, -40),
        player,
        false,
        TEXT_COLOR
      );

      return { [player]: text };
    });

    this.players = newPlayers;
  }

  private removePlayer(name: string): void {
    this.players = this.players.filter(
      (player) => Object.keys(player)[0] !== name
    );
    this.updatePlayersPos();
  }

  private updatePlayersPos(): void {
    this.players.forEach((player, index) => {
      const pos: Position = Object.values(player)[0].getPos();
      const newY =
        this.playersContainer.getPos().y +
        MARGIN / 1.5 +
        (MARGIN / 1.5) * index;

      Object.values(player)[0].setPos(new Position(pos.x, newY));
    });
  }

  private handleCommunication(): void {
    ServerHandler.receiveMessage(
      "connect:code",
      ({ code }: { code: string }) => {
        this.gameCode.setText(`Játék Kód: ${code}`);
      }
    );

    ServerHandler.receiveMessage(
      "connect:newPlayer",
      ({ players, message }: { players: string[]; message: string }) => {
        this.info.setText(message);
        this.info.setColor(INFO_COLOR);

        this.addNewPlayer(players);
      }
    );

    ServerHandler.receiveMessage(
      "connect:playerLeft",
      ({ name, message }: { name: string; message: string }) => {
        this.info.setText(message);
        this.info.setColor(ERROR_COLOR);

        this.removePlayer(name);
      }
    );
  }
}
