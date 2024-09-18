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
  private state: GameState;
  private gui: GUI;

  constructor(private readonly controller: AbortController) {
    this.state = GameState.MainMenu;
    this.gui = new MainMenu(titles.menu);

    window.addEventListener(
      "mousedown",
      (e: MouseEvent) => {
        if (this.state !== GameState.Game) {
          const [mouseX, mouseY] = [e.clientX, e.clientY];

          this.gui.getButtons().map((button) => {
            if (button.isClicked(mouseX, mouseY)) {
              this.state = button.getState();
              this.gui.clearbuttons();
              this.updateGui(this.state);

              if (this.state === GameState.Game) {
                this.controller.abort();
              }
            }
          });
        }
      },
      { signal: this.controller.signal }
    );
  }

  private updateGui(state: GameState): void {
    switch (state) {
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
        this.gui = new Join("");
        break;
      case GameState.Lobby:
        this.gui = new Lobby(titles.lobby);
        break;
    }
  }

  draw(): void {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (this.state !== GameState.Game) {
      ctx.fillStyle = bcgColor;
      this.gui.draw();
    } else {
      ctx.fillStyle = "#000";
    }
  }

  update(dt: number): void {}
}
