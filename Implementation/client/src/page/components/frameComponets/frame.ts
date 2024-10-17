import { ctx } from "../../../init";
import { INPUT_BACKGROUND_COLOR } from "../../../settings";
import { Dimension } from "../../../utils/dimension";
import { Position } from "../../../utils/position";
import { Button } from "../buttonComponents/button";
import { PageComponents } from "../pageComponents";

export class Frame extends PageComponents {
  protected buttons: Button[] = [];

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
  }

  public draw(): void {
    super.draw();

    ctx.save();

    ctx.fillStyle = INPUT_BACKGROUND_COLOR;
    ctx.fillRect(this.pos.x, this.pos.y, this.dim.width, this.dim.height);

    this.buttons.forEach((btn) => btn.draw());

    ctx.restore();
  }

  public getButtons(): Button[] {
    return this.buttons;
  }
}
