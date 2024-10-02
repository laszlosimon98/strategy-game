import { canvasHeight } from "../init";
import { Vector } from "../utils/vector";
import { GameMenu } from "./components/menu/gameMenu";

export class Game {
  private gameMenu: GameMenu;

  constructor() {
    this.gameMenu = new GameMenu(
      new Vector(0, canvasHeight / 2 - 350),
      300,
      500
    );
  }

  handleClick(e: MouseEvent) {
    this.gameMenu.handleClick();
  }

  draw(): void {
    this.gameMenu.draw();
  }

  update(dt: number) {
    this.gameMenu.update();
  }

  resize(): void {
    this.gameMenu.resize();
  }
}
