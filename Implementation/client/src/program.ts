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
import { Registration } from "./gui/pages/auth/registration";
import { buttonImages } from "./gui/imports/buttons";
import { Button } from "./gui/components/buttonComponents/button";
import { MousePos } from "./types/mouseTypes";
import { TextInput } from "./gui/components/textComponents/textInput";
import { BACKGROUND_COLOR } from "./settings";
import { globalState } from "./data/data";

export class Program {
  // private currentState: GameState;
  private guiElements: Partial<Record<GameState, GUI>>;
  private mousePos: MousePos;
  private buttons?: Button[];
  private inputs?: TextInput[];

  constructor() {
    // this.currentState = GameState.MainMenu;
    this.mousePos = { x: 0, y: 0 };

    this.guiElements = {
      [GameState.MainMenu]: new MainMenu(titles.menu),
      [GameState.Registration]: new Registration(
        titles.registration,
        buttonImages.registration
      ),
      [GameState.Login]: new Login(titles.login, buttonImages.login),
      [GameState.Statistic]: new Statistic(titles.statistic),
      [GameState.Description]: new Description(titles.description),
      [GameState.NewGame]: new NewGame(titles.newGame),
      [GameState.Lobby]: new Lobby(titles.lobby),
      [GameState.JoinGame]: new Join(titles.join),
    };

    this.buttons = this.guiElements[globalState.state]?.getButtons();

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
  }

  draw(): void {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (globalState.state !== GameState.Game) {
      ctx.fillStyle = BACKGROUND_COLOR;
      this.guiElements[globalState.state]?.draw();
    } else {
      ctx.fillStyle = "#000";
    }
  }

  update(dt: number): void {
    this.buttons?.map((btn) => btn.update(this.mousePos));
    this.guiElements.MainMenu?.update();
  }

  createNewGUIElement(state: GameState, gui: GUI): void {
    this.guiElements = {
      ...this.guiElements,
      [state]: gui,
    };
  }

  private handleMouseClickEvent(e: MouseEvent) {
    const { x, y } = this.mousePos;

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
  }

  private handleMouseMoveEvent(e: MouseEvent): void {
    this.mousePos = {
      x: e.clientX,
      y: e.clientY,
    };
  }

  private handleKeyBoardEvent(e: KeyboardEvent): void {
    this.inputs?.map((input) => {
      if (input.getIsSelected()) {
        input.updateText(e.key);
      }
    });
  }

  private updateButtons(): void {
    this.buttons = this.guiElements[globalState.state]?.getButtons();
  }

  private updateInputs(): void {
    this.inputs = this.guiElements[globalState.state]?.getInputs();
  }
}
