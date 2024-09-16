import { GameState } from "./enums/gameState";
import { Description } from "./gui/pages/description";
import { GUI } from "./gui/pages/gui";
import { Join } from "./gui/pages/join";
import { Lobby } from "./gui/pages/lobby";
import { Login } from "./gui/pages/login";
import { MainMenu } from "./gui/pages/mainMenu";
import { NewGame } from "./gui/pages/newGame";
import { Registration } from "./gui/pages/registration";
import { Statistic } from "./gui/pages/statistic";
import { canvasHeight, canvasWidth, ctx } from "./init";

export class Program {
  private state: GameState;
  private gui: GUI;

  constructor() {
    this.state = GameState.MainMenu;
    this.gui = new MainMenu("Menu");

    document.addEventListener("mousedown", (e: MouseEvent) => {
      if (this.state !== GameState.Game) {
        const [mouseX, mouseY] = [e.clientX, e.clientY];

        this.gui.getButtons().map((button) => {
          if (button.isClicked(mouseX, mouseY)) {
            this.state = button.getState();
            this.gui.clearbuttons();
            this.updateGui(this.state);
          }
        });
      }
    });
  }

  private updateGui(state: GameState): void {
    switch (state) {
      case GameState.MainMenu:
        this.gui = new MainMenu("Menu");
        break;
      case GameState.Statistic:
        this.gui = new Statistic("Statisztika");
        break;
      case GameState.Description:
        this.gui = new Description("Játékmenet");
        break;
      case GameState.Login:
        this.gui = new Login("Bejelentkezés");
        break;
      case GameState.Registration:
        this.gui = new Registration("Regisztráció");
        break;
      case GameState.NewGame:
        this.gui = new NewGame("Új játék");
        break;
      case GameState.JoinGame:
        this.gui = new Join("Csatlakozas");
        break;
      case GameState.Lobby:
        this.gui = new Lobby("Váró");
        break;
    }
  }

  draw(): void {
    ctx.beginPath();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "#b58b5e";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    this.gui.draw();

    ctx.closePath();
  }

  update(dt: number): void {}
}
