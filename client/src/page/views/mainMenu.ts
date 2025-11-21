import { authApi, userApi } from "@/api/api";
import { PageState } from "@/enums/pageState";
import { canvasWidth } from "@/init";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { Plate } from "@/page/components/plate";
import { Text } from "@/page/components/text";
import { Page } from "@/page/views/page";
import { settings } from "@/settings";
import type { StatisticType } from "@/types/statistic.type";
import { Position } from "@/utils/position";

interface PlayerData {
  username: string;
  statistic: {
    losses: number;
    wins: number;
  };
}

export class MainMenu extends Page {
  private newGame: Button;
  private statistic: Button;
  private login: Button;
  private registration: Button;
  private logout: Button;
  private namePlate: Plate;

  private error: Text;

  public constructor(title: string) {
    super(title);

    this.namePlate = new Plate(
      settings.pos.mainMenu.namePlate,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "name"
    );

    this.registration = new Button(
      settings.pos.mainMenu.registration,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "registration",
      () => StateManager.setPageState(PageState.Registration)
    );

    this.login = new Button(
      settings.pos.mainMenu.login,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "login",
      () => StateManager.setPageState(PageState.Login)
    );

    this.logout = new Button(
      settings.pos.mainMenu.logout,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "logout",
      async () => {
        const response = await authApi.post("/logout");

        if (response.status === 204) {
          StateManager.setAccessToken("");
          window.location.reload();
        }
      }
    );

    this.newGame = new Button(
      settings.pos.mainMenu.newGame,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "newGame",
      () => StateManager.setPageState(PageState.NewGame)
    );

    this.statistic = new Button(
      settings.pos.mainMenu.statistic,
      settings.size.button,
      StateManager.getImages("ui", "plate"),
      "statistic"
    );

    this.error = new Text(Position.zero(), "");

    this.buttons.push(this.newGame);
    this.buttons.push(this.statistic);
    this.statistic.handleAsyncFunction = this.fetchData.bind(this);

    if (StateManager.getAccessToken()) {
      this.buttons.push(this.logout);
    } else {
      this.buttons.push(this.login);
      this.buttons.push(this.registration);
    }
  }

  public draw(): void {
    super.draw();
    this.namePlate.draw();

    if (this.error.getText() !== "") {
      this.error.draw();
    }
  }

  public update(): void {
    if (this.namePlate.getText() !== StateManager.getPlayerName()) {
      this.namePlate.setText(StateManager.getPlayerName());
      this.namePlate.setCenter({
        xFrom: this.namePlate.getPos().x,
        xTo: this.namePlate.getDimension().width,
        yFrom: this.namePlate.getPos().y,
        yTo: this.namePlate.getDimension().height,
      });
    }

    if (this.error.getText() !== "") {
      this.error.setCenter({
        xFrom: 0,
        xTo: canvasWidth,
        yFrom: this.namePlate.getPos().y + 200,
        yTo: 0,
      });
    }
  }

  private async fetchData() {
    try {
      const playerData = await userApi.get("/statistic", {
        headers: {
          Authorization: `Bearer ${StateManager.getAccessToken()}`,
        },
      });

      const topfivePlayers = await userApi.get("/top-five", {
        headers: {
          Authorization: `Bearer ${StateManager.getAccessToken()}`,
        },
      });

      if (playerData.data) {
        const { username } = playerData.data;
        const { losses, wins } = playerData.data.statistic;

        const result: StatisticType = {
          username,
          losses,
          wins,
        };

        StateManager.savePlayerStat(result);
      }

      if (topfivePlayers.data) {
        const result: StatisticType[] = topfivePlayers.data.map(
          (player: PlayerData) => {
            return {
              username: player.username,
              losses: player.statistic.losses,
              wins: player.statistic.wins,
            };
          }
        );
        StateManager.saveTopFive(result);
      }

      StateManager.setPageState(PageState.Statistic);
    } catch (e) {
      this.error.setText("Megtekintés csak bejelentkezett felhasználóknak!");
    }
  }
}
