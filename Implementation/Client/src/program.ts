import { GameState } from "./enums/gameState";
import { titles } from "./gui/imports/titles";
import { Description } from "./gui/pages/description";
import { GUI } from "./gui/pages/gui";
import { Join } from "./gui/pages/join";
import { Lobby } from "./gui/pages/lobby";
import { Login } from "./gui/pages/auth/login";
import { MainMenu } from "./gui/pages/mainMenu";
import { NewGame } from "./gui/pages/newGame";
import { Statistic } from "./gui/pages/statistic";
import { canvasHeight, canvasWidth, ctx } from "./init";
import { bcgColor } from "./settings";
import { Registration } from "./gui/pages/auth/registration";
import { buttonImages } from "./gui/imports/buttons";

export class Program {
  private gui: GUI;

  constructor(private readonly controller: AbortController) {
    this.gui = new MainMenu(titles.menu);

    document.addEventListener(
      "click",
      () => {
        const isAnyButtonClicked = this.gui
          .getButtons()
          .some((btn) => btn.isButtonClicked() && btn.isSuccessFull());

        if (isAnyButtonClicked) {
          this.gui.getButtons().map((button) => {
            button.removeEventListener();
          });

          if (this.gui.getState() !== GameState.Game) {
            this.updateGUIState();
          }
        }
      },
      { signal: this.controller.signal }
    );
  }

  updateGUIState(): void {
    switch (this.gui.getState()) {
      case GameState.MainMenu:
        this.gui = new MainMenu(titles.menu);
        break;
      case GameState.Statistic:
        this.gui = new Statistic(titles.statistic);
        break;
      case GameState.Description:
        this.gui = new Description(titles.description);
        break;
      case GameState.Login:
        this.gui = new Login(titles.login, buttonImages.login);
        break;
      case GameState.Registration:
        this.gui = new Registration(
          titles.registration,
          buttonImages.registration
        );
        break;
      case GameState.NewGame:
        this.gui = new NewGame(titles.newGame);
        break;
      case GameState.JoinGame:
        this.gui = new Join(titles.connect);
        break;
      case GameState.Lobby:
        this.gui = new Lobby(titles.lobby);
        break;
    }
  }

  draw(): void {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (this.gui.getState() !== GameState.Game) {
      ctx.fillStyle = bcgColor;
      this.gui.draw();
    } else {
      ctx.fillStyle = "#000";
    }
  }

  update(dt: number): void {}
}
