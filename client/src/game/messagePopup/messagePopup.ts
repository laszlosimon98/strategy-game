import { Frame } from "@/page/components/frame";
import { Text } from "@/page/components/text";
import { settings } from "@/settings";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";
import { Timer } from "@/utils/timer";

export class MessagePopup extends Frame {
  private text: Text;
  private visibilityTimer: Timer;

  constructor(pos: Position, dim: Dimension) {
    super(pos, dim, { alpha: 0.85 });

    this.text = new Text(new Position(this.pos.x, this.pos.y), "", {
      fontSize: "16px",
    });
    this.visibilityTimer = new Timer(settings.timer.visibilityInMs);
  }

  public draw(): void {
    if (this.visibilityTimer.isTimerActive()) {
      super.draw();

      this.text.draw();
    }
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);
    this.visibilityTimer.update();
  }

  public setText(text: string): void {
    this.text.setText(text);

    this.text.setCenter({
      xFrom: this.pos.x,
      xTo: this.dim.width,
      yFrom: this.pos.y,
      yTo: this.dim.height,
    });

    this.visibilityTimer.activate();
  }
}
