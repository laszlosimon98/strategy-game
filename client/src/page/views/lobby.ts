import { PageState } from "@/enums/pageState";
import { canvasWidth, canvasHeight } from "@/init";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { Frame } from "@/page/components/frame";
import { Plate } from "@/page/components/plate";
import { Text } from "@/page/components/text";
import { Page } from "@/page/views/page";
import { CommunicationHandler } from "@/communication/communicationHandler";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class Lobby extends Page {
  private backButton: Button;
  private start: Button;
  private info: Text;
  private playersContainer: Frame;
  private players: Record<string, Text>[] = [];
  private errorMessage: Text;

  private namePlate: Plate;
  private codePlate: Plate;

  public constructor(title: string) {
    super(title);

    this.namePlate = new Plate(
      settings.pos.mainMenu.namePlate,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "name"
    );

    this.codePlate = new Plate(
      settings.pos.mainMenu.codePlate,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "empty"
    );

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

    this.info = new Text(new Position(0, 0), "");

    this.playersContainer = new Frame(
      new Position(
        settings.pos.titlePos.x - settings.margin * 2,
        settings.pos.titlePos.y + settings.margin + 150
      ),
      new Dimension(580, Math.max(canvasHeight / 3, 200))
    );

    this.errorMessage = new Text(new Position(0, 0), "");

    this.handleCommunication();
    this.start.handleAsyncFunction = this.handleError;
  }

  public draw(): void {
    super.draw();
    this.namePlate.draw();
    this.codePlate.draw();
    this.info.draw();
    this.playersContainer.draw();
    this.errorMessage.draw();

    this.players.forEach((player) => {
      Object.values(player)[0].draw();
    });
  }

  public update(): void {
    super.update();
    if (this.namePlate.getText() !== StateManager.getPlayerName()) {
      this.namePlate.setText(StateManager.getPlayerName());
      this.namePlate.setCenter({
        xFrom: this.namePlate.getPos().x,
        xTo: this.namePlate.getDimension().width,
        yFrom: this.namePlate.getPos().y,
        yTo: this.namePlate.getDimension().height,
      });
    }

    this.codePlate.setCenter({
      xFrom: this.codePlate.getPos().x,
      xTo: this.codePlate.getDimension().width,
      yFrom: this.codePlate.getPos().y,
      yTo: this.codePlate.getDimension().height,
    });

    if (StateManager.isPlayerHost() && this.buttons.length === 1) {
      this.buttons.push(this.start);
    }

    if (!StateManager.isPlayerHost()) {
      this.buttons.splice(1, 1);
    }
  }

  private handleStart = () => {
    CommunicationHandler.sendMessage("game:starts", {});
  };

  private handleLeaveRoom = (): void => {
    CommunicationHandler.sendMessage("connect:disconnect", {});
    this.clearPage();
    StateManager.setPageState(PageState.NewGame);
  };

  private clearPage(): void {
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
        player
      );
      this.errorMessage.setText("");

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
    CommunicationHandler.receiveMessage(
      "connect:code",
      ({ code }: { code: string }) => {
        this.codePlate.setText(`${code}`);
      }
    );

    CommunicationHandler.receiveMessage(
      "connect:uniqueName",
      ({ name }: { name: string }) => {
        StateManager.setPlayerName(name);
      }
    );

    CommunicationHandler.receiveMessage(
      "connect:newPlayer",
      ({ players, message }: { players: string[]; message: string }) => {
        this.info.setText(message);
        this.info.setCenter({
          xFrom: 0,
          xTo: canvasWidth,
          yFrom: settings.pos.titlePos.y + settings.margin + 125,
          yTo: 0,
        });

        this.addNewPlayer(players);
      }
    );

    CommunicationHandler.receiveMessage(
      "connect:playerLeft",
      ({ name, message }: { name: string; message: string }) => {
        this.info.setText(message);
        this.info.setCenter({
          xFrom: 0,
          xTo: canvasWidth,
          yFrom: settings.pos.titlePos.y + settings.margin + 125,
          yTo: 0,
        });

        this.removePlayer(name);
      }
    );

    CommunicationHandler.receiveMessage(
      "connect:newHost",
      ({ name }: { name: string }) => {
        if (StateManager.getPlayerName() === name) {
          StateManager.setHost(true);
        }
      }
    );
  }

  private handleError = async () => {
    const error: string = await CommunicationHandler.receiveAsyncMessage(
      "connect:error"
    );

    if (error) {
      StateManager.setPageState(PageState.Lobby);
      this.errorMessage.setText(error);
      this.errorMessage.setCenter({
        xFrom: 0,
        xTo: canvasWidth,
        yFrom: settings.pos.default.back.y - 150,
        yTo: 0,
      });
    }
  };
}
