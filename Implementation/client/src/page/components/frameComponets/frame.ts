import { ctx } from "../../../init";
import { INPUT_BACKGROUND_COLOR } from "../../../settings";
import { Position } from "../../../utils/position";
import { Button } from "../buttonComponents/button";
import { PageComponents } from "../pageComponents";

export class Frame extends PageComponents {
  protected buttons: Button[] = [];

  public constructor(pos: Position, width: number, height: number) {
    super(pos, width, height);
  }

  public draw(): void {
    super.draw();

    ctx.save();

    ctx.fillStyle = INPUT_BACKGROUND_COLOR;
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    this.buttons.forEach((btn) => btn.draw());

    ctx.restore();
  }

  public getButtons(): Button[] {
    return this.buttons;
  }
}
