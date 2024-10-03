import { ctx } from "../../../../../../init";
import { Text } from "../../../../../../page/components/textComponents/text";
import { BLACK_COLOR } from "../../../../../../settings";
import { Vector } from "../../../../../../utils/vector";
import { Section } from "../../section";

export class FoodSection extends Section {
  private text: Text;
  private readonly title: string = "Élelem";

  constructor(pos: Vector, width: number, height: number) {
    super(pos, width, height);

    this.text = new Text(
      new Vector(
        pos.x + width / 2 - ctx.measureText(this.title).width / 2,
        pos.y
      ),
      0,
      0,
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
