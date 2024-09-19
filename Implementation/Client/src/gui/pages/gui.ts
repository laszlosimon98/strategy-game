import { GameState } from "../../enums/gameState";
import { ctx } from "../../init";
import { titleSize } from "../../settings";
import { Button } from "../components/buttonComponents/button";
import { titlePos } from "./pos/titlePos";

export class GUI {
  private state: GameState;

  protected title: HTMLImageElement;
  protected buttons: Button[];

  protected constructor(title: string) {
    this.buttons = new Array<Button>();

    this.title = new Image();
    this.title.src = title;
    this.state = GameState.MainMenu;
  }

  getState(): GameState {
    return this.state;
  }

  setState(state: GameState): void {
    this.state = state;
  }

  getButtons(): Button[] {
    return this.buttons;
  }

  draw() {
    ctx.drawImage(
      this.title,
      titlePos.x,
      titlePos.y,
      titleSize.width,
      titleSize.height
    );

    this.buttons.map((button) => {
      button.draw();
    });
  }
}
