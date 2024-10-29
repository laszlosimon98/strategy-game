import { ITEM_OFFSET, ITEM_SIZE } from "../../../../../settings";
import { Dimension } from "../../../../../utils/dimension";
import { Position } from "../../../../../utils/position";
import { LabelButton } from "../../labelButton";
import { Section } from "../../section";

export class StorageSection extends Section {
  private storage: LabelButton;
  private residence: LabelButton;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.storage = new LabelButton(
      new Position(pos.x, pos.y),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "storage"
    );

    this.residence = new LabelButton(
      new Position(pos.x + ITEM_SIZE + ITEM_OFFSET, pos.y),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "residence"
    );

    this.labelbuttons.push(this.storage);
    this.labelbuttons.push(this.residence);
  }

  draw(): void {
    super.draw();
  }
}
