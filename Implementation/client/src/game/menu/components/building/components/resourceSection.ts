import { ctx } from "../../../../../init";
import { Text } from "../../../../../page/components/textComponents/text";
import { BLACK_COLOR } from "../../../../../settings";
import { Position } from "../../../../../utils/position";
import { LabelButton } from "../../labelButton";
import { Section } from "../../section";

export class ResourceSection extends Section {
  // private text: Text;
  // private readonly title: string = "Erőforrás";

  private woodCutter: LabelButton;
  private stoneCutter: LabelButton;

  public constructor(pos: Position, width: number, height: number) {
    super(pos, width, height);

    this.woodCutter = new LabelButton(
      new Position(pos.x, pos.y),
      0,
      0,
      "",
      "woodcutter"
    );
    this.stoneCutter = new LabelButton(
      new Position(pos.x + 96 + 19, pos.y),
      0,
      0,
      "",
      "stonecutter"
    );

    this.labelbuttons.push(this.woodCutter);
    this.labelbuttons.push(this.stoneCutter);

    // this.text = new Text(
    //   new Position(
    //     pos.x + width / 2 - ctx.measureText(this.title).width / 2,
    //     pos.y
    //   ),
    //   0,
    //   0,
    //   this.title,
    //   false,
    //   BLACK_COLOR
    // );
  }

  draw(): void {
    super.draw();
    // this.text.draw();
  }
}
