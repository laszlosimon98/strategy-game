import { ctx } from "../../../init";
import { textColor, bcgColor } from "../../../settings";
import { PosType } from "../../../types/guiTypes";
import { MousePos } from "../../../types/mouseTypes";
import { Text } from "./text";

export class TextInput extends Text {
  private backgroundColor: string;
  private isSelected: boolean;

  private readonly controller: AbortController;

  constructor(
    pos: PosType,
    width: number,
    height: number,
    text: string,
    backgroundColor: string,
    isSecret: boolean
  ) {
    super(pos, width, height, text, isSecret);

    this.controller = new AbortController();

    this.backgroundColor = backgroundColor;
    this.isSelected = false;

    document.addEventListener(
      "click",
      (e: MouseEvent) => {
        this.toggleSelected({ x: e.clientX, y: e.clientY });
      },
      { signal: this.controller.signal }
    );

    document.addEventListener(
      "keydown",
      (e: KeyboardEvent) => {
        if (this.isSelected) {
          this.updateText(e.key);
        }
      },
      { signal: this.controller.signal }
    );
  }

  draw(): void {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    ctx.fillStyle = textColor;
    if (this.isSelected) {
      ctx.fillText(
        "|",
        this.pos.x + this.metrics.width + 5,
        this.pos.y + this.height - 13
      );
    }

    ctx.fillStyle = bcgColor;
    super.draw();
  }

  updateText(key: string): void {
    if (key === "Backspace") {
      this.text = this.text.slice(0, this.text.length - 1);
    } else if (key.match(/^[a-zA-Z0-9]+$/) && key.length === 1) {
      this.text += key;
    }
    this.metrics = ctx.measureText(
      !this.isSecret
        ? this.text
        : new Array(this.text.length).fill("*").join("")
    );
  }

  toggleSelected(mousePos: MousePos): void {
    const x = mousePos.x > this.pos.x && mousePos.x < this.pos.x + this.width;
    const y = mousePos.y > this.pos.y && mousePos.y < this.pos.y + this.height;
    this.isSelected = x && y;
  }

  getText(): string {
    return this.text;
  }

  removeEventListeners(): void {
    this.controller.abort();
  }
}
