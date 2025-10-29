import { authApi } from "@/api/api";
import { PageState } from "@/enums/pageState";
import { StateManager } from "@/manager/stateManager";
import { Button } from "@/page/components/button";
import { Plate } from "@/page/components/plate";
import { Page } from "@/page/views/page";
import { settings } from "@/settings";

export class MainMenu extends Page {
  private newGame: Button;
  private statistic: Button;
  private login: Button;
  private registration: Button;
  private logout: Button;
  private namePlate: Plate;

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
      "statistic",
      () => StateManager.setPageState(PageState.Statistic)
    );

    this.buttons.push(this.newGame);
    this.buttons.push(this.statistic);

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
  }
}
