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
import { Vector } from "./utils/vector";
import { ServerHandler } from "./server/serverHandler";

export class Program {
  private pages: Partial<Record<PageState, Page>>;
  private buttons?: Button[];
  private inputs?: TextInput[];

  private game: Promise<Game> | undefined;

  constructor() {
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
      this.handleMouseClickEvent(e)
    );

    document.addEventListener("mousemove", (e: MouseEvent) =>
      this.handleMouseMoveEvent(e)
    );

    document.addEventListener("keydown", (e: KeyboardEvent) =>
      this.handleKeyBoardEvent(e)
    );

    document.addEventListener("contextmenu", (e: MouseEvent) =>
      e.preventDefault()
    );

    window.addEventListener("resize", () => {
      this.pages[globalState.state]?.resize();
    });

    ServerHandler.receiveMessage("game:starts", () => {
      globalState.state = PageState.Game;
      this.game = Game.create();
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
      this.game?.then((game) => game.draw());
    }
  }

  update(dt: number): void {
    if (globalState.state !== PageState.Game) {
      this.buttons?.map((btn) => btn.update());
      this.pages[globalState.state]?.update();
    } else {
      this.game?.then((game) => game.update(dt));
    }
  }

  createNewpageElement(state: PageState, page: Page): void {
    this.pages = {
      ...this.pages,
      [state]: page,
    };
  }

  private handleMouseClickEvent(e: MouseEvent) {
    const { x, y } = globalState.mousePos;

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
      this.game?.then((game) => game.handleClick(e));
    }

    if (globalState.state === PageState.Game && !this.game) {
      ServerHandler.sendMessage("game:starts", {});
      this.game = Game.create();
    }
  }

  private handleMouseMoveEvent(e: MouseEvent): void {
    globalState.mousePos.setVector(new Vector(e.clientX, e.clientY));
  }

  private handleKeyBoardEvent(e: KeyboardEvent): void {
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
