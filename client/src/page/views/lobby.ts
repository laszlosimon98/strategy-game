import { PageState } from "@/enums/pageState";
import { canvasWidth, canvasHeight } from "@/init";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { Frame } from "@/page/components/frame";
import { Text } from "@/page/components/text";
import { Page } from "@/page/views/page";
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
      settings.pos.default.next,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "start",
      this.handleStart
    );

    this.backButton = new Button(
      settings.pos.default.back,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "back",
      this.handleLeaveRoom
    );

    this.buttons.push(this.backButton);

    this.playerLabel = new Text(
      new Position(0, settings.pos.titlePos.y + settings.margin + 55),
      StateManager.getPlayerName(),
      { color: settings.color.black }
    );

    this.playerLabel.setCenter({
      xFrom: 0,
      xTo: canvasWidth,
      yFrom: settings.pos.titlePos.y + settings.margin + 55,
      yTo: 0,
    });

    this.gameCode = new Text(
      new Position(
        settings.pos.titlePos.x - settings.margin * 2,
        settings.pos.titlePos.y + settings.margin + 100
      ),
      "Játék Kód:",
      { color: settings.color.black }
    );

    this.info = new Text(new Position(0, 0), "");

    this.playersContainer = new Frame(
      new Position(
        settings.pos.titlePos.x - settings.margin * 2,
        settings.pos.titlePos.y + settings.margin + 150
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
    if (this.playerLabel.getText() !== StateManager.getPlayerName()) {
      this.playerLabel.setText(StateManager.getPlayerName());
    }

    if (StateManager.isPlayerHost() && this.buttons.length === 1) {
      this.buttons.push(this.start);
    }

    if (!StateManager.isPlayerHost()) {
      this.buttons.splice(1, 1);
    }
  }

  private handleStart = () => {
    ServerHandler.sendMessage("game:starts", {});
  };

  private handleLeaveRoom = (): void => {
    ServerHandler.sendMessage("connect:disconnect", {});
    this.clearPage();
    StateManager.setPageState(PageState.NewGame);
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
        player,
        { color: settings.color.text }
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
        this.info.setCenter({
          xFrom: 0,
          xTo: canvasWidth,
          yFrom: settings.pos.titlePos.y + settings.margin + 125,
          yTo: 0,
        });

        this.addNewPlayer(players);
      }
    );

    ServerHandler.receiveMessage(
      "connect:playerLeft",
      ({ name, message }: { name: string; message: string }) => {
        this.info.setText(message);
        this.info.setCenter({
          xFrom: 0,
          xTo: canvasWidth,
          yFrom: settings.pos.titlePos.y + settings.margin + 125,
          yTo: 0,
        });

        this.info.setColor(settings.color.error);

        this.removePlayer(name);
      }
    );

    ServerHandler.receiveMessage(
      "connect:newHost",
      ({ name }: { name: string }) => {
        if (StateManager.getPlayerName() === name) {
          StateManager.setHost(true);
        }
      }
    );
  }
}
