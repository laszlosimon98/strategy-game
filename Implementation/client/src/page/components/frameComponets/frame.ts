import { ctx } from "../../../init";
import { INPUT_BACKGROUND_COLOR } from "../../../settings";
import { Vector } from "../../../utils/vector";
import { Button } from "../buttonComponents/button";
import { PageComponents } from "../pageComponents";

export class Frame extends PageComponents {
  protected buttons: Button[] = [];

  constructor(pos: Vector, width: number, height: number) {
    super(pos, width, height);
  }

  draw(): void {
    super.draw();

    ctx.save();

    ctx.fillStyle = INPUT_BACKGROUND_COLOR;
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    this.buttons.forEach((btn) => btn.draw());

    ctx.restore();
  }

  getButtons(): Button[] {
    return this.buttons;
  }
}
