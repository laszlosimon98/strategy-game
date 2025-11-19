import { PageComponents } from "@/page/components/pageComponents";
import type { Dimension } from "@/utils/dimension";
import type { Position } from "@/utils/position";

export abstract class ClickablePageComponents extends PageComponents {
  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
  }

  public isClicked(mouseX: number, mouseY: number) {
    const x = mouseX >= this.pos.x && mouseX <= this.pos.x + this.dim.width;
    const y = mouseY >= this.pos.y && mouseY <= this.pos.y + this.dim.height;
    return x && y;
  }
}
