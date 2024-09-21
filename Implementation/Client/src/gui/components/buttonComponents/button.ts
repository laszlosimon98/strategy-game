import { GameState } from "../../../enums/gameState";
import { ctx } from "../../../init";
import { PosType } from "../../../types/guiTypes";
import { MenuComponent } from "./menuComponent";

export class Button extends MenuComponent {
  private nextState: GameState;
  private func: Function[];

  private isHovered: boolean;

  constructor(
    pos: PosType,
    width: number,
    height: number,
    imageSrc: string,
    nextState: GameState,
    ...fn: Function[]
  ) {
    super(pos, width, height, imageSrc);
    this.nextState = nextState;
    this.func = fn;

    this.isHovered = false;
  }

  draw() {
    if (this.isHovered) {
      ctx.save();
      ctx.globalAlpha = 0.8;
      super.draw();
      ctx.restore();
    } else {
      super.draw();
    }
  }

  update(mousePos: any) {
    const { x, y } = mousePos;
    if (this.isMouseHover(x, y)) {
      this.isHovered = true;
    } else {
      this.isHovered = false;
    }
  }

  click(): void {
    this.func.map((fn) => fn());
  }

  getNextState(): GameState {
    return this.nextState;
  }

  setNextState(state: GameState): void {
    this.nextState = state;
  }
}
