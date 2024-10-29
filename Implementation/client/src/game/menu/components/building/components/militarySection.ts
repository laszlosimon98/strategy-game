import { ITEM_OFFSET, ITEM_SIZE } from "../../../../../settings";
import { Dimension } from "../../../../../utils/dimension";
import { Position } from "../../../../../utils/position";
import { LabelButton } from "../../labelButton";
import { Section } from "../../section";

export class MilitarySection extends Section {
  private ironSmelter: LabelButton;
  private weaponSmith: LabelButton;
  private toolSmith: LabelButton;
  private barracks: LabelButton;
  private guardHouse: LabelButton;

  public constructor(pos: Position, dim: Dimension) {
    super(pos, dim);

    this.ironSmelter = new LabelButton(
      new Position(pos.x, pos.y),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "ironsmelter"
    );

    this.weaponSmith = new LabelButton(
      new Position(pos.x + ITEM_SIZE + ITEM_OFFSET, pos.y),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "weaponsmith"
    );

    this.toolSmith = new LabelButton(
      new Position(pos.x, pos.y + ITEM_SIZE),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "toolsmith"
    );

    this.barracks = new LabelButton(
      new Position(pos.x + ITEM_SIZE + ITEM_OFFSET, pos.y + ITEM_SIZE),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "barracks"
    );

    this.guardHouse = new LabelButton(
      new Position(pos.x, pos.y + ITEM_SIZE * 2),
      new Dimension(ITEM_SIZE, ITEM_SIZE),
      "buildings",
      "empty",
      "ironsmelter"
    );

    this.labelbuttons.push(this.ironSmelter);
    this.labelbuttons.push(this.weaponSmith);
    this.labelbuttons.push(this.toolSmith);
    this.labelbuttons.push(this.barracks);
    this.labelbuttons.push(this.guardHouse);
  }

  draw(): void {
    super.draw();
  }
}
