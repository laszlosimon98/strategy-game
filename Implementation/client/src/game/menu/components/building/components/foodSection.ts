import { ctx } from "../../../../../init";
import { Text } from "../../../../../page/components/textComponents/text";
import { BLACK_COLOR } from "../../../../../settings";
import { Dimension } from "../../../../../utils/dimension";
import { Position } from "../../../../../utils/position";
import { Section } from "../../section";

export class FoodSection extends Section {
  private text: Text;
  private readonly title: string = "Élelem";

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.text = new Text(
      new Position(
        pos.x + dim.width / 2 - ctx.measureText(this.title).width / 2,
        pos.y
      ),
      Dimension.zero(),
      this.title,
      false,
      BLACK_COLOR
    );
  }

  draw(): void {
    super.draw();
    this.text.draw();
  }
}
