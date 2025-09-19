import { Section } from "@/game/menu/components/section";
import { Text } from "@/page/components/text";
import { Dimension } from "@/utils/dimension";
import { Position } from "@/utils/position";

export class StorageSection extends Section {
  private t: Text;
  constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.t = new Text(
      new Position(10, 10),
      "asdfaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      {
        fontSize: "14px",
      }
    );
    console.log(this.t);
  }

  public draw(): void {
    super.draw();
    this.t.draw();
  }

  public update(dt: number, mousePos: Position): void {
    super.update(dt, mousePos);
  }
}
