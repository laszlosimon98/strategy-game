import { PageState } from "./states/pageState";
import { Description } from "./page/views/description";
import { Join } from "./page/views/join";
import { Lobby } from "./page/views/lobby";
import { Login } from "./page/views/auth/login";
import { MainMenu } from "./page/views/mainMenu";
import { NewGame } from "./page/views/newGame";
import { Statistic } from "./page/views/statistic";
import { canvasHeight, canvasWidth, ctx } from "./init";
import { Registration } from "./page/views/auth/registration";
import { Button } from "./page/components/buttonComponents/button";
import { TextInput } from "./page/components/textComponents/textInput";
import { BACKGROUND_COLOR, BLACK_COLOR } from "./settings";
import { globalState } from "./data/data";
import { Page } from "./page/views/page";
import { Game } from "./game/game";
import { ServerHandler } from "./server/serverHandler";
import { Position } from "./utils/position";
import { images } from "./data/images";

export class Program {
  private pages: Partial<Record<PageState, Page>>;
  private buttons?: Button[];
  private inputs?: TextInput[];

  private game: Game | undefined;
  private mousePos: Position;
  private key: string;

  public constructor() {
    this.mousePos = Position.zero();
    this.key = "";

    this.pages = {
      [PageState.MainMenu]: new MainMenu(images.page.titles.menu.url),
      [PageState.Registration]: new Registration(
        images.page.titles.registration.url,
        images.page.buttons.registration.url
      ),
      [PageState.Login]: new Login(
        images.page.titles.login.url,
        images.page.buttons.login.url
      ),
      [PageState.Statistic]: new Statistic(images.page.titles.statistic.url),
      [PageState.Description]: new Description(
        images.page.titles.description.url
      ),
      [PageState.NewGame]: new NewGame(images.page.titles.newGame.url),
      [PageState.Lobby]: new Lobby(images.page.titles.lobby.url),
      [PageState.JoinGame]: new Join(images.page.titles.join.url),
    };

    this.buttons = this.pages[globalState.state]?.getButtons();

    document.addEventListener("mousedown", (e: MouseEvent) =>
      this.handleMouseClick(e)
    );

    document.addEventListener("mousemove", (e: MouseEvent) =>
      this.handleMouseMove(e)
    );

    document.addEventListener("keydown", (e: KeyboardEvent) =>
      this.handleKeyDown(e)
    );

    document.addEventListener("keyup", () => {
      this.handleKeyUp();
    });

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

  public draw(): void {
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

  public update(dt: number): void {
    if (globalState.state !== PageState.Game) {
      this.buttons?.map((btn) => btn.update(this.mousePos));
      this.pages[globalState.state]?.update();
    } else {
      this.game?.update(dt);
    }
  }

  public createNewpageElement(state: PageState, page: Page): void {
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
      this.game?.handleClick(e);
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    this.mousePos.setPosition(new Position(e.clientX, e.clientY));
    this.game?.handleMouseMove(this.mousePos);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    this.key = e.key;

    this.inputs?.map((input) => {
      if (input.getIsSelected()) {
        input.updateText(e.key);
      }
    });

    this.game?.handleKeyPress(this.key);
  }

  private handleKeyUp(): void {
    this.key = "";
    this.game?.handleKeyPress(this.key);
  }

  private updateButtons(): void {
    this.buttons = this.pages[globalState.state]?.getButtons();
  }

  private updateInputs(): void {
    this.inputs = this.pages[globalState.state]?.getInputs();
  }
}
