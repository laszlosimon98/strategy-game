import { state } from "@/data/state";
import { PageState } from "@/enums/pageState";
import { Game } from "@/game/game";
import { ctx, canvasWidth, canvasHeight } from "@/init";
import { Button } from "@/page/components/button";
import { TextInput } from "@/page/components/textInput";
import { Login } from "@/page/views/auth/login";
import { Registration } from "@/page/views/auth/registration";
import { Description } from "@/page/views/description";
import { Join } from "@/page/views/join";
import { Lobby } from "@/page/views/lobby";
import { MainMenu } from "@/page/views/mainMenu";
import { NewGame } from "@/page/views/newGame";
import { Page } from "@/page/views/page";
import { Statistic } from "@/page/views/statistic";
import { ServerHandler } from "@/server/serverHandler";
import { settings } from "@/settings";
// import { BACKGROUND_COLOR, BLACK_COLOR } from "@/settings";
import { Position } from "@/utils/position";

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
      [PageState.MainMenu]: new MainMenu("menu"),
      [PageState.Registration]: new Registration("registration"),
      [PageState.Login]: new Login("login"),
      [PageState.Statistic]: new Statistic("statistic"),
      [PageState.Description]: new Description("description"),
      [PageState.NewGame]: new NewGame("newGame"),
      [PageState.Lobby]: new Lobby("lobby"),
      [PageState.JoinGame]: new Join("join"),
    };

    this.buttons = this.pages[state.navigation.pageState]?.getButtons();

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
      this.pages[state.navigation.pageState]?.resize();
    });

    ServerHandler.receiveMessage("game:starts", () => {
      state.navigation.pageState = PageState.Game;
      this.game = new Game();
    });
  }

  public draw(): void {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (state.navigation.pageState !== PageState.Game) {
      ctx.fillStyle = settings.color.background;
      this.pages[state.navigation.pageState]?.draw();
    } else {
      ctx.fillStyle = settings.color.black;
      this.game?.draw();
    }
  }

  public update(dt: number): void {
    if (state.navigation.pageState !== PageState.Game) {
      this.buttons?.map((btn) => btn.update(dt, this.mousePos));
      this.pages[state.navigation.pageState]?.update();
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

    if (state.navigation.pageState !== PageState.Game) {
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
    this.buttons = this.pages[state.navigation.pageState]?.getButtons();
  }

  private updateInputs(): void {
    this.inputs = this.pages[state.navigation.pageState]?.getInputs();
  }
}
