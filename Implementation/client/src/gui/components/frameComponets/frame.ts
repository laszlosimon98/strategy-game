import { ctx } from "../../../init";
import { INPUT_BACKGROUND_COLOR } from "../../../settings";
import { PosType } from "../../../types/guiTypes";
import { GUIComponents } from "../guiComponents";

export class Frame extends GUIComponents {
  constructor(pos: PosType, width: number, height: number) {
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
