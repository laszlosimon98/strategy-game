import { PageState } from "@/enums/pageState";
import { canvasWidth, canvasHeight } from "@/init";
import { GameStateManager } from "@/manager/gameStateManager";
import { Button } from "@/page/components/button";
import { Frame } from "@/page/components/frame";
import { Text } from "@/page/components/text";
import { Page } from "@/page/views/page";
import { buttonPos } from "@/page/views/pos/buttonPos";
import { titlePos } from "@/page/views/pos/titlePos";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";
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
      settings.size.button,
      "name",
      "start",
      this.handleStart
    );

    this.backButton = new Button(
      buttonPos.default.back,
      settings.size.button,
      "name",
      "back",
      this.handleLeaveRoom
    );

    this.buttons.push(this.backButton);

    this.playerLabel = new Text(
      new Position(canvasWidth / 2, titlePos.y + settings.margin + 55),
      new Dimension(0, -20),
      GameStateManager.getPlayerName(),
      false,
      settings.color.black
    );
    this.playerLabel.setCenter();

    this.gameCode = new Text(
      new Position(
        titlePos.x - settings.margin * 2,
        titlePos.y + settings.margin + 80
      ),
      new Dimension(0, -20),
      "Játék Kód:",
      false,
      settings.color.black
    );

    this.info = new Text(
      new Position(canvasWidth / 2, titlePos.y + settings.margin + 115),
      new Dimension(0, -20),
      "",
      false
    );
    this.info.setCenter();

    this.playersContainer = new Frame(
      new Position(
        titlePos.x - settings.margin * 2,
        titlePos.y + settings.margin + 125
      ),
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
    if (this.playerLabel.getText() !== GameStateManager.getPlayerName()) {
      this.playerLabel.setText(GameStateManager.getPlayerName());
    }

    if (GameStateManager.isPlayerHost() && this.buttons.length === 1) {
      this.buttons.push(this.start);
    }

    if (!GameStateManager.isPlayerHost()) {
      this.buttons.splice(1, 1);
    }
  }

  private handleStart = () => {
    ServerHandler.sendMessage("game:starts", {});
  };

  private handleLeaveRoom = (): void => {
    ServerHandler.sendMessage("connect:disconnect", {});
    this.clearPage();
    GameStateManager.setPageState(PageState.NewGame);
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
          this.playersContainer.getPos().x + settings.margin / 2,
          this.playersContainer.getPos().y +
            settings.margin / 1.5 +
            (settings.margin / 1.5) * index
        ),
        new Dimension(0, -40),
        player,
        false,
        settings.color.text
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
        settings.margin / 1.5 +
        (settings.margin / 1.5) * index;

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
        this.info.setColor(settings.color.info);

        this.addNewPlayer(players);
      }
    );

    ServerHandler.receiveMessage(
      "connect:playerLeft",
      ({ name, message }: { name: string; message: string }) => {
        this.info.setText(message);
        this.info.setColor(settings.color.error);

        this.removePlayer(name);
      }
    );
  }
}
