import { PosType } from "../../../types/guiTypes";
import { MenuComponent } from "./menuComponent";

export class Button extends MenuComponent {
  private isClicked: boolean;
  private controller: AbortController;
  private isSuccess: boolean;

  constructor(
    pos: PosType,
    width: number,
    height: number,
    imageSrc: string,
    fn: Function
  ) {
    super(pos, width, height, imageSrc);

    this.isClicked = false;
    this.isSuccess = false;
    this.controller = new AbortController();

    document.addEventListener(
      "mousedown",
      (e: MouseEvent) => {
        this.setClicked(e.clientX, e.clientY);

        if (this.isClicked) {
          fn();
          this.isSuccess = true;
        }
      },
      { signal: this.controller.signal }
    );
  }

  private setClicked(mouseX: number, mouseY: number): void {
    const x = mouseX >= this.pos.x && mouseX <= this.pos.x + this.width;
    const y = mouseY >= this.pos.y && mouseY <= this.pos.y + this.height;
    this.isClicked = x && y;
  }

  draw() {
    super.draw();
  }

  isButtonClicked(): boolean {
    return this.isClicked;
  }

  isSuccessFull(): boolean {
    return this.isSuccess;
  }

  removeEventListener(): void {
    this.controller.abort();
  }
}
