import { Section } from "@/game/menu/sections/section";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class StorageSection extends Section {
  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);
    this.drawFrame = false;
  }

  draw(): void {
    super.draw();
  }
}
