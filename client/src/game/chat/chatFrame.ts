import { Frame } from "@/page/components/frame";
import { Text } from "@/page/components/text";
import type { ColorType } from "@/types/game.types";
import type { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { Timer } from "@/utils/timer";

export class ChatFrame extends Frame {
  private texts: {
    text: Text;
    timer: Timer;
  }[];
  private positions: Record<number, Position>;
  private maxTextItem: number = 7;

  constructor(pos: Position, dim: Dimension) {
    super(pos, dim, 1);

    this.texts = [];
    this.positions = {
      0: new Position(pos.x, pos.y),
      1: new Position(pos.x, pos.y + 30),
      2: new Position(pos.x, pos.y + 60),
      3: new Position(pos.x, pos.y + 90),
      4: new Position(pos.x, pos.y + 120),
      5: new Position(pos.x, pos.y + 150),
      6: new Position(pos.x, pos.y + 180),
    };
  }

  public draw(): void {
    this.texts.forEach(({ text }) => {
      text.setEnd(this.pos, this.dim);
      text.draw();
    });
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);

    this.texts.forEach(({ timer }) => {
      if (timer.isTimerActive()) {
        timer.update();
      }
    });
  }

  public pushText(name: string, message: string, color: ColorType): void {
    const t: string = `(${name}): ${message}`;
    const text: Text = new Text(this.positions[0], t, {
      color,
      fontSize: "24px",
    });
    const timer: Timer = new Timer(7000, () => this.removeElement());

    this.texts.unshift({ text, timer });
    timer.activate();

    if (this.texts.length === this.maxTextItem) {
      const lastText = this.texts[this.texts.length - 1];
      lastText.timer.deactivate();
      this.texts.pop();
    }

    this.reOrderTexts();
  }

  private removeElement(): void {
    this.texts.pop();
  }

  private reOrderTexts(): void {
    this.texts.forEach(({ text }, idx) => text.setPos(this.positions[idx]));
  }
}
