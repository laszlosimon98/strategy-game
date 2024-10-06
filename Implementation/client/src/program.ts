import { PageState } from "./states/pageState";
import { titles } from "./page/imports/titles";
import { Description } from "./page/views/description";
import { Join } from "./page/views/join";
import { Lobby } from "./page/views/lobby";
import { Login } from "./page/views/auth/login";
import { MainMenu } from "./page/views/mainMenu";
import { NewGame } from "./page/views/newGame";
import { Statistic } from "./page/views/statistic";
import { canvasHeight, canvasWidth, ctx } from "./init";
import { Registration } from "./page/views/auth/registration";
import { buttonImages } from "./page/imports/buttons";
import { Button } from "./page/components/buttonComponents/button";
import { TextInput } from "./page/components/textComponents/textInput";
import { BACKGROUND_COLOR, BLACK_COLOR } from "./settings";
import { globalState } from "./data/data";
import { Page } from "./page/views/page";
import { Game } from "./game/game";
import { ServerHandler } from "./server/serverHandler";
import { Point } from "./utils/point";

export class Program {
  private pages: Partial<Record<PageState, Page>>;
  private buttons?: Button[];
  private inputs?: TextInput[];

  private game: Game | undefined;
  private mousePos: Point;

  constructor() {
    this.mousePos = Point.zero();

    this.pages = {
      [PageState.MainMenu]: new MainMenu(titles.menu),
      [PageState.Registration]: new Registration(
        titles.registration,
        buttonImages.registration
      ),
      [PageState.Login]: new Login(titles.login, buttonImages.login),
      [PageState.Statistic]: new Statistic(titles.statistic),
      [PageState.Description]: new Description(titles.description),
      [PageState.NewGame]: new NewGame(titles.newGame),
      [PageState.Lobby]: new Lobby(titles.lobby),
      [PageState.JoinGame]: new Join(titles.join),
    };

    this.buttons = this.pages[globalState.state]?.getButtons();

    document.addEventListener("mousedown", (e: MouseEvent) =>
      this.handleMouseClick(e)
    );

    document.addEventListener("mousemove", (e: MouseEvent) =>
      this.handleMouseMove(e)
    );

    document.addEventListener("keydown", (e: KeyboardEvent) =>
      this.handleKeyBoard(e)
    );

    document.addEventListener("contextmenu", (e: MouseEvent) =>
      e.preventDefault()
    );

    window.addEventListener("resize", () => {
      this.pages[globalState.state]?.resize();
    });

    ServerHandler.receiveMessage("game:starts", () => {
      globalState.state = PageState.Game;
      this.game = new Game();
    });
  }

  draw(): void {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (globalState.state !== PageState.Game) {
      ctx.fillStyle = BACKGROUND_COLOR;
      this.pages[globalState.state]?.draw();
    } else {
      ctx.fillStyle = BLACK_COLOR;
      this.game?.draw();
    }
  }

  update(dt: number): void {
    if (globalState.state !== PageState.Game) {
      this.buttons?.map((btn) => btn.update(this.mousePos));
      this.pages[globalState.state]?.update();
    } else {
      this.game?.update(dt);
    }
  }

  createNewpageElement(state: PageState, page: Page): void {
    this.pages = {
      ...this.pages,
      [state]: page,
    };
  }

  private handleMouseClick(e: MouseEvent) {
    const [x, y] = [e.clientX, e.clientY];

    if (globalState.state !== PageState.Game) {
      this.buttons?.map(async (btn) => {
        if (btn.isClicked(x, y)) {
          btn.click();
          await btn.handleError();

          this.updateButtons();
          this.updateInputs();
          this.inputs?.map((input) => input.clearText());
        }
      });

      this.inputs?.map((input) => {
        input.setIsSelected(false);
        if (input.isClicked(x, y)) {
          input.setIsSelected(true);
        }
      });
    } else {
      this.game?.handleClick();
    }

    if (globalState.state === PageState.Game && !this.game) {
      ServerHandler.sendMessage("game:starts", {});
      this.game = new Game();
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    this.mousePos.setPoint(new Point(e.clientX, e.clientY));
    this.game?.updateMousePos(this.mousePos);
  }

  private handleKeyBoard(e: KeyboardEvent): void {
    this.inputs?.map((input) => {
      if (input.getIsSelected()) {
        input.updateText(e.key);
      }
    });
  }

  private updateButtons(): void {
    this.buttons = this.pages[globalState.state]?.getButtons();
  }

  private updateInputs(): void {
    this.inputs = this.pages[globalState.state]?.getInputs();
  }
}
