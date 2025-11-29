import { Frame } from "@/page/components/frame";
import { Text } from "@/page/components/text";
import type { ColorType } from "@/types/game.types";
import type { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { Timer } from "@/utils/timer";

/**
 * Az érkezett üzenetek, itt fognak megjelenni.
 */
export class ChatFrame extends Frame {
  private texts: {
    text: Text;
    timer: Timer;
  }[];
  private positions: Record<number, Position>;
  private maxTextItem: number = 7;

  constructor(pos: Position, dim: Dimension) {
    super(pos, dim, { alpha: 0.9, color: "#2d2d32d9" });

    this.texts = [];
    this.positions = {
      0: new Position(pos.x, pos.y + 25),
      1: new Position(pos.x, pos.y + 55),
      2: new Position(pos.x, pos.y + 85),
      3: new Position(pos.x, pos.y + 115),
      4: new Position(pos.x, pos.y + 145),
      5: new Position(pos.x, pos.y + 175),
      6: new Position(pos.x, pos.y + 205),
    };
  }

  public draw(): void {
    if (this.texts.length > 0) {
      super.draw();

      this.texts.forEach(({ text }) => {
        text.draw();
      });
    }
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);

    this.texts.forEach(({ timer }) => {
      if (timer.isTimerActive()) {
        timer.update();
      }
    });
  }

  /**
   * Új üzenet hozzáadása a listához
   * @param name játékos neve
   * @param message üzenet
   * @param color szín
   */
  public pushText(name: string, message: string, color: ColorType): void {
    const t: string = `${name}: ${message}`;
    const text: Text = new Text(this.positions[0], t, {
      color,
      fontSize: "24px",
    });

    text.setEnd(this.pos, this.dim);

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
    this.texts.forEach(({ text }, idx) => {
      text.setPos(this.positions[idx]);
      text.setEnd(this.pos, this.dim);
    });
  }
}
