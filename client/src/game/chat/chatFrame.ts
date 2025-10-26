import { Frame } from "@/page/components/frame";
import { Text } from "@/page/components/text";
import type { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class ChatFrame extends Frame {
  private title: Text;
  constructor(pos: Position, dim: Dimension) {
    super(pos, dim, 0.85);

    this.title = new Text(new Position(pos.x, pos.y), "Csevegés", {
      fontSize: "28px",
    });
  }

  public draw(): void {
    super.draw();
    this.title.draw();
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);
    this.title.setCenter({
      xFrom: this.pos.x,
      xTo: this.dim.width,
      yFrom: this.pos.y + 25,
      yTo: 0,
    });
  }
}
