import { GameState } from "../../enums/gameState";
import { PosType } from "../../types/guiTypes";
import { MenuComponent } from "./menuComponent";

export class Button extends MenuComponent {
  private navigateState: GameState;

  constructor(
    pos: PosType,
    width: number,
    height: number,
    imageSrc: string,
    navigateState: GameState
  ) {
    super(pos, width, height, imageSrc);

    this.navigateState = navigateState;
  }

  draw() {
    super.draw();
  }

  getState(): GameState {
    return this.navigateState;
  }

  isClicked(mouseX: number, mouseY: number): boolean {
    const x = mouseX >= this.pos.x && mouseX <= this.pos.x + this.width;
    const y = mouseY >= this.pos.y && mouseY <= this.pos.y + this.height;
    return x && y;
  }
}
