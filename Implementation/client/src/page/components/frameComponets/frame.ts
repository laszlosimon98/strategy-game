import { ctx } from "../../../init";
import { INPUT_BACKGROUND_COLOR } from "../../../settings";
import { Vector } from "../../../utils/vector";
import { PageComponents } from "../pageComponents";

export class Frame extends PageComponents {
  constructor(pos: Vector, width: number, height: number) {
    super(pos, width, height);
  }

  draw(): void {
    super.draw();

    ctx.save();

    ctx.fillStyle = INPUT_BACKGROUND_COLOR;
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    ctx.restore();
  }
}
